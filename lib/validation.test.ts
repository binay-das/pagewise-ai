import { describe, it, expect } from "vitest";
import {
    chatRequestSchema,
    pdfRequestSchema,
    validateRequest,
    formatValidationError,
} from "./validation";

describe("chatRequestSchema", () => {
    it("accepts a valid chat request", () => {
        const result = chatRequestSchema.safeParse({
            messages: [{ role: "user", content: "Hello" }],
            documentId: "cm0000000000000000000000000",
        });
        expect(result.success).toBe(true);
    });

    it("rejects an empty messages array", () => {
        const result = chatRequestSchema.safeParse({
            messages: [],
            documentId: "cm0000000000000000000000000",
        });
        expect(result.success).toBe(false);
    });

    it("rejects a message with empty content", () => {
        const result = chatRequestSchema.safeParse({
            messages: [{ role: "user", content: "" }],
            documentId: "cm0000000000000000000000000",
        });
        expect(result.success).toBe(false);
    });

    it("rejects a message with content over 10000 chars", () => {
        const result = chatRequestSchema.safeParse({
            messages: [{ role: "user", content: "a".repeat(10001) }],
            documentId: "cm0000000000000000000000000",
        });
        expect(result.success).toBe(false);
    });

    it("rejects an invalid role", () => {
        const result = chatRequestSchema.safeParse({
            messages: [{ role: "admin", content: "Hello" }],
            documentId: "cm0000000000000000000000000",
        });
        expect(result.success).toBe(false);
    });

    it("rejects a non-cuid documentId", () => {
        const result = chatRequestSchema.safeParse({
            messages: [{ role: "user", content: "Hello" }],
            documentId: "not-a-cuid",
        });
        expect(result.success).toBe(false);
    });
});

describe("pdfRequestSchema", () => {
    it("accepts a valid URL", () => {
        const result = pdfRequestSchema.safeParse({ url: "https://example.com/file.pdf" });
        expect(result.success).toBe(true);
    });

    it("rejects an invalid URL", () => {
        const result = pdfRequestSchema.safeParse({ url: "not-a-url" });
        expect(result.success).toBe(false);
    });

    it("rejects an empty URL", () => {
        const result = pdfRequestSchema.safeParse({ url: "" });
        expect(result.success).toBe(false);
    });
});

describe("validateRequest", () => {
    it("returns success with parsed data on valid input", () => {
        const result = validateRequest(pdfRequestSchema, { url: "https://example.com/file.pdf" });
        expect(result.success).toBe(true);
        if (result.success) {
            expect(result.data.url).toBe("https://example.com/file.pdf");
        }
    });

    it("returns failure with ZodError on invalid input", () => {
        const result = validateRequest(pdfRequestSchema, { url: "bad" });
        expect(result.success).toBe(false);
        if (!result.success) {
            expect(result.error.issues.length).toBeGreaterThan(0);
        }
    });
});

describe("formatValidationError", () => {
    it("formats a single field error", () => {
        const result = chatRequestSchema.safeParse({
            messages: [],
            documentId: "cm0000000000000000000000000",
        });
        if (!result.success) {
            const msg = formatValidationError(result.error);
            expect(typeof msg).toBe("string");
            expect(msg.length).toBeGreaterThan(0);
        }
    });

    it("formats multiple field errors joined by semicolons", () => {
        const result = chatRequestSchema.safeParse({ messages: [], documentId: "bad" });
        if (!result.success) {
            const msg = formatValidationError(result.error);
            expect(msg).toContain(";");
        }
    });
});
