import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { connectDB } from "@/lib/db";
import Subscriber from "@/models/subscriber.model";

export async function POST(request: NextRequest) {
    const { email } = await request.json();
    if (!email) {
        return NextResponse.json({ success: false, message: "Email is required." }, { status: 400 });
    }

    try {
        await connectDB();
        const existing = await Subscriber.findOne({ email });
        if (existing) {
            return NextResponse.json({ success: true, message: "You're already subscribed!" }, { status: 200 });
        }
        const unsubscribeToken = crypto.randomBytes(32).toString("hex");
        await Subscriber.create({ email, unsubscribeToken });
        return NextResponse.json(
            { success: true, message: "Subscribed! You'll get notified on new posts." },
            { status: 201 }
        );
    } catch (error: any) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
