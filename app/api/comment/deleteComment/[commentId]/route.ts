import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { requireUserAccess } from "@/lib/auth";
import Comment from "@/models/comment.model";

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ commentId: string }> }) {
    const { commentId } = await params;
    const access = await requireUserAccess(request);
    if (access.response) return access.response;
    const { authUser } = access;

    try {
        await connectDB();
        const comment = await Comment.findById(commentId);
        if (!comment) return NextResponse.json({ message: "Comment not found" }, { status: 404 });
        if (comment.userId !== authUser.id && !authUser.isAdmin) {
            return NextResponse.json({ message: "You are not allowed to delete this comment" }, { status: 403 });
        }
        await Comment.findByIdAndDelete(commentId);
        return NextResponse.json("Comment has been deleted", { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
