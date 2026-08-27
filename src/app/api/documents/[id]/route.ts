import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import fs from "fs";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const document = await prisma.document.findUnique({
      where: { id },
      include: {
        chunks: {
          select: {
            id: true,
            content: true,
            pageNumber: true,
            embedding: true
          }
        }
      }
    });

    if (!document) {
      return NextResponse.json({ error: "Document not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      document: {
        ...document,
        chunks: document.chunks.map(c => ({
          ...c,
          hasEmbedding: !!c.embedding,
          embeddingPreview: c.embedding
            ? JSON.parse(typeof c.embedding === "string" ? c.embedding : JSON.stringify(c.embedding)).slice(0, 5)
            : []
        }))
      }
    });
  } catch (error: any) {
    console.error("Get document error:", error);
    return NextResponse.json(
      { error: "Failed to retrieve document", details: error.message || String(error) },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const document = await prisma.document.findUnique({
      where: { id }
    });

    if (!document) {
      return NextResponse.json({ error: "Document not found" }, { status: 404 });
    }

    // Delete stored file from disk if it exists
    if (document.path && fs.existsSync(document.path)) {
      try {
        fs.unlinkSync(document.path);
      } catch (unlinkErr) {
        console.warn("Could not delete file from disk:", unlinkErr);
      }
    }

    // Delete document and cascades to chunks in database
    await prisma.document.delete({
      where: { id }
    });

    return NextResponse.json({
      success: true,
      message: "Document and associated vector embeddings deleted successfully"
    });
  } catch (error: any) {
    console.error("Delete document error:", error);
    return NextResponse.json(
      { error: "Failed to delete document", details: error.message || String(error) },
      { status: 500 }
    );
  }
}
