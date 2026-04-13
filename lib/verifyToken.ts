import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export interface AuthUser {
    id: string;
    isAdmin: boolean;
}

/* Reads the httpOnly cookie and verifies the JWT. Returns user payload or null. */
export function verifyToken(): AuthUser | null {
    const token = cookies().get("access_token")?.value;
    if (!token) return null;
    try {
        return jwt.verify(token, process.env.JWT_SECRET!) as AuthUser;
    } catch {
        return null;
    }
}
