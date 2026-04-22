import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { connectDB } from "@/lib/db";
import Subscriber from "@/models/subscriber.model";

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ subscriberId: string }> }) {
    const { subscriberId } = await params;
    const token = request.cookies.get("access_token")?.value;
    if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    let authUser: { id: string; isAdmin: boolean };
    try {
        authUser = jwt.verify(token, process.env.JWT_SECRET!) as { id: string; isAdmin: boolean };
    } catch {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    if (!authUser.isAdmin) {
        return NextResponse.json({ message: "You do not have permission to delete this subscriber." }, { status: 403 });
    }

    try {
        await connectDB();
        const deletedSubscriber = await Subscriber.findByIdAndDelete(subscriberId);
        if (!deletedSubscriber) {
            return NextResponse.json({ message: "Subscriber not found." }, { status: 404 });
        }

        return NextResponse.json({ message: "Subscriber has been removed." }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
