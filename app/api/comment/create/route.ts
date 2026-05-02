import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { connectDB } from "@/lib/db";
import Comment from "@/models/comment.model";
import { readJsonObject, requiredString } from "@/lib/validation";

export async function POST(request: NextRequest) {
    const token = request.cookies.get("access_token")?.value;
    if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    let authUser: { id: string; isAdmin: boolean };
    try {
        authUser = jwt.verify(token, process.env.JWT_SECRET!) as { id: string; isAdmin: boolean };
    } catch {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    try {
        const body = await readJsonObject(request);
        const content = requiredString(body, "content", 5000);
        const postId = requiredString(body, "postId", 80);
        const userId = requiredString(body, "userId", 80);
        if (userId !== authUser.id) {
            return NextResponse.json({ message: "You are not allowed to create this comment" }, { status: 403 });
        }

        await connectDB();
        const newComment = new Comment({ content, postId, userId });
        await newComment.save();
        return NextResponse.json(newComment, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
