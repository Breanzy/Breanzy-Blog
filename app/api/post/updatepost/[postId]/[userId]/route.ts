import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { updateTag } from "next/cache";
import { connectDB } from "@/lib/db";
import Post from "@/models/post.model";

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

    const body = await request.json();

    try {
        await connectDB();

        // Regenerate slug from the (possibly updated) title.
        // Exclude the current post from the uniqueness check so a no-op title
        // edit doesn't produce a "-2" suffix against itself.
        const baseSlug = body.title
            .split(" ")
            .join("-")
            .toLowerCase()
            .replace(/[^a-zA-Z0-9-]/g, "");
        let slug = baseSlug;
        let suffix = 2;
        while (await Post.exists({ slug, _id: { $ne: postId } })) {
            slug = `${baseSlug}-${suffix++}`;
        }

        const updatedPost = await Post.findByIdAndUpdate(
            postId,
            { $set: { title: body.title, content: body.content, category: body.category, image: body.image, slug } },
            { new: true }
        );
        updateTag("posts");
        return NextResponse.json(updatedPost, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
