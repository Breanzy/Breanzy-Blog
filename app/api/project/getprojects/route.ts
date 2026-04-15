import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Project from "@/models/project.model";

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const startIndex = parseInt(searchParams.get("startIndex") || "0");
    const limit = parseInt(searchParams.get("limit") || "9");
    const sortDirection = searchParams.get("order") === "asc" ? 1 : -1;
    const userId = searchParams.get("userId");
    const category = searchParams.get("category");
    const slug = searchParams.get("slug");
    const projectId = searchParams.get("projectId");
    const featuredParam = searchParams.get("featured");
    const searchTerm = searchParams.get("searchTerm");

    try {
        await connectDB();
        const projects = await Project.find({
            ...(userId && { userId }),
            ...(category && { category }),
            ...(slug && { slug }),
            ...(projectId && { _id: projectId }),
            ...(featuredParam !== null && { featured: featuredParam === "true" }),
            ...(searchTerm && {
                $or: [
                    { title: { $regex: searchTerm, $options: "i" } },
                    { description: { $regex: searchTerm, $options: "i" } },
                ],
            }),
        })
            .sort({ updatedAt: sortDirection })
            .skip(startIndex)
            .limit(limit)
            .select(projectId || slug ? "" : "-content") // full content only needed for single-project views
            .lean();

        const totalProjects = await Project.countDocuments();
        const now = new Date();
        const oneMonthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
        const lastMonthProjects = await Project.countDocuments({ createdAt: { $gte: oneMonthAgo } });

        return NextResponse.json({ projects, totalProjects, lastMonthProjects }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
