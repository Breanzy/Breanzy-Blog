import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { connectDB } from "@/lib/db";
import User from "@/models/user.model";

export async function PUT(request: NextRequest, { params }: { params: { userId: string } }) {
    const token = request.cookies.get("access_token")?.value;
    if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    let authUser: { id: string; isAdmin: boolean };
    try {
        authUser = jwt.verify(token, process.env.JWT_SECRET!) as { id: string; isAdmin: boolean };
    } catch {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    if (authUser.id !== params.userId) {
        return NextResponse.json({ message: "You are not allowed to update this user." }, { status: 403 });
    }

    const body = await request.json();

    if (body.password) {
        if (body.password.length < 6) {
            return NextResponse.json({ message: "Password must be at least 6 characters" }, { status: 400 });
        }
        body.password = bcryptjs.hashSync(body.password, 10);
    }

    if (body.username) {
        if (body.username.length < 7 || body.username.length > 20) {
            return NextResponse.json({ message: "Username must be between 7 and 20 characters" }, { status: 400 });
        }
        if (body.username.includes(" ")) {
            return NextResponse.json({ message: "Username cannot contain spaces" }, { status: 400 });
        }
        if (body.username !== body.username.toLowerCase()) {
            return NextResponse.json({ message: "Username must be in lowercase" }, { status: 400 });
        }
        if (!body.username.match(/^[a-zA-Z0-9]+$/)) {
            return NextResponse.json({ message: "Username can only contain alphanumeric characters" }, { status: 400 });
        }
    }

    try {
        await connectDB();
        const updatedUser = await User.findByIdAndUpdate(
            params.userId,
            { $set: { username: body.username, email: body.email, profilePicture: body.profilePicture, password: body.password } },
            { new: true }
        );
        const { password, ...rest } = updatedUser._doc;
        return NextResponse.json(rest, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
