import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { requireAdminAccess } from "@/lib/auth";
import { getPagination } from "@/lib/validation";
import Subscriber from "@/models/subscriber.model";

export async function GET(request: NextRequest) {
    const access = await requireAdminAccess(request, "You are not allowed to view subscribers");
    if (access.response) return access.response;

    const { searchParams } = new URL(request.url);
    const { startIndex, limit } = getPagination(searchParams);
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
