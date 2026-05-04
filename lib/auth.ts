import { createRemoteJWKSet, jwtVerify } from "jose";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/user.model";

const firebaseJwks = createRemoteJWKSet(
    new URL("https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com")
);

type FirebaseUser = {
    email: string;
    name: string;
    picture: string;
};

export type AuthUser = {
    id: string;
    isAdmin: boolean;
};

type AccessResult = { authUser: AuthUser; response?: never } | { authUser?: never; response: NextResponse };

/* Verifies a Firebase Auth ID token and returns the trusted user identity. */
export async function verifyFirebaseIdToken(idToken: string): Promise<FirebaseUser> {
    const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
    if (!projectId) {
        throw new Error("Missing NEXT_PUBLIC_FIREBASE_PROJECT_ID");
    }

    const { payload } = await jwtVerify(idToken, firebaseJwks, {
        issuer: `https://securetoken.google.com/${projectId}`,
        audience: projectId,
    });

    if (payload.firebase && typeof payload.firebase === "object") {
        const provider = (payload.firebase as { sign_in_provider?: unknown }).sign_in_provider;
        if (provider !== "google.com") {
            throw new Error("Unsupported auth provider");
        }
    }

    if (payload.email_verified !== true || typeof payload.email !== "string") {
        throw new Error("Google email must be verified");
    }

    return {
        email: payload.email.toLowerCase(),
        name: typeof payload.name === "string" && payload.name.trim() ? payload.name : payload.email.split("@")[0],
        picture: typeof payload.picture === "string" ? payload.picture : "",
    };
}

/* Verifies the app JWT and reloads the user so deleted or demoted users lose access immediately. */
export async function requireAuth(request: NextRequest): Promise<AuthUser> {
    const token = request.cookies.get("access_token")?.value;
    if (!token) {
        throw new Error("Unauthorized");
    }

    let payload: { id: string };
    try {
        payload = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };
    } catch {
        throw new Error("Unauthorized");
    }

    await connectDB();
    const user = await User.findById(payload.id).select("_id isAdmin").lean() as any;
    if (!user) {
        throw new Error("Unauthorized");
    }

    return { id: String(user._id), isAdmin: Boolean((user as any).isAdmin) };
}

/* Verifies the current user and requires their current database role to be admin. */
export async function requireAdmin(request: NextRequest): Promise<AuthUser> {
    const authUser = await requireAuth(request);
    if (!authUser.isAdmin) {
        throw new Error("Forbidden");
    }
    return authUser;
}

/* Returns a current user or a ready unauthorized response for route handlers. */
export async function requireUserAccess(request: NextRequest): Promise<AccessResult> {
    try {
        return { authUser: await requireAuth(request) };
    } catch {
        return { response: NextResponse.json({ message: "Unauthorized" }, { status: 401 }) };
    }
}

/* Returns a current admin or a ready unauthorized/forbidden response for route handlers. */
export async function requireAdminAccess(request: NextRequest, forbiddenMessage: string): Promise<AccessResult> {
    try {
        return { authUser: await requireAdmin(request) };
    } catch (error: any) {
        if (error.message === "Forbidden") {
            return { response: NextResponse.json({ message: forbiddenMessage }, { status: 403 }) };
        }
        return { response: NextResponse.json({ message: "Unauthorized" }, { status: 401 }) };
    }
}
