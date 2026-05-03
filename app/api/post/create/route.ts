import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { connectDB } from "@/lib/db";
import Post from "@/models/post.model";
import Subscriber from "@/models/subscriber.model";
import { sendNewsletter } from "@/utils/sendNewsletter";
import { auditEvent } from "@/lib/audit";
import { requireAdmin } from "@/lib/auth";
import { sanitizeRichHtml } from "@/lib/sanitizeHtml";
import { ensureSlug, slugifyTitle } from "@/lib/slug";
import { optionalString, readJsonObject, requiredString } from "@/lib/validation";

export async function POST(request: NextRequest) {
    let authUser: { id: string; isAdmin: boolean };
    try {
        authUser = await requireAdmin(request);
    } catch (error: any) {
        if (error.message === "Forbidden") {
            return NextResponse.json({ message: "You are not allowed to create a post" }, { status: 403 });
        }
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    try {
        const body = await readJsonObject(request);
        const title = requiredString(body, "title", 180);
        const content = sanitizeRichHtml(requiredString(body, "content", 250000));
        if (!content) {
            return NextResponse.json({ message: "Content is required" }, { status: 400 });
        }
        const idempotencyKey = request.headers.get("Idempotency-Key")?.trim();

        await connectDB();
        if (idempotencyKey) {
            const existingPost = await Post.findOne({ idempotencyKey }).lean();
            if (existingPost) {
                return NextResponse.json(existingPost, { status: 200 });
            }
        }

        // Find a unique slug — append -2, -3, etc. if the base is already taken
        const baseSlug = ensureSlug(slugifyTitle(title));
        let slug = baseSlug;
        let suffix = 2;
        while (await Post.exists({ slug })) {
            slug = `${baseSlug}-${suffix++}`;
        }

        const newPost = new Post({
            title,
            content,
            category: optionalString(body, "category", 80) || "uncategorized",
            image: optionalString(body, "image", 2000) || undefined,
            slug,
            idempotencyKey: idempotencyKey || undefined,
            userId: authUser.id,
        });
        const savedPost = await newPost.save();
        const postJson = savedPost.toObject();

        revalidateTag("posts", { expire: 0 }); // Bust ISR cache for all public post pages

        const subscribers = await Subscriber.find({}, "email unsubscribeToken");
        const newsletter = await sendNewsletter(postJson, subscribers);
        if (newsletter.delivered > 0) {
            await Post.findByIdAndUpdate(savedPost._id, { $set: { newsletterSentAt: new Date() } });
        }
        if (newsletter.failed > 0) {
            auditEvent("newsletter.post_send", {
                actorId: authUser.id,
                targetId: String(savedPost._id),
                status: "failure",
                detail: newsletter.errors.join(" | ").slice(0, 1000),
            });
        }

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
