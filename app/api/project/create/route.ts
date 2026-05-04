import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { connectDB } from "@/lib/db";
import Project from "@/models/project.model";
import { auditEvent } from "@/lib/audit";
import { requireAdminAccess } from "@/lib/auth";
import { getUniqueProjectSlug, readProjectWritePayload } from "@/lib/publishing";

export async function POST(request: NextRequest) {
    const access = await requireAdminAccess(request, "You are not allowed to create a project");
    if (access.response) return access.response;
    const { authUser } = access;

    try {
        const projectPayload = await readProjectWritePayload(request);
        await connectDB();
        const slug = await getUniqueProjectSlug(projectPayload.title);
        const newProject = new Project({
            ...projectPayload,
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
