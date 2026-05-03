import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { getPagination } from "@/lib/validation";
import Comment from "@/models/comment.model";

export async function GET(request: NextRequest) {
    try {
        await requireAdmin(request);
    } catch (error: any) {
        if (error.message === "Forbidden") {
            return NextResponse.json({ message: "You are not allowed to get all comments" }, { status: 403 });
        }
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const { startIndex, limit } = getPagination(searchParams);
    const sortDirection = searchParams.get("sort") === "asc" ? 1 : -1;

    try {
        await connectDB();
        const comments = await Comment.find().sort({ createdAt: sortDirection }).skip(startIndex).limit(limit);
        const totalComments = await Comment.countDocuments();
        const now = new Date();
        const oneMonthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
        const lastMonthComments = await Comment.countDocuments({ createdAt: { $gte: oneMonthAgo } });
        return NextResponse.json({ comments, totalComments, lastMonthComments }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
