import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { connectDB } from "@/lib/db";
import Post from "@/models/post.model";
import { auditEvent } from "@/lib/audit";
import { requireAdminAccess } from "@/lib/auth";
import { getUniquePostSlug, readPostWritePayload } from "@/lib/publishing";

export async function PUT(request: NextRequest, { params }: { params: Promise<{ postId: string; userId: string }> }) {
    const { postId, userId } = await params;
    const access = await requireAdminAccess(request, "You do not have permission to update");
    if (access.response) return access.response;
    const { authUser } = access;

    if (authUser.id !== userId) {
        return NextResponse.json({ message: "You do not have permission to update" }, { status: 403 });
    }

    try {
        const postPayload = await readPostWritePayload(request);
        await connectDB();

        const slug = await getUniquePostSlug(postPayload.title, postId);

        const updatedPost = await Post.findOneAndUpdate(
            { _id: postId, userId: authUser.id },
            { $set: { ...postPayload, image: postPayload.image || "", slug } },
            { new: true }
        );
        if (!updatedPost) {
            return NextResponse.json({ message: "Post not found" }, { status: 404 });
        }
        revalidateTag("posts", { expire: 0 });
        auditEvent("post.update", { actorId: authUser.id, targetId: postId, status: "success" });
        return NextResponse.json(updatedPost, { status: 200 });
    } catch (error: any) {
        auditEvent("post.update", { actorId: authUser.id, targetId: postId, status: "failure", detail: error.message });
        if (error.code === 11000) {
            return NextResponse.json({ message: "A post with this title already exists. Please retry." }, { status: 409 });
        }
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
