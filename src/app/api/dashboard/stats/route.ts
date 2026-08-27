import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const userId = (session?.user as any)?.id;

    const where = userId && userId !== "local-user" ? { userId } : {};

    // 1. Fetch total documents and statuses
    const documents = await prisma.document.findMany({
      where,
      select: {
        id: true,
        title: true,
        size: true,
        status: true,
        category: true,
        createdAt: true,
        _count: {
          select: { chunks: true }
        }
      },
      orderBy: { createdAt: "desc" }
    });

    const totalDocuments = documents.length;
    const completedCount = documents.filter(d => d.status === "COMPLETED").length;
    const processingCount = documents.filter(d => d.status === "PROCESSING" || d.status === "PENDING").length;
    const failedCount = documents.filter(d => d.status === "FAILED").length;

    const totalSizeBytes = documents.reduce((acc, curr) => acc + (curr.size || 0), 0);
    const totalChunks = documents.reduce((acc, curr) => acc + (curr._count?.chunks || 0), 0);

    // Recent 5 documents
    const recentDocuments = documents.slice(0, 5).map(d => ({
      id: d.id,
      title: d.title,
      size: d.size,
      status: d.status,
      category: d.category,
      chunkCount: d._count.chunks,
      createdAt: d.createdAt
    }));

    return NextResponse.json({
      success: true,
      stats: {
        totalDocuments,
        completedCount,
        processingCount,
        failedCount,
        totalChunks,
        totalSizeBytes,
        storageFormatted: (totalSizeBytes / (1024 * 1024)).toFixed(2) + " MB",
        storagePercent: Math.min(100, Math.round((totalSizeBytes / (500 * 1024 * 1024)) * 100)), // based on 500MB quota
        recentDocuments
      }
    });
  } catch (error: any) {
    console.error("Dashboard stats error:", error);
    return NextResponse.json(
      { error: "Failed to fetch dashboard stats", details: error.message || String(error) },
      { status: 500 }
    );
  }
}
