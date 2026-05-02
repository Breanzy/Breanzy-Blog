import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { revalidateTag } from "next/cache";
import { connectDB } from "@/lib/db";
import Post from "@/models/post.model";
import { auditEvent } from "@/lib/audit";
import { sanitizeRichHtml } from "@/lib/sanitizeHtml";
import { ensureSlug, slugifyTitle } from "@/lib/slug";
import { optionalString, readJsonObject, requiredString } from "@/lib/validation";

export async function PUT(request: NextRequest, { params }: { params: Promise<{ postId: string; userId: string }> }) {
    const { postId, userId } = await params;
    const token = request.cookies.get("access_token")?.value;
    if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    let authUser: { id: string; isAdmin: boolean };
    try {
        authUser = jwt.verify(token, process.env.JWT_SECRET!) as { id: string; isAdmin: boolean };
    } catch {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    if (!authUser.isAdmin || authUser.id !== userId) {
        return NextResponse.json({ message: "You do not have permission to update" }, { status: 403 });
    }

    try {
        const body = await readJsonObject(request);
        const title = requiredString(body, "title", 180);
        const content = sanitizeRichHtml(requiredString(body, "content", 250000));
        if (!content) {
            return NextResponse.json({ message: "Content is required" }, { status: 400 });
        }
        await connectDB();

        // Regenerate slug from the (possibly updated) title.
        // Exclude the current post from the uniqueness check so a no-op title
        // edit doesn't produce a "-2" suffix against itself.
        const baseSlug = ensureSlug(slugifyTitle(title));
        let slug = baseSlug;
        let suffix = 2;
        while (await Post.exists({ slug, _id: { $ne: postId } })) {
            slug = `${baseSlug}-${suffix++}`;
        }

        const updatedPost = await Post.findByIdAndUpdate(
            postId,
            {
                $set: {
                    title,
                    content,
                    category: optionalString(body, "category", 80) || "uncategorized",
                    image: optionalString(body, "image", 2000),
                    slug,
                },
            },
            { new: true }
        );
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
