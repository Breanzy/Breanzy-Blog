import { NextRequest } from "next/server";

/* Reads a JSON request body and ensures it is a plain object. */
export async function readJsonObject(request: NextRequest) {
    const body = await request.json();
    if (!body || typeof body !== "object" || Array.isArray(body)) {
        throw new Error("Invalid JSON body");
    }
    return body as Record<string, unknown>;
}

/* Returns a trimmed required string with a defensive maximum length. */
export function requiredString(body: Record<string, unknown>, key: string, maxLength = 5000) {
    const value = body[key];
    if (typeof value !== "string" || !value.trim()) {
        throw new Error(`${key} is required`);
    }
    return value.trim().slice(0, maxLength);
}

/* Returns a trimmed optional string with a defensive maximum length. */
export function optionalString(body: Record<string, unknown>, key: string, maxLength = 5000) {
    const value = body[key];
    if (typeof value !== "string") return "";
    return value.trim().slice(0, maxLength);
}

/* Parses pagination params with stable bounds for public list endpoints. */
export function getPagination(searchParams: URLSearchParams, defaultLimit = 9, maxLimit = 50) {
    const rawStart = Number.parseInt(searchParams.get("startIndex") || "0", 10);
    const rawLimit = Number.parseInt(searchParams.get("limit") || String(defaultLimit), 10);
    return {
        startIndex: Number.isFinite(rawStart) && rawStart > 0 ? rawStart : 0,
        limit: Number.isFinite(rawLimit) && rawLimit > 0 ? Math.min(rawLimit, maxLimit) : defaultLimit,
    };
}
