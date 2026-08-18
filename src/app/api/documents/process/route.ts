import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import fs from "fs";

import { pipeline } from "@huggingface/transformers";

// Simple text splitter function to avoid LangChain dependency issues
function chunkText(text: string, chunkSize = 1000, overlap = 200) {
  const chunks = [];
  let i = 0;
  while (i < text.length) {
    chunks.push(text.slice(i, i + chunkSize));
    i += chunkSize - overlap;
  }
  return chunks;
}


// Use a singleton pattern for the feature extraction pipeline
let extractor: any = null;

async function getExtractor() {
  if (!extractor) {
    // using a small embedding model suitable for local browser/node processing
    extractor = await pipeline("feature-extraction", "Xenova/all-MiniLM-L6-v2");
  }
  return extractor;
}

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
      return NextResponse.json({ error: "File not found on disk" }, { status: 404 });
    }

    // 1. Read and Parse PDF
    // Mock DOMMatrix and Path2D to prevent pdf-parse/pdfjs-dist crashing in Node.js
    if (typeof global.DOMMatrix === 'undefined') {
      (global as any).DOMMatrix = class DOMMatrix {
        constructor() {}
      };
    }
    if (typeof global.Path2D === 'undefined') {
      (global as any).Path2D = class Path2D {
        constructor() {}
      };
    }
    
    const pdfParse = require("pdf-parse");
    const fileBuffer = fs.readFileSync(document.path);
    const pdfData = await pdfParse(fileBuffer);
    const text = pdfData.text;

    // 2. Split Text into chunks
    const chunks = chunkText(text, 1000, 200);

    // 3. Generate Embeddings & Save to DB
    const extract = await getExtractor();

    for (let i = 0; i < chunks.length; i++) {
      const chunkTextContent = chunks[i];
      
      // Generate embedding vector
      const output = await extract(chunkTextContent, { pooling: "mean", normalize: true });
      const embeddingArray = Array.from(output.data);

      await prisma.documentChunk.create({
        data: {
          documentId: document.id,
          content: chunkTextContent,
          embedding: embeddingArray as any, // Store as JSON array in MySQL
        }
      });
    }

    // Update document status
    await prisma.document.update({
      where: { id: document.id },
      data: {
        status: "COMPLETED",
        extractedText: text.substring(0, 5000), // store preview of first 5000 chars
      }
    });

    return NextResponse.json({ success: true, chunksProcessed: chunks.length });
  } catch (error: any) {
    console.error("Document processing error:", error);
    return NextResponse.json({ error: "Failed to process document", details: error.message || String(error) }, { status: 500 });
  }
}
