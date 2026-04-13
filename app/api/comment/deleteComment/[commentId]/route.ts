import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { revalidateTag } from "next/cache";
import { connectDB } from "@/lib/db";
import Comment from "@/models/comment.model";

export async function DELETE(request: NextRequest, { params }: { params: { commentId: string } }) {
    const token = request.cookies.get("access_token")?.value;
    if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    let authUser: { id: string; isAdmin: boolean };
    try {
        authUser = jwt.verify(token, process.env.JWT_SECRET!) as { id: string; isAdmin: boolean };
    } catch {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    try {
        await connectDB();
        const comment = await Comment.findById(params.commentId);
        if (!comment) return NextResponse.json({ message: "Comment not found" }, { status: 404 });
        if (comment.userId !== authUser.id && !authUser.isAdmin) {
            return NextResponse.json({ message: "You are not allowed to delete this comment" }, { status: 403 });
        }
        await Comment.findByIdAndDelete(params.commentId);
        revalidateTag("comments");
        return NextResponse.json("Comment has been deleted", { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
