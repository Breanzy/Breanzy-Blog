import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { revalidateTag } from "next/cache";
import { connectDB } from "@/lib/db";
import Comment from "@/models/comment.model";

export async function POST(request: NextRequest) {
    const token = request.cookies.get("access_token")?.value;
    if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    let authUser: { id: string; isAdmin: boolean };
    try {
        authUser = jwt.verify(token, process.env.JWT_SECRET!) as { id: string; isAdmin: boolean };
    } catch {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { content, postId, userId } = await request.json();
    if (userId !== authUser.id) {
        return NextResponse.json({ message: "You are not allowed to create this comment" }, { status: 403 });
    }

    try {
        await connectDB();
        const newComment = new Comment({ content, postId, userId });
        await newComment.save();
        revalidateTag("comments");
        return NextResponse.json(newComment, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
