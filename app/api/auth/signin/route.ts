import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { connectDB } from "@/lib/db";
import User from "@/models/user.model";

const COOKIE_OPTS = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    maxAge: 30 * 24 * 60 * 60, // 30 days in seconds
};

export async function POST(request: NextRequest) {
    const { email, password } = await request.json();

    if (!email || !password) {
        return NextResponse.json({ message: "All fields are required" }, { status: 400 });
    }

    try {
        await connectDB();
        const validUser = await User.findOne({ email });
        if (!validUser) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }
        const validPassword = bcryptjs.compareSync(password, validUser.password);
        if (!validPassword) {
            return NextResponse.json({ message: "Invalid password" }, { status: 400 });
        }

        const token = jwt.sign({ id: validUser._id, isAdmin: validUser.isAdmin }, process.env.JWT_SECRET!);
        const { password: _pass, ...rest } = validUser._doc;

        const res = NextResponse.json(rest, { status: 200 });
        res.cookies.set("access_token", token, COOKIE_OPTS);
        return res;
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
