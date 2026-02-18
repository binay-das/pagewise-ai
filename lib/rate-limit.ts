type WindowEntry = {
    timestamps: number[];
};

const store = new Map<string, WindowEntry>();

const CLEANUP_INTERVAL_MS = 60_000;

setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of store.entries()) {
        if (entry.timestamps.length === 0 || now - entry.timestamps[entry.timestamps.length - 1] > 60_000) {
            store.delete(key);
        }
    }
}, CLEANUP_INTERVAL_MS);

export type RateLimitResult =
    | { allowed: true }
    | { allowed: false; retryAfterMs: number };

export function checkRateLimit(
    key: string,
    limit: number,
    windowMs: number
): RateLimitResult {
    const now = Date.now();
    const windowStart = now - windowMs;

    let entry = store.get(key);
    if (!entry) {
        entry = { timestamps: [] };
        store.set(key, entry);
    }

    entry.timestamps = entry.timestamps.filter((t) => t > windowStart);

    if (entry.timestamps.length >= limit) {
        const oldest = entry.timestamps[0];
        const retryAfterMs = oldest + windowMs - now;
        return { allowed: false, retryAfterMs };
    }

    entry.timestamps.push(now);
    return { allowed: true };
}
