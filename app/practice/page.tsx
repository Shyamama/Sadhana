"use client";

import { useMemo, useState } from "react";
import { useDailyUsage, useTier, tierLabels } from "@/components/useTier";

const DEEP_ACTION_CAP = 1;

const focusOptions = ["Breath", "Mantra", "Scripture", "Service", "Silence"] as const;

type Focus = (typeof focusOptions)[number];

type Plan = {
  morning: string;
  midday: string;
  evening: string;
  reflection: string;
};

export default function PracticePage() {
  const { tier } = useTier();
  const { usage, incrementDeep } = useDailyUsage();
  const [focus, setFocus] = useState<Focus>("Breath");
  const [minutes, setMinutes] = useState(20);
  const [energy, setEnergy] = useState(3);
  const [planRequested, setPlanRequested] = useState(false);

  const plan = useMemo<Plan>(() => {
    const intensity = energy <= 2 ? "gentle" : energy >= 4 ? "energetic" : "balanced";
    return {
      morning: `${Math.round(minutes * 0.5)} min ${focus.toLowerCase()} practice (${intensity}).`,
      midday: `${Math.round(minutes * 0.2)} min reset: mindful breath + gratitude.`,
      evening: `${Math.round(minutes * 0.3)} min ${focus.toLowerCase()} reflection + silence.`,
      reflection: "Close with 2 lines of gratitude or a short journal note."
    };
  }, [focus, minutes, energy]);

  const handleGenerate = () => {
    if (tier === "Ajna" && usage.deepActions >= DEEP_ACTION_CAP) {
      setPlanRequested(true);
      return;
    }
    setPlanRequested(true);
    if (tier === "Ajna") {
      incrementDeep();
    }
  };

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-amber-200 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-amber-700">Practice</p>
            <h2 className="text-2xl font-semibold">Adaptive daily sādhanā plan</h2>
            <p className="mt-2 text-sm text-amber-900">Tier: {tierLabels[tier]}</p>
          </div>
          {tier === "Ajna" && (
            <p className="text-xs text-amber-700">Deep actions used today: {usage.deepActions}/1</p>
          )}
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <label className="flex flex-col gap-2 text-sm">
            Focus
            <select
              value={focus}
              onChange={(event) => setFocus(event.target.value as Focus)}
              className="rounded-xl border border-amber-200 px-3 py-2"
            >
              {focusOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-2 text-sm">
            Minutes available
            <input
              type="number"
              min={10}
              max={90}
              value={minutes}
              onChange={(event) => setMinutes(Number(event.target.value))}
              className="rounded-xl border border-amber-200 px-3 py-2"
            />
          </label>
          <label className="flex flex-col gap-2 text-sm">
            Energy level (1-5)
            <input
              type="range"
              min={1}
              max={5}
              value={energy}
              onChange={(event) => setEnergy(Number(event.target.value))}
            />
          </label>
        </div>

        <button
          type="button"
          onClick={handleGenerate}
          className="mt-4 rounded-full bg-amber-700 px-6 py-2 text-sm text-white"
        >
          Generate today’s plan
        </button>
      </section>

      {planRequested && (
        <section className="rounded-3xl border border-amber-200 bg-white p-6 shadow-sm">
          {tier === "Ajna" && usage.deepActions >= DEEP_ACTION_CAP ? (
            <p className="text-sm text-amber-700">Ajñā daily cap reached. Upgrade for more plans.</p>
          ) : (
            <div className="space-y-3 text-sm">
              <p>Morning: {plan.morning}</p>
              <p>Midday: {plan.midday}</p>
              <p>Evening: {plan.evening}</p>
              <p>Reflection: {plan.reflection}</p>
            </div>
          )}
        </section>
      )}
    </div>
  );
}
