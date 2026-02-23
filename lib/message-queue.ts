import { prisma } from "@/lib/prisma";
import { logger } from "@/lib/logger";

type MessagePayload = {
    role: string;
    content: string;
    pdfSummaryId: string;
};

type QueueEntry = {
    payload: MessagePayload;
    attempts: number;
    nextRetryAt: number;
};

const MAX_ATTEMPTS = 5;
const BASE_DELAY_MS = 500;

const queue: QueueEntry[] = [];
let isProcessing = false;

export async function processQueue() {
    if (isProcessing || queue.length === 0) return;
    isProcessing = true;

    while (queue.length > 0) {
        const entry = queue[0];
        const now = Date.now();

        if (entry.nextRetryAt > now) {
            await new Promise<void>((r) => setTimeout(r, entry.nextRetryAt - now));
        }

        try {
            await prisma.message.create({ data: entry.payload });
            queue.shift();
        } catch (error) {
            entry.attempts += 1;
            if (entry.attempts >= MAX_ATTEMPTS) {
                logger.error(
                    { error, payload: { pdfSummaryId: entry.payload.pdfSummaryId, role: entry.payload.role } },
                    "Message dropped after max retry attempts"
                );
                queue.shift();
            } else {
                const delay = BASE_DELAY_MS * Math.pow(2, entry.attempts);
                entry.nextRetryAt = Date.now() + delay;
                logger.warn(
                    { attempt: entry.attempts, nextRetryMs: delay },
                    "Message save failed, will retry"
                );
                break;
            }
        }
    }

    isProcessing = false;

    if (queue.length > 0) {
        setImmediate(processQueue);
    }
}

export function enqueueMessage(payload: MessagePayload): void {
    queue.push({ payload, attempts: 0, nextRetryAt: 0 });
    setImmediate(processQueue);
}

export function getQueue(): QueueEntry[] {
    return queue;
}

export function clearQueue(): void {
    queue.length = 0;
    isProcessing = false;
}
