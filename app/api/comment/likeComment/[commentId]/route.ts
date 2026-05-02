import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { connectDB } from "@/lib/db";
import Comment from "@/models/comment.model";

export async function PUT(request: NextRequest, { params }: { params: Promise<{ commentId: string }> }) {
    const { commentId } = await params;
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
        const likedComment = await Comment.findOneAndUpdate(
            { _id: commentId, likes: { $ne: authUser.id } },
            { $addToSet: { likes: authUser.id }, $inc: { numberOfLikes: 1 } },
            { new: true }
        );
        if (likedComment) return NextResponse.json(likedComment, { status: 200 });

        const unlikedComment = await Comment.findOneAndUpdate(
            { _id: commentId, likes: authUser.id },
            { $pull: { likes: authUser.id }, $inc: { numberOfLikes: -1 } },
            { new: true }
        );
        if (!unlikedComment) return NextResponse.json({ message: "Comment not found" }, { status: 404 });
        return NextResponse.json(unlikedComment, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
