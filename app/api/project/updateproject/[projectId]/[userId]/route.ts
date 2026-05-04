import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { connectDB } from "@/lib/db";
import Project from "@/models/project.model";
import { auditEvent } from "@/lib/audit";
import { requireAdminAccess } from "@/lib/auth";
import { getUniqueProjectSlug, readProjectWritePayload } from "@/lib/publishing";

export async function PUT(request: NextRequest, { params }: { params: Promise<{ projectId: string; userId: string }> }) {
    const { projectId, userId } = await params;
    const access = await requireAdminAccess(request, "You do not have permission to update this project");
    if (access.response) return access.response;
    const { authUser } = access;

    if (authUser.id !== userId) {
        return NextResponse.json({ message: "You do not have permission to update this project" }, { status: 403 });
    }

    try {
        const projectPayload = await readProjectWritePayload(request);
        await connectDB();
        const slug = await getUniqueProjectSlug(projectPayload.title, projectId);
        const updatedProject = await Project.findOneAndUpdate(
            { _id: projectId, userId: authUser.id },
            { $set: { ...projectPayload, slug } },
            { new: true }
        );
        if (!updatedProject) {
            return NextResponse.json({ message: "Project not found" }, { status: 404 });
        }
        revalidateTag("projects", { expire: 0 });
        auditEvent("project.update", { actorId: authUser.id, targetId: projectId, status: "success" });
        return NextResponse.json(updatedProject, { status: 200 });
    } catch (error: any) {
        auditEvent("project.update", { actorId: authUser.id, targetId: projectId, status: "failure", detail: error.message });
        if (error.code === 11000) {
            return NextResponse.json({ message: "A project with this title already exists. Please retry." }, { status: 409 });
        }
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
