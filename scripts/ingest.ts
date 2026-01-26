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

const listTextFiles = async (dir: string): Promise<string[]> => {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files: string[] = [];
  for (const entry of entries) {
    const resolved = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await listTextFiles(resolved)));
    } else if (entry.isFile() && entry.name.endsWith(".txt")) {
      files.push(resolved);
    }
  }
  return files;
};

const ingest = async () => {
  const files = await listTextFiles(SOURCES_DIR);

  if (files.length === 0) {
    throw new Error("No source files found in sources_seed.");
  }

  await prisma.sourceChunk.deleteMany();
  await prisma.source.deleteMany();

  for (const fullPath of files) {
    const content = await fs.readFile(fullPath, "utf-8");
    const filename = path.basename(fullPath);
    const title = filename
      .replace(/_/g, " ")
      .replace(/\.txt$/, "")
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
    const slug = slugify(filename);

    const source = await prisma.source.create({
      data: {
        title,
        slug,
        path: path.relative(process.cwd(), fullPath),
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
