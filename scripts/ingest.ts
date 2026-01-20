import fs from "fs/promises";
import path from "path";
import { prisma } from "../lib/prisma";
import { chunkText } from "../lib/chunking";
import { embedText } from "../lib/embeddings";

const SOURCES_DIR = path.join(process.cwd(), "sources_seed");

const slugify = (value: string) =>
  value
    .toLowerCase()
    .replace(/\.[^/.]+$/, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");

const ingest = async () => {
  const files = await fs.readdir(SOURCES_DIR);
  const textFiles = files.filter((file) => file.endsWith(".txt"));

  if (textFiles.length === 0) {
    throw new Error("No source files found in sources_seed.");
  }

  await prisma.sourceChunk.deleteMany();
  await prisma.source.deleteMany();

  for (const file of textFiles) {
    const fullPath = path.join(SOURCES_DIR, file);
    const content = await fs.readFile(fullPath, "utf-8");
    const title = file
      .replace(/_/g, " ")
      .replace(/\.txt$/, "")
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
    const slug = slugify(file);

    const source = await prisma.source.create({
      data: {
        title,
        slug,
        path: `sources_seed/${file}`,
        ingestedAt: new Date()
      }
    });

    const chunks = chunkText(content);

    for (const chunk of chunks) {
      await prisma.sourceChunk.create({
        data: {
          sourceId: source.id,
          order: chunk.order,
          start: chunk.start,
          end: chunk.end,
          content: chunk.content,
          embedding: embedText(chunk.content)
        }
      });
    }

    console.log(`Ingested ${title} (${chunks.length} chunks)`);
  }
};

ingest()
  .then(() => {
    console.log("Ingestion complete.");
    return prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
