import { NextResponse } from "next/server";
import { buildAnswerFromChunks, panditSystemPrompt, retrieveChunks } from "@/lib/rag";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const question = String(body?.question ?? "");
    if (!question.trim()) {
      return NextResponse.json({ error: "Question is required." }, { status: 400 });
    }

    const chunks = await retrieveChunks(question, body?.topK ?? 4);
    const { answer, citations } = buildAnswerFromChunks(question, chunks);

    return NextResponse.json({
      systemPrompt: panditSystemPrompt,
      answer,
      citations: citations.map((chunk) => ({
        id: chunk.id,
        sourceTitle: chunk.sourceTitle,
        sourceSlug: chunk.sourceSlug,
        order: chunk.order,
        excerpt: chunk.content
      }))
    });
  } catch (error) {
    console.error("Ask POST failed:", error);
    return NextResponse.json({ error: "Failed to answer question." }, { status: 500 });
  }
}
