import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { connectDB } from "@/lib/db";
import Comment from "@/models/comment.model";

export async function PUT(request: NextRequest, { params }: { params: { commentId: string } }) {
    const token = request.cookies.get("access_token")?.value;
    if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    let authUser: { id: string; isAdmin: boolean };
    try {
        authUser = jwt.verify(token, process.env.JWT_SECRET!) as { id: string; isAdmin: boolean };
    } catch {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    try {
        await connectDB();
        const comment = await Comment.findById(params.commentId);
        if (!comment) return NextResponse.json({ message: "Comment not found" }, { status: 404 });

        const userIndex = comment.likes.indexOf(authUser.id);
        if (userIndex === -1) {
            comment.numberOfLikes += 1;
            comment.likes.push(authUser.id);
        } else {
            comment.numberOfLikes -= 1;
            comment.likes.splice(userIndex, 1);
        }
        await comment.save();
        return NextResponse.json(comment, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
