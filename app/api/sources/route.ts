import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const sources = await prisma.source.findMany({
    include: { _count: { select: { chunks: true } } },
    orderBy: { title: "asc" }
  });

  return NextResponse.json({
    sources: sources.map((source) => ({
      id: source.id,
      title: source.title,
      slug: source.slug,
      ingestedAt: source.ingestedAt,
      chunkCount: source._count.chunks
    }))
  });
}
