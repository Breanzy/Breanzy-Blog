import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { revalidateTag } from "next/cache";
import { connectDB } from "@/lib/db";
import Post from "@/models/post.model";

export async function DELETE(request: NextRequest, { params }: { params: { postId: string; userId: string } }) {
    const token = request.cookies.get("access_token")?.value;
    if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    let authUser: { id: string; isAdmin: boolean };
    try {
        authUser = jwt.verify(token, process.env.JWT_SECRET!) as { id: string; isAdmin: boolean };
    } catch {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    if (!authUser.isAdmin || authUser.id !== params.userId) {
        return NextResponse.json({ message: "You do not have permission to delete" }, { status: 403 });
    }

    try {
        await connectDB();
        await Post.findByIdAndDelete(params.postId);
        revalidateTag("posts");
        return NextResponse.json("The post has been deleted", { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
