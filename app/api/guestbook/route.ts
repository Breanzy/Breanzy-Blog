import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { connectDB } from "@/lib/db";
import Guestbook from "@/models/guestbook.model";
import User from "@/models/user.model";

export async function GET() {
    try {
        await connectDB();
        const entries = await Guestbook.find().sort({ createdAt: -1 }).limit(50).lean();
        return NextResponse.json(entries, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    const token = request.cookies.get("access_token")?.value;
    if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    let authUser: { id: string; isAdmin: boolean };
    try {
        authUser = jwt.verify(token, process.env.JWT_SECRET!) as { id: string; isAdmin: boolean };
    } catch {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { content } = await request.json();
    if (!content || content.trim().length > 240) {
        return NextResponse.json({ message: "Guestbook entries must be 1-240 characters." }, { status: 400 });
    }

    try {
        await connectDB();
        const user = await User.findById(authUser.id).select("username profilePicture").lean() as any;
        if (!user) return NextResponse.json({ message: "User not found" }, { status: 404 });

        const entry = await Guestbook.create({
            content: content.trim(),
            userId: authUser.id,
            username: user.username,
            profilePicture: user.profilePicture,
        });

        return NextResponse.json(entry, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
