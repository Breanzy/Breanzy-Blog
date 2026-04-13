import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Post from "@/models/post.model";

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const startIndex = parseInt(searchParams.get("startIndex") || "0");
    const limit = parseInt(searchParams.get("limit") || "9");
    const sortDirection = searchParams.get("order") === "asc" ? 1 : -1;
    const userId = searchParams.get("userId");
    const category = searchParams.get("category");
    const slug = searchParams.get("slug");
    const postId = searchParams.get("postId");
    const searchTerm = searchParams.get("searchTerm");

    try {
        await connectDB();
        const posts = await Post.find({
            ...(userId && { userId }),
            ...(category && { category }),
            ...(slug && { slug }),
            ...(postId && { _id: postId }),
            ...(searchTerm && {
                $or: [
                    { title: { $regex: searchTerm, $options: "i" } },
                    { content: { $regex: searchTerm, $options: "i" } },
                ],
            }),
        })
            .sort({ updatedAt: sortDirection })
            .skip(startIndex)
            .limit(limit);

        const totalPosts = await Post.countDocuments();
        const now = new Date();
        const oneMonthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
        const lastMonthPosts = await Post.countDocuments({ createdAt: { $gte: oneMonthAgo } });

        return NextResponse.json({ posts, totalPosts, lastMonthPosts }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
