import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Comment from "@/models/comment.model";

export async function GET(_request: NextRequest, { params }: { params: { postId: string } }) {
    try {
        await connectDB();
        const comments = await Comment.find({ postId: params.postId }).sort({ createdAt: -1 });
        return NextResponse.json(comments, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
