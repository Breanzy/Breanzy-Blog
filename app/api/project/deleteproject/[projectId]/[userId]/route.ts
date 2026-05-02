import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { revalidateTag } from "next/cache";
import { connectDB } from "@/lib/db";
import Project from "@/models/project.model";
import { auditEvent } from "@/lib/audit";

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ projectId: string; userId: string }> }) {
    const { projectId, userId } = await params;
    const token = request.cookies.get("access_token")?.value;
    if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    let authUser: { id: string; isAdmin: boolean };
    try {
        authUser = jwt.verify(token, process.env.JWT_SECRET!) as { id: string; isAdmin: boolean };
    } catch {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    if (!authUser.isAdmin || authUser.id !== userId) {
        return NextResponse.json({ message: "You do not have permission to delete this project" }, { status: 403 });
    }

    try {
        await connectDB();
        const deletedProject = await Project.findByIdAndDelete(projectId);
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
