import { prisma } from "./prisma";
import { enqueueMessage } from "./message-queue";
import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("./prisma", () => ({
    prisma: {
        message: {
            create: vi.fn(),
        },
    },
}));

describe("message-queue", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        vi.useFakeTimers();
    });

    it("should process messages in the queue and save to DB", async () => {
        const payload = {
            role: "user",
            content: "Hello",
            pdfSummaryId: "doc-1",
        };

        (prisma.message.create as any).mockResolvedValue({ id: "msg-1" });

        enqueueMessage(payload);

        await vi.runNextTicks();
        await vi.advanceTimersByTimeAsync(0);

        expect(prisma.message.create).toHaveBeenCalledWith({ data: payload });
    });

    it("should retry on failure with exponential backoff", async () => {
        const payload = {
            role: "user",
            content: "Hello retry",
            pdfSummaryId: "doc-2",
        };

        (prisma.message.create as any)
            .mockRejectedValueOnce(new Error("DB error"))
            .mockResolvedValueOnce({ id: "msg-2" });

        enqueueMessage(payload);

        await vi.runNextTicks();
        await vi.advanceTimersByTimeAsync(0);
        expect(prisma.message.create).toHaveBeenCalledTimes(1);

        await vi.advanceTimersByTimeAsync(1001);
        await vi.runNextTicks();

        expect(prisma.message.create).toHaveBeenCalledTimes(2);
    });

    it("should drop message after max attempts", async () => {
        const payload = {
            role: "user",
            content: "Hello drop",
            pdfSummaryId: "doc-3",
        };

        (prisma.message.create as any).mockRejectedValue(new Error("Persistent error"));

        enqueueMessage(payload);

        await vi.runNextTicks();
        await vi.advanceTimersByTimeAsync(0);

        for (let i = 1; i < 5; i++) {
            await vi.advanceTimersByTimeAsync(500 * Math.pow(2, i) + 1);
            await vi.runNextTicks();
        }

        expect(prisma.message.create).toHaveBeenCalledTimes(5);
    });
});
