import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    let userId = (session?.user as any)?.id;

    const formData = await req.formData();
    const file = formData.get("file") as File;
    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Save to project uploads directory
    const uploadDir = path.join(process.cwd(), "uploads");
    await mkdir(uploadDir, { recursive: true });

    // Clean original filename and generate safe unique name
    const sanitizedOriginalName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
    const uniqueFilename = `${Date.now()}-${crypto.randomBytes(8).toString("hex")}-${sanitizedOriginalName}`;
    const filePath = path.join(uploadDir, uniqueFilename);

    await writeFile(filePath, buffer);

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
    let category = "General";
    const ext = path.extname(file.name).toLowerCase();
    if (ext === ".pdf") category = "PDF Document";
    else if (ext === ".docx") category = "Word Document";
    else if (ext === ".txt" || ext === ".md") category = "Text Document";
    else if (ext === ".json" || ext === ".csv") category = "Data File";

    // Save document metadata to database
    const document = await prisma.document.create({
      data: {
        userId,
        title: file.name,
        filename: uniqueFilename,
        path: filePath,
        size: file.size,
        type: file.type || ext || "application/octet-stream",
        status: "PENDING",
        category
      }
    });

    return NextResponse.json({
      success: true,
      filename: uniqueFilename,
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
