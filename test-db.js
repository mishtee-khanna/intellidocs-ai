const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

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
