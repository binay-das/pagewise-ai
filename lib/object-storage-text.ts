import { applicationConfig } from "@/lib/config";
import { s3 } from "@/lib/object-storage.client";
import { PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { logger } from "@/lib/logger";

/**
 * Stores extracted PDF text in MinIO/S3 as a .txt file
 * @param pdfId - The ID of the PDF document
 * @param text - The extracted text content
 * @returns The storage key for the uploaded text file
 */
export async function storeExtractedText(
    pdfId: string,
    text: string
): Promise<string> {
    const key = `extracted-text/${pdfId}.txt`;

    try {
        await s3.send(
            new PutObjectCommand({
                Bucket: applicationConfig.storage.bucket,
                Key: key,
                Body: text,
                ContentType: "text/plain",
            })
        );

        logger.info({ key, textLength: text.length }, "Extracted text stored successfully");
        return key;
    } catch (error) {
        logger.error({ error, key }, "Failed to store extracted text");
        throw new Error("Failed to store extracted text in object storage");
    }
}

/**
 * Retrieves extracted PDF text from MinIO/S3
 * @param key - The storage key for the text file
 * @returns The extracted text content
 */
export async function getExtractedText(key: string): Promise<string> {
    try {
        const response = await s3.send(
            new GetObjectCommand({
                Bucket: applicationConfig.storage.bucket,
                Key: key,
            })
        );

        if (!response.Body) {
            throw new Error("Empty response body from storage");
        }

        // Convert stream to string
        const chunks: Uint8Array[] = [];
        for await (const chunk of response.Body as AsyncIterable<Uint8Array>) {
            chunks.push(chunk);
        }

        const text = Buffer.concat(chunks).toString("utf-8");
        logger.info({ key, textLength: text.length }, "Retrieved extracted text");
        return text;
    } catch (error) {
        logger.error({ error, key }, "Failed to retrieve extracted text");
        throw new Error("Failed to retrieve extracted text from object storage");
    }
}
