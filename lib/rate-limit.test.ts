import { describe, it, expect, vi, beforeEach } from "vitest";
import { checkRateLimit } from "./rate-limit";

describe("rate-limit", () => {
    beforeEach(() => {
        vi.useFakeTimers();
    });

    it("should allow requests under the limit", () => {
        const key = "test-user-1";
        const limit = 2;
        const windowMs = 1000;

        expect(checkRateLimit(key, limit, windowMs)).toEqual({ allowed: true });
        expect(checkRateLimit(key, limit, windowMs)).toEqual({ allowed: true });
    });

    it("should block requests exceeding the limit", () => {
        const key = "test-user-2";
        const limit = 2;
        const windowMs = 1000;

        checkRateLimit(key, limit, windowMs);
        checkRateLimit(key, limit, windowMs);

        const result = checkRateLimit(key, limit, windowMs);
        expect(result.allowed).toBe(false);
        if (!result.allowed) {
            expect(result.retryAfterMs).toBeGreaterThan(0);
            expect(result.retryAfterMs).toBeLessThanOrEqual(windowMs);
        }
    });

    it("should allow requests again after the window resets", () => {
        const key = "test-user-3";
        const limit = 1;
        const windowMs = 1000;

        checkRateLimit(key, limit, windowMs);
        expect(checkRateLimit(key, limit, windowMs).allowed).toBe(false);

        vi.advanceTimersByTime(1001);

        expect(checkRateLimit(key, limit, windowMs).allowed).toBe(true);
    });
});
