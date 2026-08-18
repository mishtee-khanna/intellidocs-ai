import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { pipeline } from "@xenova/transformers";

// Use singletons for transformers to avoid reloading models on every request
let extractor: any = null;
let qaModel: any = null;

async function getExtractor() {
  if (!extractor) {
    extractor = await pipeline("feature-extraction", "Xenova/all-MiniLM-L6-v2");
  }
  return extractor;
}

async function getQaModel() {
  if (!qaModel) {
    qaModel = await pipeline("question-answering", "Xenova/distilbert-base-cased-distilled-squad");
  }
  return qaModel;
}

// Utility for cosine similarity
function cosineSimilarity(vecA: number[], vecB: number[]) {
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }
  if (normA === 0 || normB === 0) return 0;
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

export async function POST(req: Request) {
  try {
    const { query } = await req.json();

    if (!query) {
      return NextResponse.json({ error: "No query provided" }, { status: 400 });
    }

    // 1. Generate Embedding for the User Query
    const extract = await getExtractor();
    const queryOutput = await extract(query, { pooling: "mean", normalize: true });
    const queryVector = Array.from(queryOutput.data) as number[];

    // 2. Fetch all document chunks and their embeddings from DB (In-memory Vector Search for MVP)
    // For a production app with MySQL, you'd use a dedicated vector DB or MySQL 9.0 vector support.
    const allChunks = await prisma.documentChunk.findMany({
      include: { document: true }
    });

    if (allChunks.length === 0) {
      return NextResponse.json({ answer: "No documents have been indexed yet.", sources: [] });
    }

    // 3. Compute similarities and rank
    const scoredChunks = allChunks.map(chunk => {
      let similarity = -1;
      if (chunk.embedding) {
        // Handle different JSON parsing depending on Prisma/DB driver output
        const chunkVector = typeof chunk.embedding === 'string' 
          ? JSON.parse(chunk.embedding) 
          : chunk.embedding;
          
        similarity = cosineSimilarity(queryVector, chunkVector as number[]);
      }
      return { ...chunk, similarity };
    });

    // Sort descending by similarity
    scoredChunks.sort((a, b) => b.similarity - a.similarity);
    
    // Take Top-K most relevant chunks
    const topChunks = scoredChunks.slice(0, 3);
    
    // Combine content into context
    const context = topChunks.map(c => c.content).join("\n\n");

    // 4. Answer Question using QA Model
    const qa = await getQaModel();
    const answerResult = await qa(query, context);

    const sources = topChunks.map(c => ({
      documentId: c.documentId,
      filename: c.document.filename,
      similarity: c.similarity
    }));

    return NextResponse.json({ 
      answer: answerResult.answer, 
      score: answerResult.score,
      sources 
    });

  } catch (error) {
    console.error("Chat API Error:", error);
    return NextResponse.json({ error: "Failed to process chat query" }, { status: 500 });
  }
}
