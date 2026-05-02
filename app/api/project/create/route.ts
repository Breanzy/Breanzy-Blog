import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { revalidateTag } from "next/cache";
import { connectDB } from "@/lib/db";
import Project from "@/models/project.model";
import { auditEvent } from "@/lib/audit";
import { sanitizeRichHtml } from "@/lib/sanitizeHtml";
import { ensureSlug, slugifyTitle } from "@/lib/slug";
import { optionalString, readJsonObject, requiredString } from "@/lib/validation";

export async function POST(request: NextRequest) {
    const token = request.cookies.get("access_token")?.value;
    if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    let authUser: { id: string; isAdmin: boolean };
    try {
        authUser = jwt.verify(token, process.env.JWT_SECRET!) as { id: string; isAdmin: boolean };
    } catch {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    if (!authUser.isAdmin) {
        return NextResponse.json({ message: "You are not allowed to create a project" }, { status: 403 });
    }

    try {
        const body = await readJsonObject(request);
        const title = requiredString(body, "title", 180);
        const description = requiredString(body, "description", 2000);
        const content = sanitizeRichHtml(optionalString(body, "content", 250000));
        await connectDB();
        const baseSlug = ensureSlug(slugifyTitle(title));
        let slug = baseSlug;
        let suffix = 2;
        while (await Project.exists({ slug })) {
            slug = `${baseSlug}-${suffix++}`;
        }
        const newProject = new Project({
            title,
            description,
            content,
            image: optionalString(body, "image", 2000),
            techStack: Array.isArray(body.techStack) ? body.techStack.filter((item) => typeof item === "string").slice(0, 20) : [],
            liveUrl: optionalString(body, "liveUrl", 2000),
            repoUrl: optionalString(body, "repoUrl", 2000),
            featured: body.featured === true,
            category: optionalString(body, "category", 80) || "uncategorized",
            slug,
            userId: authUser.id,
        });
        const savedProject = await newProject.save();
        revalidateTag("projects", { expire: 0 });
        auditEvent("project.create", { actorId: authUser.id, targetId: String(savedProject._id), status: "success" });
        return NextResponse.json(savedProject, { status: 201 });
    } catch (error: any) {
        auditEvent("project.create", { actorId: authUser.id, status: "failure", detail: error.message });
        if (error.code === 11000) {
            return NextResponse.json({ message: "A project with this title already exists. Please retry." }, { status: 409 });
        }
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
