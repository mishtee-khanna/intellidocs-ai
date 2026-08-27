import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    let userId = (session?.user as any)?.id;

    const formData = await req.formData();
    const file = formData.get("file") as File;
    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Read file into memory — no disk writes (Vercel is read-only)
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64Content = buffer.toString("base64");

    // Ensure we have a valid user in database
    if (!userId || userId === "local-user") {
      let defaultUser = await prisma.user.findFirst();
      if (!defaultUser) {
        defaultUser = await prisma.user.create({
          data: {
            email: "demo@intellidocs.ai",
            name: "Demo Explorer"
          }
        });
      }
      userId = defaultUser.id;
    }

    // Determine category based on file type
    const ext = file.name.split(".").pop()?.toLowerCase() || "";
    let category = "General";
    if (ext === "pdf") category = "PDF Document";
    else if (ext === "docx") category = "Word Document";
    else if (ext === "txt" || ext === "md") category = "Text Document";
    else if (ext === "json" || ext === "csv") category = "Data File";

    // Save document metadata + file content in DB (no filesystem)
    const document = await prisma.document.create({
      data: {
        userId,
        title: file.name,
        filename: file.name,
        path: base64Content,       // store base64 content in path field
        size: file.size,
        type: file.type || ext || "application/octet-stream",
        status: "PENDING",
        category
      }
    });

    return NextResponse.json({
      success: true,
      filename: file.name,
      documentId: document.id,
      document: {
        id: document.id,
        title: document.title,
        size: document.size,
        status: document.status,
        category: document.category,
        createdAt: document.createdAt
      }
    });
  } catch (error: any) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Upload failed", details: error.message || String(error) },
      { status: 500 }
    );
  }
}
