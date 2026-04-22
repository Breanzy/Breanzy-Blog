import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { connectDB } from "@/lib/db";
import { sendNewsletter } from "@/utils/sendNewsletter";

export async function POST(request: NextRequest) {
    const token = request.cookies.get("access_token")?.value;
    if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    let authUser: { id: string; isAdmin: boolean };
    try {
        authUser = jwt.verify(token, process.env.JWT_SECRET!) as { id: string; isAdmin: boolean };
    } catch {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    if (!authUser.isAdmin) {
        return NextResponse.json({ message: "You are not allowed to send test newsletters" }, { status: 403 });
    }

    const { email } = await request.json();
    if (!email) {
        return NextResponse.json({ message: "Recipient email is required." }, { status: 400 });
    }

    try {
        await connectDB();

        const newsletter = await sendNewsletter(
            {
                title: "Test newsletter from Breanzy",
                slug: "newsletter-test",
                category: "test",
                image: "",
            },
            [{ email, unsubscribeToken: "test-newsletter-preview" }]
        );

        if (newsletter.failed > 0) {
            return NextResponse.json(
                {
                    message: newsletter.errors.join(" | ") || "Test newsletter failed to send.",
                    newsletter,
                },
                { status: 502 }
            );
        }

        return NextResponse.json(
            {
                message: `Test newsletter sent to ${email}.`,
                newsletter,
            },
            { status: 200 }
        );
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
