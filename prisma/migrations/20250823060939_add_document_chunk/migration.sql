-- CreateTable
CREATE TABLE "public"."DocumentChunk" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "embedding" vector(768),
    "pdfSummaryId" TEXT NOT NULL,

    CONSTRAINT "DocumentChunk_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "DocumentChunk_pdfSummaryId_idx" ON "public"."DocumentChunk"("pdfSummaryId");

-- AddForeignKey
ALTER TABLE "public"."DocumentChunk" ADD CONSTRAINT "DocumentChunk_pdfSummaryId_fkey" FOREIGN KEY ("pdfSummaryId") REFERENCES "public"."PdfSummary"("id") ON DELETE CASCADE ON UPDATE CASCADE;
