import { describe, it, expect, vi, beforeEach } from "vitest";
import { enqueueMessage, processQueue, clearQueue, getQueue } from "./message-queue";
import { prisma } from "./prisma";

vi.mock("./prisma", () => ({
    prisma: {
        message: {
            create: vi.fn(),
        },
    },
}));

describe("message-queue", () => {
    beforeEach(() => {
        clearQueue();
        vi.clearAllMocks();
        vi.useFakeTimers();
    });

    it("saves a message to the DB after enqueue", async () => {
        (prisma.message.create as ReturnType<typeof vi.fn>).mockResolvedValue({ id: "m1" });

        enqueueMessage({ role: "user", content: "Hello", pdfSummaryId: "doc-1" });
        await processQueue();

        expect(prisma.message.create).toHaveBeenCalledWith({
            data: { role: "user", content: "Hello", pdfSummaryId: "doc-1" },
        });
    });

    it("retries once after a transient DB failure", async () => {
        (prisma.message.create as ReturnType<typeof vi.fn>)
            .mockRejectedValueOnce(new Error("DB flake"))
            .mockResolvedValueOnce({ id: "m2" });

        enqueueMessage({ role: "user", content: "retry me", pdfSummaryId: "doc-2" });

        await processQueue();
        expect(prisma.message.create).toHaveBeenCalledTimes(1);

        vi.advanceTimersByTime(2000);
        await processQueue();
        expect(prisma.message.create).toHaveBeenCalledTimes(2);
    });

    it("drops a message after MAX_ATTEMPTS (5) consecutive failures", async () => {
        (prisma.message.create as ReturnType<typeof vi.fn>).mockRejectedValue(new Error("permanent"));

        enqueueMessage({ role: "assistant", content: "drop me", pdfSummaryId: "doc-3" });

        for (let i = 0; i < 5; i++) {
            vi.advanceTimersByTime(60_000);
            await processQueue();
        }

        expect(prisma.message.create).toHaveBeenCalledTimes(5);
        expect(getQueue()).toHaveLength(0);
    });

    it("processes multiple messages in FIFO order", async () => {
        const results: string[] = [];
        (prisma.message.create as ReturnType<typeof vi.fn>).mockImplementation(({ data }) => {
            results.push(data.content);
            return Promise.resolve({ id: data.content });
        });

        enqueueMessage({ role: "user", content: "first", pdfSummaryId: "doc-4" });
        enqueueMessage({ role: "user", content: "second", pdfSummaryId: "doc-4" });
        enqueueMessage({ role: "user", content: "third", pdfSummaryId: "doc-4" });

        await processQueue();

        expect(results).toEqual(["first", "second", "third"]);
    });

    it("clearQueue empties the queue", () => {
        enqueueMessage({ role: "user", content: "x", pdfSummaryId: "doc-5" });
        expect(getQueue()).toHaveLength(1);
        clearQueue();
        expect(getQueue()).toHaveLength(0);
    });
});
