import { GoogleGenerativeAI } from "@google/generative-ai";

// ── Gemini client (lazy init) ────────────────────────────────────────────────
let genAI: GoogleGenerativeAI | null = null;

function getGenAI(): GoogleGenerativeAI {
  if (!genAI) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) throw new Error("GEMINI_API_KEY environment variable is not set");
    genAI = new GoogleGenerativeAI(apiKey);
  }
  return genAI;
}

export interface ScoredChunk {
  id: string;
  documentId: string;
  content: string;
  pageNumber: number | null;
  similarity: number;
  document?: {
    id: string;
    title: string;
    filename: string;
  };
}

// ── Text Chunker ─────────────────────────────────────────────────────────────
export function chunkText(text: string, chunkSize = 900, overlap = 150): string[] {
  if (!text || text.trim().length === 0) return [];
  if (text.length <= chunkSize) return [text.trim()];

  const chunks: string[] = [];
  const paragraphs = text.split(/\n\n+/);
  let currentChunk = "";

  for (const para of paragraphs) {
    const cleanPara = para.trim();
    if (!cleanPara) continue;

    if ((currentChunk + "\n\n" + cleanPara).length <= chunkSize) {
      currentChunk = currentChunk ? currentChunk + "\n\n" + cleanPara : cleanPara;
    } else {
      if (currentChunk) {
        chunks.push(currentChunk);
        const overlapText = currentChunk.slice(Math.max(0, currentChunk.length - overlap));
        currentChunk = overlapText + "\n\n" + cleanPara;
      } else {
        const sentences = cleanPara.split(/(?<=[.?!])\s+/);
        for (const sentence of sentences) {
          if ((currentChunk + " " + sentence).length <= chunkSize) {
            currentChunk = currentChunk ? currentChunk + " " + sentence : sentence;
          } else {
            if (currentChunk) {
              chunks.push(currentChunk);
              const overlapText = currentChunk.slice(Math.max(0, currentChunk.length - overlap));
              currentChunk = overlapText + " " + sentence;
            } else {
              for (let i = 0; i < sentence.length; i += chunkSize - overlap) {
                chunks.push(sentence.slice(i, i + chunkSize));
              }
              currentChunk = "";
            }
          }
        }
      }
    }
  }

  if (currentChunk.trim()) chunks.push(currentChunk.trim());
  return chunks.filter(c => c.length > 15);
}

// ── Gemini Embeddings ────────────────────────────────────────────────────────
export async function generateEmbedding(text: string): Promise<number[]> {
  try {
    const model = getGenAI().getGenerativeModel({ model: "text-embedding-004" });
    const result = await model.embedContent(text.slice(0, 2048)); // max safe length
    return result.embedding.values;
  } catch (err) {
    console.error("Gemini embedding error:", err);
    // Fallback: simple keyword-hash embedding (64-dim)
    return simpleFallbackEmbedding(text);
  }
}

function simpleFallbackEmbedding(text: string): number[] {
  const words = text.toLowerCase().split(/\W+/).filter(Boolean);
  const vec = new Array(64).fill(0);
  for (const word of words) {
    let h = 5381;
    for (let i = 0; i < word.length; i++) h = ((h << 5) + h) ^ word.charCodeAt(i);
    vec[Math.abs(h) % 64] += 1;
  }
  const mag = Math.sqrt(vec.reduce((s, v) => s + v * v, 0)) || 1;
  return vec.map(v => v / mag);
}

// ── Cosine Similarity ────────────────────────────────────────────────────────
export function cosineSimilarity(vecA: number[], vecB: number[]): number {
  if (!vecA?.length || !vecB?.length || vecA.length !== vecB.length) return 0;
  let dot = 0, normA = 0, normB = 0;
  for (let i = 0; i < vecA.length; i++) {
    dot += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }
  if (normA === 0 || normB === 0) return 0;
  return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}

// ── Rank Chunks ──────────────────────────────────────────────────────────────
export function rankChunks<T extends { embedding: any; content: string }>(
  queryVector: number[],
  chunks: T[],
  topK = 4
): (T & { similarity: number })[] {
  const scored = chunks.map(chunk => {
    let similarity = 0;
    if (chunk.embedding) {
      let vec = chunk.embedding;
      if (typeof vec === "string") {
        try { vec = JSON.parse(vec); } catch { vec = []; }
      }
      similarity = cosineSimilarity(queryVector, vec as number[]);
    }
    return { ...chunk, similarity };
  });
  scored.sort((a, b) => b.similarity - a.similarity);
  return scored.slice(0, topK);
}

// ── Gemini Answer Generation ─────────────────────────────────────────────────
export async function generateFullAnswer(
  query: string,
  topChunks: ScoredChunk[]
): Promise<{ answer: string; score: number }> {
  if (!topChunks || topChunks.length === 0) {
    return {
      answer: "I couldn't find any matching content in your uploaded documents for this question. Try selecting a specific document or rephrasing your search.",
      score: 0
    };
  }

  const bestChunk = topChunks[0];
  const matchScore = Math.round((bestChunk.similarity || 0.75) * 100);

  // Build context from top chunks
  const context = topChunks
    .map((c, i) => {
      const doc = c.document?.title || "Document";
      const page = c.pageNumber || 1;
      return `[Source ${i + 1}: ${doc}, Page ${page}]\n${c.content}`;
    })
    .join("\n\n---\n\n");

  // Source citations
  const uniqueSources = new Map<string, { pages: Set<number>; similarity: number }>();
  for (const chunk of topChunks) {
    const docName = chunk.document?.title || "Document";
    const page = chunk.pageNumber || 1;
    if (!uniqueSources.has(docName)) {
      uniqueSources.set(docName, { pages: new Set([page]), similarity: chunk.similarity });
    } else {
      uniqueSources.get(docName)!.pages.add(page);
    }
  }

  try {
    const model = getGenAI().getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = `You are an intelligent document assistant. Answer the user's question based ONLY on the provided document context. Be comprehensive, precise, and cite the source document and page number in your answer.

DOCUMENT CONTEXT:
${context}

USER QUESTION: ${query}

Provide a detailed, well-structured answer with exact citations. If the answer isn't in the context, say so clearly.`;

    const result = await model.generateContent(prompt);
    const aiAnswer = result.response.text();

    const sourceCitationsList: string[] = [];
    uniqueSources.forEach((info, docName) => {
      const pagesStr = Array.from(info.pages).sort((a, b) => a - b).map(p => `**Page ${p}**`).join(", ");
      sourceCitationsList.push(`- 📄 **${docName}** → ${pagesStr} *(Match: ${Math.round(info.similarity * 100)}%)*`);
    });

    const fullAnswer = `${aiAnswer}\n\n---\n📚 **Sources:**\n${sourceCitationsList.join("\n")}`;
    return { answer: fullAnswer, score: matchScore / 100 };

  } catch (err) {
    console.error("Gemini generation error:", err);
    // Fallback to raw context display
    const bestDocTitle = bestChunk.document?.title || "Document";
    const bestPageNum = bestChunk.pageNumber || 1;
    return {
      answer: `### 📄 From **${bestDocTitle}** (Page ${bestPageNum})\n\n${bestChunk.content}`,
      score: matchScore / 100
    };
  }
}
