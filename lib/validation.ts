import { z } from "zod";

export const chatRequestSchema = z.object({
    messages: z
        .array(
            z.object({
                id: z.string().optional(),
                role: z.enum(["user", "assistant", "system"]),
                content: z.string().min(1, "Message content cannot be empty").max(10000, "Message content too long"),
            })
        )
        .min(1, "At least one message is required"),
    documentId: z.string().cuid("Invalid document ID format"),
});

export const pdfRequestSchema = z.object({
    url: z.string().url("Invalid URL format").min(1, "URL cannot be empty"),
});


export function validateRequest<T>(
    schema: z.ZodSchema<T>,
    data: unknown
): { success: true; data: T } | { success: false; error: z.ZodError } {
    const result = schema.safeParse(data);

    if (result.success) {
        return { success: true, data: result.data };
    }

    return { success: false, error: result.error };
}


export function formatValidationError(error: z.ZodError): string {
    return error.issues
        .map((err: z.ZodIssue) => {
            const path = err.path.join(".");
            return path ? `${path}: ${err.message}` : err.message;
        })
        .join("; ");
}
