import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { updateTag } from "next/cache";
import { connectDB } from "@/lib/db";
import Post from "@/models/post.model";
import Subscriber from "@/models/subscriber.model";
import { sendNewsletter } from "@/utils/sendNewsletter";

export async function POST(request: NextRequest) {
    const token = request.cookies.get("access_token")?.value;
    if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    let authUser: { id: string; isAdmin: boolean };
    try {
        authUser = jwt.verify(token, process.env.JWT_SECRET!) as { id: string; isAdmin: boolean };
    } catch {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    if (!authUser.isAdmin) {
        return NextResponse.json({ message: "You are not allowed to create a post" }, { status: 403 });
    }

    const body = await request.json();
    if (!body.title || !body.content) {
        return NextResponse.json({ message: "Please provide all required fields" }, { status: 400 });
    }

    const baseSlug = body.title
        .split(" ")
        .join("-")
        .toLowerCase()
        .replace(/[^a-zA-Z0-9-]/g, "");

    try {
        await connectDB();

        // Find a unique slug — append -2, -3, etc. if the base is already taken
        let slug = baseSlug;
        let suffix = 2;
        while (await Post.exists({ slug })) {
            slug = `${baseSlug}-${suffix++}`;
        }

        const newPost = new Post({ ...body, slug, userId: authUser.id });
        const savedPost = await newPost.save();
        const postJson = savedPost.toObject();

        updateTag("posts"); // Bust ISR cache for all public post pages

        const subscribers = await Subscriber.find({}, "email unsubscribeToken");
        const newsletter = await sendNewsletter(postJson, subscribers);
        if (newsletter.failed > 0) {
            console.error("Newsletter send error:", newsletter.errors.join(" | "));
        }

        return NextResponse.json({ ...postJson, newsletter }, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
