import { pipeline } from "@huggingface/transformers";

// Singletons for transformer pipelines
let extractorInstance: any = null;
let qaInstance: any = null;

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

/**
 * Intelligent semantic text chunker
 * Splits text by paragraphs / sentences with configurable overlap
 */
export function chunkText(text: string, chunkSize = 900, overlap = 150): string[] {
  if (!text || text.trim().length === 0) return [];
  if (text.length <= chunkSize) return [text.trim()];

  const chunks: string[] = [];
  const paragraphs = text.split(/\n\n+/);
  let currentChunk = "";

  for (const para of paragraphs) {
    const cleanPara = para.trim();
    if (!cleanPara) continue;

    // If adding this paragraph stays within chunkSize
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

  if (currentChunk.trim()) {
    chunks.push(currentChunk.trim());
  }

  return chunks.filter(c => c.length > 15);
}

/**
 * Singleton feature extraction (embeddings) pipeline
 */
export async function getExtractor() {
  if (!extractorInstance) {
    try {
      extractorInstance = await pipeline("feature-extraction", "Xenova/all-MiniLM-L6-v2");
    } catch (err) {
      console.error("Failed to load Xenova/all-MiniLM-L6-v2:", err);
      throw err;
    }
  }
  return extractorInstance;
}

/**
 * Generate embedding vector for a piece of text
 */
export async function generateEmbedding(text: string): Promise<number[]> {
  const extractor = await getExtractor();
  const output = await extractor(text, { pooling: "mean", normalize: true });
  return Array.from(output.data) as number[];
}

/**
 * Singleton question answering pipeline
 */
export async function getQaModel() {
  if (!qaInstance) {
    try {
      qaInstance = await pipeline(
        "question-answering",
        "Xenova/distilbert-base-cased-distilled-squad"
      );
    } catch (err) {
      console.error("Failed to load QA model:", err);
      throw err;
    }
  }
  return qaInstance;
}

/**
 * Calculate cosine similarity between two vectors
 */
export function cosineSimilarity(vecA: number[], vecB: number[]): number {
  if (!vecA || !vecB || vecA.length === 0 || vecB.length === 0) return 0;
  if (vecA.length !== vecB.length) return 0;

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

/**
 * Rank chunks by cosine similarity to query embedding
 */
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
        try {
          vec = JSON.parse(vec);
        } catch {
          vec = [];
        }
      }
      similarity = cosineSimilarity(queryVector, vec as number[]);
    }
    return { ...chunk, similarity };
  });

  scored.sort((a, b) => b.similarity - a.similarity);
  return scored.slice(0, topK);
}

/**
 * Format code snippets inside content cleanly with Markdown codeblocks
 */
function formatCodeAndText(rawContent: string): string {
  let cleaned = rawContent
    .replace(/--\s*\d+\s+of\s+\d+\s*--/gi, "") // remove page footer markers
    .replace(/^Page\s+\d+\s*$/gmi, "")
    .trim();

  // If content looks like C++ code
  if (
    cleaned.includes("#include") ||
    (cleaned.includes("int main()") && cleaned.includes("cin >>")) ||
    cleaned.includes("cout <<") ||
    cleaned.includes("vector<") ||
    cleaned.includes("std::")
  ) {
    // Check if it already has backticks
    if (!cleaned.includes("```")) {
      const parts = cleaned.split(/(?=#include)/);
      if (parts.length > 1) {
        return `${parts[0].trim()}\n\n\`\`\`cpp\n${parts.slice(1).join("").trim()}\n\`\`\``;
      } else {
        return `\`\`\`cpp\n${cleaned}\n\`\`\``;
      }
    }
  }

  // If content looks like Python code
  if (
    (cleaned.includes("def ") || cleaned.includes("import numpy") || cleaned.includes("print(")) &&
    !cleaned.includes("```")
  ) {
    return `\`\`\`python\n${cleaned}\n\`\`\``;
  }

  // If content looks like SQL code
  if (
    (cleaned.includes("SELECT ") || cleaned.includes("CREATE TABLE") || cleaned.includes("INSERT INTO")) &&
    !cleaned.includes("```")
  ) {
    return `\`\`\`sql\n${cleaned}\n\`\`\``;
  }

  return cleaned;
}

/**
 * Generate a complete, comprehensive, and in-depth answer with exact page and document citations
 */
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
  const bestDocTitle = bestChunk.document?.title || "Document";
  const bestPageNum = bestChunk.pageNumber || 1;
  const matchScore = Math.round((bestChunk.similarity || 0.75) * 100);

  // Group top unique pages and documents for citations
  const uniqueSources = new Map<string, { doc: string; pages: Set<number>; similarity: number }>();
  for (const chunk of topChunks) {
    const docName = chunk.document?.title || "Document";
    const page = chunk.pageNumber || 1;
    if (!uniqueSources.has(docName)) {
      uniqueSources.set(docName, { doc: docName, pages: new Set([page]), similarity: chunk.similarity });
    } else {
      uniqueSources.get(docName)!.pages.add(page);
    }
  }

  // Format primary relevant content
  const primaryText = formatCodeAndText(bestChunk.content);

  // Check if supporting chunks provide additional context
  let secondarySections = "";
  if (topChunks.length > 1) {
    const additionalChunks = topChunks.slice(1, 3).filter(c => {
      // Exclude near-duplicate text
      const dist = Math.abs(c.content.length - bestChunk.content.length);
      return dist > 30 || c.pageNumber !== bestChunk.pageNumber;
    });

    if (additionalChunks.length > 0) {
      secondarySections = additionalChunks
        .map(c => {
          const docName = c.document?.title || "Document";
          const page = c.pageNumber || 1;
          const formatted = formatCodeAndText(c.content);
          return `#### 📌 Related Section (${docName} — Page ${page}):\n${formatted}`;
        })
        .join("\n\n");
    }
  }

  // Build Sources list string
  const sourceCitationsList: string[] = [];
  uniqueSources.forEach((info, docName) => {
    const sortedPages = Array.from(info.pages).sort((a, b) => a - b);
    const pagesStr = sortedPages.map(p => `**Page ${p}**`).join(", ");
    sourceCitationsList.push(`- 📄 **${docName}** → ${pagesStr} *(Match: ${Math.round(info.similarity * 100)}%)*`);
  });

  // Construct complete, full structured answer
  let fullAnswer = `### 📄 Answer from **${bestDocTitle}** (Page ${bestPageNum})\n\n`;
  fullAnswer += `${primaryText}\n\n`;

  if (secondarySections) {
    fullAnswer += `${secondarySections}\n\n`;
  }

  fullAnswer += `---\n`;
  fullAnswer += `📍 **Exact Location:** Found in **\`${bestDocTitle}\`** on **Page ${bestPageNum}**\n\n`;
  fullAnswer += `📚 **All Referenced Sources & Pages:**\n${sourceCitationsList.join("\n")}`;

  return {
    answer: fullAnswer,
    score: matchScore / 100
  };
}
