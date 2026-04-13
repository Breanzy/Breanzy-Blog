import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Subscriber from "@/models/subscriber.model";

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get("token");

    try {
        await connectDB();
        await Subscriber.findOneAndDelete({ unsubscribeToken: token });
        return new NextResponse(
            `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><title>Unsubscribed</title></head>
<body style="margin:0;padding:60px 24px;background:#0a0a0a;color:#e5e5e5;font-family:sans-serif;text-align:center;">
  <h2 style="color:#fff;">You've been unsubscribed.</h2>
  <p style="color:#737373;">You won't receive any more newsletters from Breanzy.</p>
  <a href="https://breanzy.com" style="color:#3b82f6;text-decoration:none;font-size:14px;">← Back to site</a>
</body>
</html>`,
            { status: 200, headers: { "Content-Type": "text/html" } }
        );
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
