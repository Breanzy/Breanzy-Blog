import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { requireUserAccess } from "@/lib/auth";
import { checkRateLimit, clientRateKey } from "@/lib/rateLimit";
import Comment from "@/models/comment.model";
import { readJsonObject, requiredString } from "@/lib/validation";

export async function POST(request: NextRequest) {
    if (!checkRateLimit(clientRateKey(request, "comment"), 10, 5 * 60 * 1000)) {
        return NextResponse.json({ message: "Too many comments. Please slow down." }, { status: 429 });
    }

    const access = await requireUserAccess(request);
    if (access.response) return access.response;
    const { authUser } = access;

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
