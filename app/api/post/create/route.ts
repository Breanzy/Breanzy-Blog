import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { connectDB } from "@/lib/db";
import Post from "@/models/post.model";
import { auditEvent } from "@/lib/audit";
import { requireAdminAccess } from "@/lib/auth";
import { deliverPostNewsletter } from "@/lib/newsletterDelivery";
import { getUniquePostSlug, readPostWritePayload } from "@/lib/publishing";

export async function POST(request: NextRequest) {
    const access = await requireAdminAccess(request, "You are not allowed to create a post");
    if (access.response) return access.response;
    const { authUser } = access;

    try {
        const postPayload = await readPostWritePayload(request);
        const idempotencyKey = request.headers.get("Idempotency-Key")?.trim();

        await connectDB();
        if (idempotencyKey) {
            const existingPost = await Post.findOne({ idempotencyKey }).lean();
            if (existingPost) {
                return NextResponse.json(existingPost, { status: 200 });
            }
        }

        const slug = await getUniquePostSlug(postPayload.title);

        const newPost = new Post({
            ...postPayload,
            slug,
            idempotencyKey: idempotencyKey || undefined,
            userId: authUser.id,
        });
        const savedPost = await newPost.save();
        const postJson = savedPost.toObject();

        revalidateTag("posts", { expire: 0 }); // Bust ISR cache for all public post pages

        const newsletter = await deliverPostNewsletter(postJson, authUser.id);
        auditEvent("post.create", { actorId: authUser.id, targetId: String(savedPost._id), status: "success" });
        return NextResponse.json({ ...postJson, newsletter }, { status: 201 });
    } catch (error: any) {
        auditEvent("post.create", { actorId: authUser.id, status: "failure", detail: error.message });
        if (error.code === 11000) {
            return NextResponse.json({ message: "A post with this title already exists. Please retry." }, { status: 409 });
        }
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
