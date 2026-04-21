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

    const body = await request.json();

    try {
        await connectDB();
        const comment = await Comment.findById(commentId);
        if (!comment) return NextResponse.json({ message: "Comment not found" }, { status: 404 });
        if (comment.userId !== authUser.id && !authUser.isAdmin) {
            return NextResponse.json({ message: "You are not allowed to edit this comment" }, { status: 403 });
        }

        const editedComment = await Comment.findByIdAndUpdate(
            commentId,
            { content: body.content },
            { new: true }
        );
        return NextResponse.json(editedComment, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
