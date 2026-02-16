ALTER TABLE "DocumentChunk" ADD COLUMN "embedding_ollama" vector(768);
ALTER TABLE "DocumentChunk" ADD COLUMN "embedding_gemini" vector(3072);

ALTER TABLE "DocumentChunk" DROP COLUMN "embedding";
