import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { requireAdminAccess } from "@/lib/auth";
import { getPagination } from "@/lib/validation";
import User from "@/models/user.model";

export async function GET(request: NextRequest) {
    const access = await requireAdminAccess(request, "You are not allowed to view users");
    if (access.response) return access.response;

    const { searchParams } = new URL(request.url);
    const { startIndex, limit } = getPagination(searchParams);
    const sortDirection = searchParams.get("sort") === "asc" ? 1 : -1;

    try {
        await connectDB();
        const users = await User.find().sort({ createdAt: sortDirection }).skip(startIndex).limit(limit);
        const usersNoPassword = users.map((user: any) => {
            const { password, ...rest } = user._doc;
            return rest;
        });
        const totalUsers = await User.countDocuments();
        const now = new Date();
        const oneMonthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
        const lastMonthUsers = await User.countDocuments({ createdAt: { $gte: oneMonthAgo } });

        return NextResponse.json({ users: usersNoPassword, totalUsers, lastMonthUsers }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
