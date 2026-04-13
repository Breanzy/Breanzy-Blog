import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { connectDB } from "@/lib/db";
import User from "@/models/user.model";

const COOKIE_OPTS = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    maxAge: 30 * 24 * 60 * 60,
};

export async function POST(request: NextRequest) {
    const { email, name, googlePhotoUrl } = await request.json();

    try {
        await connectDB();
        const user = await User.findOne({ email });
        if (user) {
            const token = jwt.sign({ id: user._id, isAdmin: user.isAdmin }, process.env.JWT_SECRET!);
            const { password: _pass, ...rest } = user._doc;
            const res = NextResponse.json(rest, { status: 200 });
            res.cookies.set("access_token", token, COOKIE_OPTS);
            return res;
        } else {
            const generatedPassword = Math.random().toString(36).slice(-8);
            const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);
            const newUser = new User({
                username: name.toLowerCase().split(" ").join("") + Math.random().toString(9).slice(-4),
                email,
                password: hashedPassword,
                profilePicture: googlePhotoUrl,
            });
            await newUser.save();
            const token = jwt.sign({ id: newUser._id, isAdmin: newUser.isAdmin }, process.env.JWT_SECRET!);
            const { password: _pass, ...rest } = newUser._doc;
            const res = NextResponse.json(rest, { status: 200 });
            res.cookies.set("access_token", token, COOKIE_OPTS);
            return res;
        }
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
