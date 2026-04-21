import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { updateTag } from "next/cache";
import { connectDB } from "@/lib/db";
import Project from "@/models/project.model";

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

    const body = await request.json();
    if (!body.title || !body.description) {
        return NextResponse.json({ message: "Please provide all required fields" }, { status: 400 });
    }

    const slug = body.title
        .split(" ")
        .join("-")
        .toLowerCase()
        .replace(/[^a-zA-Z0-9-]/g, "");

    try {
        await connectDB();
        const newProject = new Project({ ...body, slug, userId: authUser.id });
        const savedProject = await newProject.save();
        updateTag("projects");
        return NextResponse.json(savedProject, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
