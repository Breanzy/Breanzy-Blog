import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { updateTag } from "next/cache";
import { connectDB } from "@/lib/db";
import Project from "@/models/project.model";

export async function PUT(request: NextRequest, { params }: { params: Promise<{ projectId: string; userId: string }> }) {
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
        return NextResponse.json({ message: "You do not have permission to update this project" }, { status: 403 });
    }

    const body = await request.json();

    try {
        await connectDB();
        const updatedProject = await Project.findByIdAndUpdate(
            projectId,
            {
                $set: {
                    title: body.title,
                    description: body.description,
                    image: body.image,
                    techStack: body.techStack,
                    liveUrl: body.liveUrl,
                    repoUrl: body.repoUrl,
                    featured: body.featured,
                    category: body.category,
                    content: body.content,
                },
            },
            { new: true }
        );
        updateTag("projects");
        return NextResponse.json(updatedProject, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
