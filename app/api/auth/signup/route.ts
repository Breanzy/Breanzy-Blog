import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import { connectDB } from "@/lib/db";
import { checkRateLimit, clientRateKey } from "@/lib/rateLimit";
import { readJsonObject, requiredString } from "@/lib/validation";
import User from "@/models/user.model";

export async function POST(request: NextRequest) {
    if (!checkRateLimit(clientRateKey(request, "signup"), 5, 60 * 60 * 1000)) {
        return NextResponse.json({ message: "Too many sign-up attempts. Please try again later." }, { status: 429 });
    }

    try {
        const body = await readJsonObject(request);
        const username = requiredString(body, "username", 20);
        const email = requiredString(body, "email", 320).toLowerCase();
        const password = requiredString(body, "password", 200);

        if (password.length < 6) {
            return NextResponse.json({ message: "Password must be at least 6 characters" }, { status: 400 });
        }
        if (username.length < 7 || !username.match(/^[a-zA-Z0-9]+$/) || username !== username.toLowerCase()) {
            return NextResponse.json({ message: "Username must be 7-20 lowercase alphanumeric characters" }, { status: 400 });
        }

        await connectDB();
        const hashedPassword = bcryptjs.hashSync(password, 10);
        const newUser = new User({ username, email, password: hashedPassword });
        await newUser.save();
        return NextResponse.json("Signup successful", { status: 200 });
    } catch (error: any) {
        if (error.code === 11000) {
            return NextResponse.json({ message: "Unable to create account with those details" }, { status: 409 });
        }
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
