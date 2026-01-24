import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const entries = await prisma.journalEntry.findMany({
    orderBy: { createdAt: "desc" }
  });

  return NextResponse.json({ entries });
}

export async function POST(request: Request) {
  const body = await request.json();
  const content = String(body?.content ?? "").trim();
  if (!content) {
    return NextResponse.json({ error: "Entry content is required." }, { status: 400 });
  }

  const entry = await prisma.journalEntry.create({
    data: {
      content,
      mood: body?.mood ? String(body.mood) : null,
      summary: body?.summary ? String(body.summary) : null
    }
  });

  return NextResponse.json({ entry });
}
