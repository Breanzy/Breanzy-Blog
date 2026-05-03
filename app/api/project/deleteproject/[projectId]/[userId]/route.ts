import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { connectDB } from "@/lib/db";
import Project from "@/models/project.model";
import { auditEvent } from "@/lib/audit";
import { requireAdmin } from "@/lib/auth";

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ projectId: string; userId: string }> }) {
    const { projectId, userId } = await params;
    let authUser: { id: string; isAdmin: boolean };
    try {
        authUser = await requireAdmin(request);
    } catch (error: any) {
        if (error.message === "Forbidden") {
            return NextResponse.json({ message: "You do not have permission to delete this project" }, { status: 403 });
        }
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    if (authUser.id !== userId) {
        return NextResponse.json({ message: "You do not have permission to delete this project" }, { status: 403 });
    }

    try {
        await connectDB();
        const deletedProject = await Project.findOneAndDelete({ _id: projectId, userId: authUser.id });
        if (!deletedProject) {
            return NextResponse.json({ message: "Project not found" }, { status: 404 });
        }
        revalidateTag("projects", { expire: 0 });
        auditEvent("project.delete", { actorId: authUser.id, targetId: projectId, status: "success" });
        return NextResponse.json("The project has been deleted", { status: 200 });
    } catch (error: any) {
        auditEvent("project.delete", { actorId: authUser.id, targetId: projectId, status: "failure", detail: error.message });
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
