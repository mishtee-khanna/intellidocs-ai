import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const userId = (session?.user as any)?.id;

    // Fetch documents (filtered by user if authenticated, or all in local mode)
    const where = userId && userId !== "local-user" ? { userId } : {};

    const documents = await prisma.document.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        _count: {
          select: { chunks: true }
        }
      }
    });

    return NextResponse.json({
      success: true,
      documents: documents.map(doc => ({
        id: doc.id,
        title: doc.title,
        filename: doc.filename,
        size: doc.size,
        type: doc.type,
        status: doc.status,
        summary: doc.summary,
        category: doc.category,
        chunkCount: doc._count.chunks,
        createdAt: doc.createdAt,
        updatedAt: doc.updatedAt
      }))
    });
  } catch (error: any) {
    console.error("Fetch documents error:", error);
    return NextResponse.json(
      { error: "Failed to fetch documents", details: error.message || String(error) },
      { status: 500 }
    );
  }
}
