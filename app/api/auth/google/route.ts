import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { connectDB } from "@/lib/db";
import { verifyFirebaseIdToken } from "@/lib/auth";
import { auditEvent } from "@/lib/audit";
import { checkRateLimit, clientRateKey } from "@/lib/rateLimit";
import { readJsonObject } from "@/lib/validation";
import User from "@/models/user.model";

const COOKIE_OPTS = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    maxAge: 7 * 24 * 60 * 60,
};

export async function POST(request: NextRequest) {
    try {
        if (!checkRateLimit(clientRateKey(request, "google-auth"), 20, 15 * 60 * 1000)) {
            return NextResponse.json({ message: "Too many Google sign-in attempts. Please try again later." }, { status: 429 });
        }

        const body = await readJsonObject(request);
        if (typeof body.idToken !== "string" || !body.idToken) {
            return NextResponse.json({ message: "Google token is required" }, { status: 400 });
        }

        const { email, name, picture } = await verifyFirebaseIdToken(body.idToken);
        await connectDB();
        const user = await User.findOne({ email });
        if (user) {
            const token = jwt.sign({ id: user._id, isAdmin: user.isAdmin }, process.env.JWT_SECRET!, { expiresIn: "7d" });
            const { password: _pass, ...rest } = user._doc;
            const res = NextResponse.json(rest, { status: 200 });
            res.cookies.set("access_token", token, COOKIE_OPTS);
            auditEvent("auth.google.signin", { actorId: String(user._id), status: "success" });
            return res;
        } else {
            const generatedPassword = globalThis.crypto.randomUUID();
            const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);
            const usernameBase = name.toLowerCase().replace(/[^a-z0-9]/g, "").slice(0, 16) || email.split("@")[0].replace(/[^a-z0-9]/g, "").slice(0, 16);
            const usernameSuffix = globalThis.crypto.randomUUID().replace(/-/g, "").slice(0, 6);
            const newUser = new User({
                username: `${usernameBase}${usernameSuffix}`,
                email,
                password: hashedPassword,
                profilePicture: picture,
            });
            await newUser.save();
            const token = jwt.sign({ id: newUser._id, isAdmin: newUser.isAdmin }, process.env.JWT_SECRET!, { expiresIn: "7d" });
            const { password: _pass, ...rest } = newUser._doc;
            const res = NextResponse.json(rest, { status: 200 });
            res.cookies.set("access_token", token, COOKIE_OPTS);
            auditEvent("auth.google.signup", { actorId: String(newUser._id), status: "success" });
            return res;
        }
    } catch (error: any) {
        auditEvent("auth.google", { status: "failure", detail: error.message });
        return NextResponse.json({ message: error.message }, { status: 401 });
    }
}
