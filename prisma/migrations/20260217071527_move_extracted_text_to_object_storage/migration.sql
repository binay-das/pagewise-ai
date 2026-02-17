/*
  Warnings:

  - You are about to drop the column `extractedText` on the `PdfSummary` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "PdfSummary" DROP COLUMN "extractedText",
ADD COLUMN     "extractedTextKey" TEXT,
ADD COLUMN     "wordCount" INTEGER NOT NULL DEFAULT 0;
