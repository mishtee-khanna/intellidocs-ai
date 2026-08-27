// No fs/path imports — works entirely from in-memory Buffers (Vercel-compatible)

export interface ExtractedPage {
  pageNumber: number;
  text: string;
}

export interface ExtractionResult {
  text: string;
  pageCount: number;
  pages: ExtractedPage[];
}

export function cleanText(text: string): string {
  if (!text) return "";
  return text
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    .replace(/\t/g, "  ")
    .replace(/[ \t]{3,}/g, "  ")
    .replace(/\n{4,}/g, "\n\n\n")
    .trim();
}

/**
 * Extract text from a Buffer — no filesystem access (Vercel-safe)
 */
export async function extractTextFromBuffer(
  fileBuffer: Buffer,
  mimeType: string,
  filename: string
): Promise<ExtractionResult> {
  const ext = (filename.split(".").pop() || "").toLowerCase();

  // 1. PDF
  if (ext === "pdf" || mimeType === "application/pdf") {
    try {
      const pdfParseModule = require("pdf-parse");
      let extractedText = "";
      let pages: ExtractedPage[] = [];

      if (typeof pdfParseModule === "function") {
        const data = await pdfParseModule(fileBuffer);
        extractedText = cleanText(data.text || "");
        pages = [{ pageNumber: 1, text: extractedText }];
      } else if (typeof pdfParseModule.default === "function") {
        const data = await pdfParseModule.default(fileBuffer);
        extractedText = cleanText(data.text || "");
        pages = [{ pageNumber: 1, text: extractedText }];
      } else if (pdfParseModule.PDFParse) {
        const parser = new pdfParseModule.PDFParse({ data: fileBuffer });
        const textRes = await parser.getText();
        if (textRes && Array.isArray(textRes.pages) && textRes.pages.length > 0) {
          pages = textRes.pages
            .map((p: any, idx: number) => ({
              pageNumber: p.num || idx + 1,
              text: cleanText(p.text || "")
            }))
            .filter((p: any) => p.text.length > 0);
          extractedText = pages.map(p => `--- [Page ${p.pageNumber}] ---\n${p.text}`).join("\n\n");
        } else if (textRes && typeof textRes.text === "string") {
          extractedText = cleanText(textRes.text);
          pages = [{ pageNumber: 1, text: extractedText }];
        }
        await parser.destroy?.();
      } else {
        throw new Error("Unable to initialize PDF parser");
      }

      return {
        text: extractedText || "No text could be extracted from this PDF.",
        pageCount: pages.length || 1,
        pages: pages.length > 0 ? pages : [{ pageNumber: 1, text: extractedText }]
      };
    } catch (err: any) {
      console.error("PDF parse error:", err);
      throw new Error(`Failed to parse PDF: ${err.message}`);
    }
  }

  // 2. DOCX
  if (
    ext === "docx" ||
    mimeType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ) {
    try {
      const mammoth = require("mammoth");
      const result = await mammoth.extractRawText({ buffer: fileBuffer });
      const text = cleanText(result.value || "");
      return { text: text || "No text found.", pageCount: 1, pages: [{ pageNumber: 1, text }] };
    } catch (err: any) {
      console.error("DOCX parse error:", err);
      const raw = cleanText(fileBuffer.toString("utf-8").replace(/[^\x20-\x7E\n]/g, " "));
      return { text: raw.slice(0, 10000) || "Unable to extract DOCX text.", pageCount: 1, pages: [{ pageNumber: 1, text: raw }] };
    }
  }

  // 3. Plain text, Markdown, CSV, JSON
  if (["txt", "md", "json", "csv", "log"].includes(ext) || mimeType.startsWith("text/")) {
    const text = cleanText(fileBuffer.toString("utf-8"));
    return { text: text || "Empty file.", pageCount: 1, pages: [{ pageNumber: 1, text }] };
  }

  // 4. Fallback
  const raw = cleanText(fileBuffer.toString("utf-8").replace(/[^\x20-\x7E\n]/g, " "));
  return {
    text: raw.slice(0, 10000) || "Unsupported document format.",
    pageCount: 1,
    pages: [{ pageNumber: 1, text: raw }]
  };
}
