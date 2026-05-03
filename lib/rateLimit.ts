type RateBucket = {
    count: number;
    resetAt: number;
};

const buckets = new Map<string, RateBucket>();

/* Applies a lightweight per-process rate limit for abuse-prone public endpoints. */
export function checkRateLimit(key: string, limit: number, windowMs: number) {
    const now = Date.now();
    const bucket = buckets.get(key);
    if (!bucket || bucket.resetAt <= now) {
        buckets.set(key, { count: 1, resetAt: now + windowMs });
        return true;
    }
    if (bucket.count >= limit) {
        return false;
    }
    bucket.count += 1;
    return true;
}

/* Builds a coarse client key without trusting it as identity. */
export function clientRateKey(request: Request, scope: string) {
    const forwardedFor = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
    const realIp = request.headers.get("x-real-ip");
    return `${scope}:${forwardedFor || realIp || "unknown"}`;
}
