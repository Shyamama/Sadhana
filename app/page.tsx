"use client";

import { useState } from "react";
import { useDailyUsage, useTier, tierLabels } from "@/components/useTier";

const DEEP_ACTION_CAP = 1;

const quickPrompts = [
  {
    label: "Compare traditions",
    question: "Compare how Advaita Vedanta and Bhakti traditions approach daily sādhanā.",
    deep: true,
    compare: true
  },
  {
    label: "Simple practice",
    question: "Give me a simple 10-minute morning sādhanā suitable for beginners.",
    deep: false,
    compare: false
  },
  {
    label: "Show sources",
    question: "List the sources you are drawing from today, with short summaries.",
    deep: false,
    compare: false
  }
];

export default function AskPage() {
  const { tier } = useTier();
  const { usage, incrementDeep } = useDailyUsage();
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState<string | null>(null);
  const [citations, setCitations] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [longAnswer, setLongAnswer] = useState(false);
  const [deepSynthesis, setDeepSynthesis] = useState(false);
  const [compareTraditions, setCompareTraditions] = useState(false);

  const deepActionsUsed = usage.deepActions;
  const deepCapReached = tier === "Ajna" && deepActionsUsed >= DEEP_ACTION_CAP;
  const canUseDeepModes = tier === "Jnani";

  const submitQuestion = async (payloadQuestion: string) => {
    if (!payloadQuestion.trim()) return;
    if (deepCapReached && longAnswer) {
      setAnswer("Ajñā tier daily deep-action cap reached. Upgrade to ask longer responses.");
      return;
    }
    if (!canUseDeepModes && (compareTraditions || deepSynthesis)) {
      setAnswer("Compare traditions and deep synthesis are available in Jñānī tier only.");
      return;
    }

    setLoading(true);
    setAnswer(null);
    setCitations([]);

    const response = await fetch("/api/ask", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        question: payloadQuestion,
        topK: canUseDeepModes ? 6 : 4,
        longAnswer,
        compareTraditions,
        deepSynthesis
      })
    });

    if (!response.ok) {
      console.error("Failed to ask Pandit Mode:", response.status);
      setAnswer("Unable to reach Pandit Mode right now. Check the server logs.");
      setLoading(false);
      return;
    }
    const data = await response.json();
    setAnswer(data.answer ?? data.error ?? "No response.");
    setCitations(data.citations ?? []);
    if (longAnswer && tier === "Ajna") {
      incrementDeep();
    }
    setLoading(false);
  };

  return (
    <div className="grid gap-8">
      <section className="rounded-3xl border border-amber-200 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-amber-700">Ask</p>
            <h2 className="text-2xl font-semibold">Pandit Mode chat</h2>
            <p className="mt-2 text-sm text-amber-900">
              Tier: <span className="font-semibold">{tierLabels[tier]}</span>
            </p>
          </div>
          <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-2 text-xs text-amber-900">
            {tier === "Ajna" && (
              <p>
                Deep actions used today: {deepActionsUsed}/{DEEP_ACTION_CAP} (Ajñā cap)
              </p>
            )}
            {tier !== "Ajna" && <p>Unlimited access in this tier.</p>}
          </div>
        </div>

        <div className="mt-6 space-y-4">
          <textarea
            className="h-32 w-full rounded-2xl border border-amber-200 bg-white p-4 text-sm"
            placeholder="Ask about daily practice, mantra guidance, or text references..."
            value={question}
            onChange={(event) => setQuestion(event.target.value)}
          />

          <div className="flex flex-wrap gap-3 text-xs">
            <button
              type="button"
              onClick={() => setLongAnswer((prev) => !prev)}
              className={`rounded-full border px-4 py-2 ${
                longAnswer ? "border-amber-700 bg-amber-100" : "border-amber-200"
              }`}
            >
              Longer answer {tier === "Ajna" ? "(deep action)" : ""}
            </button>
            <button
              type="button"
              onClick={() => setCompareTraditions((prev) => !prev)}
              className={`rounded-full border px-4 py-2 ${
                compareTraditions ? "border-amber-700 bg-amber-100" : "border-amber-200"
              } ${canUseDeepModes ? "" : "opacity-50"}`}
              disabled={!canUseDeepModes}
            >
              Compare traditions (Jñānī)
            </button>
            <button
              type="button"
              onClick={() => setDeepSynthesis((prev) => !prev)}
              className={`rounded-full border px-4 py-2 ${
                deepSynthesis ? "border-amber-700 bg-amber-100" : "border-amber-200"
              } ${canUseDeepModes ? "" : "opacity-50"}`}
              disabled={!canUseDeepModes}
            >
              Deep synthesis (Jñānī)
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            {quickPrompts.map((prompt) => (
              <button
                key={prompt.label}
                type="button"
                className="rounded-full border border-amber-200 px-3 py-1 text-xs hover:bg-amber-50"
                onClick={() => {
                  setQuestion(prompt.question);
                  setLongAnswer(prompt.deep);
                  setCompareTraditions(prompt.compare);
                  submitQuestion(prompt.question);
                }}
              >
                {prompt.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => submitQuestion(question)}
              className="rounded-full bg-amber-700 px-6 py-2 text-sm text-white hover:bg-amber-800"
              disabled={loading}
            >
              {loading ? "Consulting sources..." : "Ask Pandit Mode"}
            </button>
            {deepCapReached && tier === "Ajna" && (
              <p className="text-xs text-amber-700">Daily deep-action cap reached.</p>
            )}
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-amber-200 bg-white p-6 shadow-sm">
        <h3 className="text-lg font-semibold">Answer</h3>
        {!answer && <p className="mt-2 text-sm text-amber-900">Ask a question to see citations.</p>}
        {answer && (
          <div className="mt-4 whitespace-pre-wrap text-sm leading-relaxed">
            {answer}
            {citations.length > 0 && (
              <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 p-4">
                <h4 className="text-sm font-semibold">Citations</h4>
                <ul className="mt-2 space-y-2 text-xs">
                  {citations.map((citation) => (
                    <li key={citation.id}>
                      <p className="font-semibold">
                        {citation.sourceTitle} · Chunk {citation.order + 1}
                      </p>
                      <p className="text-amber-900">{citation.excerpt}</p>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  );
}
