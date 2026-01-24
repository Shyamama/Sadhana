import { prisma } from "./prisma";
import { cosineSimilarity, embedText } from "./embeddings";

export type RetrievedChunk = {
  id: string;
  sourceTitle: string;
  sourceSlug: string;
  order: number;
  content: string;
  score: number;
};

const parseEmbedding = (raw: string): number[] => {
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as number[]) : [];
  } catch {
    return [];
  }
};

export const retrieveChunks = async (query: string, topK = 4): Promise<RetrievedChunk[]> => {
  const queryEmbedding = embedText(query);
  const chunks = await prisma.sourceChunk.findMany({
    include: { source: true }
  });

  const scored = chunks.map((chunk) => {
    const embedding = parseEmbedding(chunk.embedding);
    const score = cosineSimilarity(queryEmbedding, embedding);
    return {
      id: chunk.id,
      sourceTitle: chunk.source.title,
      sourceSlug: chunk.source.slug,
      order: chunk.order,
      content: chunk.content,
      score
    };
  });

  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, topK)
    .filter((chunk) => chunk.score > 0);
};

export const buildAnswerFromChunks = (question: string, chunks: RetrievedChunk[]) => {
  if (!chunks.length) {
    return {
      answer:
        "I couldn't find a relevant passage in the current sources. Please rephrase or add sources.",
      citations: [] as RetrievedChunk[]
    };
  }

  const citations = chunks.map((chunk) => chunk);
  const distilled = chunks
    .map((chunk) => chunk.content.split(/(?<=[.!?])\s+/).slice(0, 2).join(" "))
    .join(" ");

  const answer = `Pandit Mode (demo):\n\nQ: ${question}\n\nBased on the sources, here's a grounded response: ${distilled}`;

  return { answer, citations };
};

export const panditSystemPrompt = `You are Pandit Mode for Sādhanā.\n\nGuidelines:\n- Be humble and transparent about uncertainty.\n- Respect diversity across sects and lineages; avoid declaring a single orthodox view.\n- Never offer medical or legal advice.\n- Do not override or replace a user's existing diksha or teacher guidance.\n- When evidence is weak, say so clearly.\n- Only cite sources provided; never hallucinate citations.`;
