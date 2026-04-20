import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

/* Paths that require a valid JWT cookie to access */
const PROTECTED_PREFIXES = ["/dashboard", "/create-post", "/update-post"];

export async function proxy(req: NextRequest) {
    const isProtected = PROTECTED_PREFIXES.some((p) => req.nextUrl.pathname.startsWith(p));
    if (!isProtected) return NextResponse.next();

    const token = req.cookies.get("access_token")?.value;
    if (!token) {
        return NextResponse.redirect(new URL("/sign-in", req.url));
    }

    try {
        const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
        await jwtVerify(token, secret);
        return NextResponse.next();
    } catch {
        return NextResponse.redirect(new URL("/sign-in", req.url));
    }
}

export const config = {
    matcher: ["/dashboard/:path*", "/create-post", "/update-post/:path*"],
};
