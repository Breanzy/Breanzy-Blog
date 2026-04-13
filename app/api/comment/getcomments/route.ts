import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { connectDB } from "@/lib/db";
import Comment from "@/models/comment.model";

export async function GET(request: NextRequest) {
    const token = request.cookies.get("access_token")?.value;
    if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    let authUser: { id: string; isAdmin: boolean };
    try {
        authUser = jwt.verify(token, process.env.JWT_SECRET!) as { id: string; isAdmin: boolean };
    } catch {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    if (!authUser.isAdmin) {
        return NextResponse.json({ message: "You are not allowed to get all comments" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const startIndex = parseInt(searchParams.get("startIndex") || "0");
    const limit = parseInt(searchParams.get("limit") || "9");
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
