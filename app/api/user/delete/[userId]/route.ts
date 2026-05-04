import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { connectDB } from "@/lib/db";
import User from "@/models/user.model";
import Post from "@/models/post.model";
import Project from "@/models/project.model";
import Comment from "@/models/comment.model";
import { auditEvent } from "@/lib/audit";
import { requireUserAccess } from "@/lib/auth";

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ userId: string }> }) {
    const { userId } = await params;
    const access = await requireUserAccess(request);
    if (access.response) return access.response;
    const { authUser } = access;

    if (!authUser.isAdmin && authUser.id !== userId) {
        return NextResponse.json({ message: "You do not have permission to delete this user." }, { status: 403 });
    }

    try {
        await connectDB();
        const userPosts = await Post.find({ userId }, "_id").lean();
        const postIds = userPosts.map((post: any) => String(post._id));
        const deletedUser = await User.findByIdAndDelete(userId);
        if (!deletedUser) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }
        await Promise.all([
            Post.deleteMany({ userId }),
            Project.deleteMany({ userId }),
            Comment.deleteMany({ $or: [{ userId }, { postId: { $in: postIds } }] }),
        ]);
        revalidateTag("posts", { expire: 0 });
        revalidateTag("projects", { expire: 0 });
        auditEvent("user.delete", { actorId: authUser.id, targetId: userId, status: "success" });
        return NextResponse.json("User has been deleted", { status: 200 });
    } catch (error: any) {
        auditEvent("user.delete", { actorId: authUser.id, targetId: userId, status: "failure", detail: error.message });
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
