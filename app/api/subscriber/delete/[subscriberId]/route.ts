import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { requireAdminAccess } from "@/lib/auth";
import Subscriber from "@/models/subscriber.model";
import { auditEvent } from "@/lib/audit";

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ subscriberId: string }> }) {
    const { subscriberId } = await params;
    const access = await requireAdminAccess(request, "You do not have permission to delete this subscriber.");
    if (access.response) return access.response;
    const { authUser } = access;

    try {
        await connectDB();
        const deletedSubscriber = await Subscriber.findByIdAndDelete(subscriberId);
        if (!deletedSubscriber) {
            return NextResponse.json({ message: "Subscriber not found." }, { status: 404 });
        }

        auditEvent("subscriber.delete", { actorId: authUser.id, targetId: subscriberId, status: "success" });
        return NextResponse.json({ message: "Subscriber has been removed." }, { status: 200 });
    } catch (error: any) {
        auditEvent("subscriber.delete", { actorId: authUser.id, targetId: subscriberId, status: "failure", detail: error.message });
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
