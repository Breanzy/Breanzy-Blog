import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { requireUserAccess } from "@/lib/auth";
import { readJsonObject, requiredString } from "@/lib/validation";
import Comment from "@/models/comment.model";

export async function PUT(request: NextRequest, { params }: { params: Promise<{ commentId: string }> }) {
    const { commentId } = await params;
    const access = await requireUserAccess(request);
    if (access.response) return access.response;
    const { authUser } = access;

    try {
        const body = await readJsonObject(request);
        const content = requiredString(body, "content", 5000);
        await connectDB();
        const comment = await Comment.findById(commentId);
        if (!comment) return NextResponse.json({ message: "Comment not found" }, { status: 404 });
        if (comment.userId !== authUser.id && !authUser.isAdmin) {
            return NextResponse.json({ message: "You are not allowed to edit this comment" }, { status: 403 });
        }

        const editedComment = await Comment.findByIdAndUpdate(
            commentId,
            { content },
            { new: true }
        );
        return NextResponse.json(editedComment, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
