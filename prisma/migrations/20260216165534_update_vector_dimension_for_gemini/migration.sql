-- Delete existing embeddings (incompatible dimensions)
DELETE FROM "DocumentChunk";

-- AlterTable: Change vector dimension from 768 to 3072 for Gemini
ALTER TABLE "DocumentChunk" DROP COLUMN "embedding";
ALTER TABLE "DocumentChunk" ADD COLUMN "embedding" vector(3072);