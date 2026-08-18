import "dotenv/config";
import { prisma } from "./src/lib/prisma";

async function main() {
  try {
    const docs = await prisma.document.findMany();
    console.log("Documents:", docs);
    const chunks = await prisma.documentChunk.findMany();
    console.log("Chunks:", chunks.length);
  } catch (e) {
    console.error("Prisma error:", e);
  } finally {
    await prisma.$disconnect();
  }
}

main();
