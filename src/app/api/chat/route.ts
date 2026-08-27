import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateEmbedding, rankChunks, generateFullAnswer } from "@/lib/rag";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const { query, documentId } = await req.json();

    if (!query || !query.trim()) {
      return NextResponse.json({ error: "No query provided" }, { status: 400 });
    }

    const session = await getServerSession(authOptions);
    const userId = (session?.user as any)?.id;

    // 1. Generate Query Vector Embedding
    const queryVector = await generateEmbedding(query.trim());

    // 2. Build SQL Chunk Query
    const chunkWhere: any = {};
    if (documentId && documentId !== "all") {
      chunkWhere.documentId = documentId;
    } else if (userId && userId !== "local-user") {
      chunkWhere.document = { userId };
    }

    // Fetch candidate chunks from SQL DB
    const candidateChunks = await prisma.documentChunk.findMany({
      where: chunkWhere,
      include: {
        document: {
          select: {
            id: true,
            title: true,
            filename: true
          }
        }
      }
    });

    if (candidateChunks.length === 0) {
      return NextResponse.json({
        answer: "No indexed documents found. Please upload and process a document first to start chatting.",
        score: 0,
        sources: []
      });
    }

    // 3. Rank Chunks by Cosine Similarity
    const topChunks = rankChunks(queryVector, candidateChunks, 4);

    if (topChunks.length === 0 || topChunks[0].similarity < 0.05) {
      return NextResponse.json({
        answer: "I couldn't find any relevant sections in your uploaded documents for this question. Try rephrasing or selecting another document.",
        score: 0,
        sources: []
      });
    }

    // 4. Generate Comprehensive Full Answer with exact Page & Document locations
    const answerResult = await generateFullAnswer(query, topChunks);

    // 5. Structure Source Citations
    const sources = topChunks.map(c => ({
      documentId: c.documentId,
      documentTitle: c.document?.title || "Document",
      filename: c.document?.filename || "",
      pageNumber: c.pageNumber || 1,
      similarity: Math.round(c.similarity * 100) / 100,
      snippet: c.content.slice(0, 300) + (c.content.length > 300 ? "..." : "")
    }));

    return NextResponse.json({
      success: true,
      answer: answerResult.answer,
      score: answerResult.score,
      sources
    });
  } catch (error: any) {
    console.error("Chat API Error:", error);
    return NextResponse.json(
      { error: "Failed to process chat query", details: error.message || String(error) },
      { status: 500 }
    );
  }
}
