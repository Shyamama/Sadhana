"use client";

import { useEffect, useState } from "react";
import { useDailyUsage, useTier, tierLabels } from "@/components/useTier";

const DEEP_ACTION_CAP = 1;

type Entry = {
  id: string;
  createdAt: string;
  mood?: string | null;
  content: string;
  summary?: string | null;
};

export default function JournalPage() {
  const { tier } = useTier();
  const { usage, incrementDeep } = useDailyUsage();
  const [entries, setEntries] = useState<Entry[]>([]);
  const [content, setContent] = useState("");
  const [mood, setMood] = useState("");
  const [summary, setSummary] = useState("");
  const [weeklySummary, setWeeklySummary] = useState<string | null>(null);

  const loadEntries = async () => {
    const response = await fetch("/api/journal");
    if (!response.ok) {
      console.error("Failed to load journal entries:", response.status);
      setEntries([]);
      return;
    }
    const data = await response.json();
    setEntries(data.entries ?? []);
  };

  useEffect(() => {
    void loadEntries();
  }, []);

  const submitEntry = async () => {
    if (!content.trim()) return;
    const response = await fetch("/api/journal", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        content,
        mood: mood || null,
        summary: summary || null
      })
    });
    if (!response.ok) {
      console.error("Failed to save journal entry:", response.status);
      return;
    }
    setContent("");
    setMood("");
    setSummary("");
    await loadEntries();
  };

  const generateWeeklySummary = () => {
    if (tier === "Ajna" && usage.deepActions >= DEEP_ACTION_CAP) {
      setWeeklySummary("Ajñā daily cap reached. Upgrade for weekly summaries.");
      return;
    }
    const weekEntries = entries.slice(0, 7);
    const themes = weekEntries.map((entry) => entry.summary || entry.content).join(" ");
    setWeeklySummary(
      weekEntries.length
        ? `Weekly summary (demo): ${themes.slice(0, 240)}...`
        : "Add a few entries to generate a weekly summary."
    );
    if (tier === "Ajna") {
      incrementDeep();
    }
  };

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-amber-200 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-amber-700">Journal</p>
            <h2 className="text-2xl font-semibold">Daily reflection</h2>
            <p className="mt-2 text-sm text-amber-900">Tier: {tierLabels[tier]}</p>
          </div>
          {tier === "Ajna" && (
            <p className="text-xs text-amber-700">Deep actions used today: {usage.deepActions}/1</p>
          )}
        </div>

        <div className="mt-6 grid gap-4">
          <input
            value={mood}
            onChange={(event) => setMood(event.target.value)}
            placeholder="Mood (optional)"
            className="rounded-xl border border-amber-200 px-3 py-2 text-sm"
          />
          <textarea
            value={content}
            onChange={(event) => setContent(event.target.value)}
            placeholder="Write your reflection..."
            className="h-32 rounded-xl border border-amber-200 px-3 py-2 text-sm"
          />
          <textarea
            value={summary}
            onChange={(event) => setSummary(event.target.value)}
            placeholder="Optional summary (bullet points, mantra notes, insights)"
            className="h-20 rounded-xl border border-amber-200 px-3 py-2 text-sm"
          />
          <button
            type="button"
            onClick={submitEntry}
            className="w-fit rounded-full bg-amber-700 px-6 py-2 text-sm text-white"
          >
            Save entry
          </button>
        </div>
      </section>

      <section className="rounded-3xl border border-amber-200 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h3 className="text-lg font-semibold">Weekly summary</h3>
          <button
            type="button"
            onClick={generateWeeklySummary}
            className="rounded-full border border-amber-200 px-4 py-2 text-xs"
          >
            Generate summary (deep action)
          </button>
        </div>
        {weeklySummary && <p className="mt-3 text-sm text-amber-900">{weeklySummary}</p>}
      </section>

      <section className="rounded-3xl border border-amber-200 bg-white p-6 shadow-sm">
        <h3 className="text-lg font-semibold">Recent entries</h3>
        <div className="mt-4 space-y-4">
          {entries.length === 0 && <p className="text-sm text-amber-700">No entries yet.</p>}
          {entries.map((entry) => (
            <article key={entry.id} className="rounded-2xl border border-amber-100 bg-amber-50 p-4">
              <div className="flex items-center justify-between text-xs text-amber-700">
                <span>{new Date(entry.createdAt).toLocaleString()}</span>
                {entry.mood && <span>Mood: {entry.mood}</span>}
              </div>
              <p className="mt-2 text-sm text-amber-900">{entry.content}</p>
              {entry.summary && (
                <p className="mt-2 text-xs text-amber-700">Summary: {entry.summary}</p>
              )}
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
