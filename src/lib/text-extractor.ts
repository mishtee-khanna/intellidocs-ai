import fs from "fs";
import path from "path";

// Shims for PDF.js / Node.js runtime compatibility
if (typeof (global as any).DOMMatrix === "undefined") {
  (global as any).DOMMatrix = class DOMMatrix {
    constructor() {}
  };
}
if (typeof (global as any).Path2D === "undefined") {
  (global as any).Path2D = class Path2D {
    constructor() {}
  };
}

export interface ExtractedPage {
  pageNumber: number;
  text: string;
}

export interface ExtractionResult {
  text: string;
  pageCount: number;
  pages: ExtractedPage[];
}

/**
 * Clean and normalize extracted text
 */
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
 * Extract plain text and page-by-page text from an uploaded document file
 */
export async function extractTextFromFile(
  filePath: string,
  mimeType: string,
  filename: string
): Promise<ExtractionResult> {
  if (!fs.existsSync(filePath)) {
    throw new Error(`File not found at path: ${filePath}`);
  }

  const ext = path.extname(filename || filePath).toLowerCase();
  const fileBuffer = fs.readFileSync(filePath);

  // 1. PDF Files (with precise page-by-page mapping)
  if (ext === ".pdf" || mimeType === "application/pdf") {
    try {
      const pdfParseModule = require("pdf-parse");
      let extractedText = "";
      let pages: ExtractedPage[] = [];

      // Handle pdf-parse v2+ Class Export
      if (pdfParseModule.PDFParse) {
        const parser = new pdfParseModule.PDFParse({ data: fileBuffer });
        const textRes = await parser.getText();
        
        if (textRes && Array.isArray(textRes.pages) && textRes.pages.length > 0) {
          pages = textRes.pages.map((p: any, idx: number) => ({
            pageNumber: p.num || idx + 1,
            text: cleanText(p.text || "")
          })).filter((p: any) => p.text.length > 0);
          
          extractedText = pages.map(p => `--- [Page ${p.pageNumber}] ---\n${p.text}`).join("\n\n");
        } else if (textRes && typeof textRes.text === "string") {
          extractedText = cleanText(textRes.text);
          pages = [{ pageNumber: 1, text: extractedText }];
        }
        await parser.destroy();
      } else if (typeof pdfParseModule === "function") {
        const data = await pdfParseModule(fileBuffer);
        extractedText = cleanText(data.text || "");
        pages = [{ pageNumber: 1, text: extractedText }];
      } else if (typeof pdfParseModule.default === "function") {
        const data = await pdfParseModule.default(fileBuffer);
        extractedText = cleanText(data.text || "");
        pages = [{ pageNumber: 1, text: extractedText }];
      } else {
        throw new Error("Unable to initialize PDF parser module");
      }

      return {
        text: extractedText || "No text could be extracted from this PDF.",
        pageCount: pages.length > 0 ? pages.length : 1,
        pages: pages.length > 0 ? pages : [{ pageNumber: 1, text: extractedText }]
      };
    } catch (pdfErr: any) {
      console.error("PDF Parsing Error:", pdfErr);
      throw new Error(`Failed to parse PDF document: ${pdfErr.message || pdfErr}`);
    }
  }

  // 2. DOCX Word Files
  if (
    ext === ".docx" ||
    mimeType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ) {
    try {
      const mammoth = require("mammoth");
      const result = await mammoth.extractRawText({ buffer: fileBuffer });
      const text = cleanText(result.value || "");
      return {
        text: text || "No text found in Word document.",
        pageCount: 1,
        pages: [{ pageNumber: 1, text }]
      };
    } catch (docxErr: any) {
      console.error("DOCX Parsing Error:", docxErr);
      const raw = fileBuffer.toString("utf-8");
      const cleaned = cleanText(raw.replace(/[^\x20-\x7E\n]/g, " "));
      return {
        text: cleaned.slice(0, 10000) || "Unable to extract DOCX text.",
        pageCount: 1,
        pages: [{ pageNumber: 1, text: cleaned }]
      };
    }
  }

  // 3. Plain Text, Markdown, CSV, JSON
  if (
    ext === ".txt" ||
    ext === ".md" ||
    ext === ".json" ||
    ext === ".csv" ||
    ext === ".log" ||
    mimeType.startsWith("text/")
  ) {
    const text = cleanText(fileBuffer.toString("utf-8"));
    return {
      text: text || "Empty text file.",
      pageCount: 1,
      pages: [{ pageNumber: 1, text }]
    };
  }

  // 4. Fallback for other file types
  try {
    const raw = fileBuffer.toString("utf-8");
    const cleaned = cleanText(raw.replace(/[^\x20-\x7E\n]/g, " "));
    return {
      text: cleaned.slice(0, 10000) || "Unsupported document format.",
      pageCount: 1,
      pages: [{ pageNumber: 1, text: cleaned }]
    };
  } catch (err: any) {
    throw new Error(`Unsupported document type (${ext || mimeType})`);
  }
}
