import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { connectDB } from "@/lib/db";
import Subscriber from "@/models/subscriber.model";

export async function GET(request: NextRequest) {
    const token = request.cookies.get("access_token")?.value;
    if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    let authUser: { id: string; isAdmin: boolean };
    try {
        authUser = jwt.verify(token, process.env.JWT_SECRET!) as { id: string; isAdmin: boolean };
    } catch {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    if (!authUser.isAdmin) {
        return NextResponse.json({ message: "You are not allowed to view subscribers" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const startIndex = parseInt(searchParams.get("startIndex") || "0");
    const limit = parseInt(searchParams.get("limit") || "9");
    const sortDirection = searchParams.get("sort") === "asc" ? 1 : -1;

    try {
        await connectDB();
        const subscribers = await Subscriber.find()
            .sort({ createdAt: sortDirection })
            .skip(startIndex)
            .limit(limit)
            .lean();

        const totalSubscribers = await Subscriber.countDocuments();

        return NextResponse.json({ subscribers, totalSubscribers }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
