import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { connectDB } from "@/lib/db";
import { checkRateLimit, clientRateKey } from "@/lib/rateLimit";
import User from "@/models/user.model";

const COOKIE_OPTS = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    maxAge: 30 * 24 * 60 * 60,
};

export async function POST(request: NextRequest) {
    if (!checkRateLimit(clientRateKey(request, "signin"), 10, 15 * 60 * 1000)) {
        return NextResponse.json({ message: "Too many sign-in attempts. Please try again later." }, { status: 429 });
    }

    const { email, password } = await request.json();

    if (!email || !password) {
        return NextResponse.json({ message: "All fields are required" }, { status: 400 });
    }

    try {
        await connectDB();
        const validUser = await User.findOne({ email });
        if (!validUser) {
            return NextResponse.json({ message: "Invalid email or password" }, { status: 400 });
        }
        const validPassword = bcryptjs.compareSync(password, validUser.password);
        if (!validPassword) {
            return NextResponse.json({ message: "Invalid email or password" }, { status: 400 });
        }

        const token = jwt.sign({ id: validUser._id, isAdmin: validUser.isAdmin }, process.env.JWT_SECRET!, { expiresIn: "30d" });
        const { password: _pass, ...rest } = validUser._doc;

        const res = NextResponse.json(rest, { status: 200 });
        res.cookies.set("access_token", token, COOKIE_OPTS);
        return res;
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
