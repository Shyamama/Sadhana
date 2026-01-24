import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const entries = await prisma.journalEntry.findMany({
      orderBy: { createdAt: "desc" }
    });

    return NextResponse.json({ entries });
  } catch (error) {
    console.error("Journal GET failed:", error);
    return NextResponse.json({ error: "Failed to load journal entries." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
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
  } catch (error) {
    console.error("Journal POST failed:", error);
    return NextResponse.json({ error: "Failed to save journal entry." }, { status: 500 });
  }
}
