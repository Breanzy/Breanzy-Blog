import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { connectDB } from "@/lib/db";
import Post from "@/models/post.model";
import Comment from "@/models/comment.model";
import { auditEvent } from "@/lib/audit";
import { requireAdminAccess } from "@/lib/auth";

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ postId: string; userId: string }> }) {
    const { postId, userId } = await params;
    const access = await requireAdminAccess(request, "You do not have permission to delete");
    if (access.response) return access.response;
    const { authUser } = access;

    if (authUser.id !== userId) {
        return NextResponse.json({ message: "You do not have permission to delete" }, { status: 403 });
    }

    try {
        await connectDB();
        const deletedPost = await Post.findOneAndDelete({ _id: postId, userId: authUser.id });
        if (!deletedPost) {
            return NextResponse.json({ message: "Post not found" }, { status: 404 });
        }
        await Comment.deleteMany({ postId });
        revalidateTag("posts", { expire: 0 });
        auditEvent("post.delete", { actorId: authUser.id, targetId: postId, status: "success" });
        return NextResponse.json("The post has been deleted", { status: 200 });
    } catch (error: any) {
        auditEvent("post.delete", { actorId: authUser.id, targetId: postId, status: "failure", detail: error.message });
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
