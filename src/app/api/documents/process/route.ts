import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { extractTextFromFile } from "@/lib/text-extractor";
import { chunkText, generateEmbedding } from "@/lib/rag";
import fs from "fs";

export async function POST(req: Request) {
  try {
    const { documentId } = await req.json();

    if (!documentId) {
      return NextResponse.json({ error: "No documentId provided" }, { status: 400 });
    }

    const document = await prisma.document.findUnique({
      where: { id: documentId }
    });

    if (!document) {
      return NextResponse.json({ error: "Document not found" }, { status: 404 });
    }

    if (!fs.existsSync(document.path)) {
      await prisma.document.update({
        where: { id: document.id },
        data: { status: "FAILED" }
      });
      return NextResponse.json({ error: "File not found on disk" }, { status: 404 });
    }

    // Set status to PROCESSING
    await prisma.document.update({
      where: { id: document.id },
      data: { status: "PROCESSING" }
    });

    // 1. Extract text and page-by-page mapping
    const { text, pageCount, pages } = await extractTextFromFile(
      document.path,
      document.type,
      document.title
    );

    if (!text || text.trim().length === 0) {
      await prisma.document.update({
        where: { id: document.id },
        data: {
          status: "COMPLETED",
          extractedText: "Empty document (no text found).",
          summary: "No text content detected in this file."
        }
      });
      return NextResponse.json({ success: true, chunksProcessed: 0 });
    }

    // Remove any old chunks if re-processing
    await prisma.documentChunk.deleteMany({
      where: { documentId: document.id }
    });

    // 2. Page-Aware Semantic Chunking & Vector Embeddings
    let processedChunksCount = 0;

    for (const page of pages) {
      const pageChunks = chunkText(page.text, 900, 150);

      for (const chunkContent of pageChunks) {
        if (!chunkContent || chunkContent.trim().length < 15) continue;

        let embeddingVector: number[] = [];
        try {
          embeddingVector = await generateEmbedding(chunkContent);
        } catch (embErr) {
          console.warn(`Embedding generation warning for chunk on page ${page.pageNumber}:`, embErr);
        }

        await prisma.documentChunk.create({
          data: {
            documentId: document.id,
            content: chunkContent,
            pageNumber: page.pageNumber,
            embedding: embeddingVector.length > 0 ? JSON.stringify(embeddingVector) : null
          }
        });

        processedChunksCount++;
      }
    }

    // Generate concise summary from first few sentences
    const summaryExcerpt = text.slice(0, 300).replace(/\n+/g, " ").trim();
    const summary = `${summaryExcerpt}... (${processedChunksCount} chunks indexed across ${pageCount} pages)`;

    // 3. Mark Document as COMPLETED
    const updatedDoc = await prisma.document.update({
      where: { id: document.id },
      data: {
        status: "COMPLETED",
        extractedText: text.slice(0, 15000), // Preview text stored in DB
        summary
      }
    });

    return NextResponse.json({
      success: true,
      documentId: updatedDoc.id,
      chunksProcessed: processedChunksCount,
      pageCount,
      summary
    });
  } catch (error: any) {
    console.error("Document processing error:", error);
    return NextResponse.json(
      { error: "Failed to process document", details: error.message || String(error) },
      { status: 500 }
    );
  }
}
