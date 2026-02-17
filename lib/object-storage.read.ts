import { applicationConfig } from "@/lib/config";
import { s3 } from "@/lib/object-storage.client";
import { GetObjectCommand } from "@aws-sdk/client-s3";

async function streamToBuffer(stream: unknown): Promise<Buffer> {
    const chunks: Buffer[] = [];
    for await (const chunk of stream as AsyncIterable<Uint8Array>) {
        chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
    }
    return Buffer.concat(chunks);
}

export async function readPdfFromStorage(key: string): Promise<Buffer> {
    const res = await s3.send(
        new GetObjectCommand({
            Bucket: applicationConfig.storage.bucket,
            Key: key,
        })
    );

    if (!res.Body) {
        throw new Error("Empty object body from storage");
    }

    return streamToBuffer(res.Body);
}
