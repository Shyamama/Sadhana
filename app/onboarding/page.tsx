"use client";

import { useTier, tierDescriptions, tierLabels, Tier } from "@/components/useTier";

const tiers: Array<{
  id: Tier;
  price: string;
  yearly: string;
  cost: string;
  perks: string[];
}> = [
  {
    id: "Ajna",
    price: "Free",
    yearly: "",
    cost: "$0.85/mo",
    perks: ["Limited access", "Daily deep-action cap", "Core sources"]
  },
  {
    id: "Jijnasu",
    price: "$6.99/mo",
    yearly: "$69.99/yr",
    cost: "$1.65/mo",
    perks: ["Unlimited access", "Personalized answers", "Adaptive practices"]
  },
  {
    id: "Jnani",
    price: "$11.99/mo",
    yearly: "$119.99/yr",
    cost: "$4.25/mo",
    perks: ["Latest models", "Larger corpus", "Expert & community features"]
  }
];

export default function OnboardingPage() {
  const { tier, updateTier } = useTier();

  return (
    <div className="space-y-8">
      <section className="rounded-3xl border border-amber-200 bg-white p-6 shadow-sm">
        <p className="text-sm uppercase tracking-[0.2em] text-amber-700">Onboarding</p>
        <h2 className="text-2xl font-semibold">Pick your demo tier</h2>
        <p className="mt-2 text-sm text-amber-900">
          Select a tier to simulate gating and features. Current tier: {tierLabels[tier]}.
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {tiers.map((plan) => (
          <div key={plan.id} className="rounded-3xl border border-amber-200 bg-white p-6 shadow-sm">
            <h3 className="text-xl font-semibold">{tierLabels[plan.id]}</h3>
            <p className="mt-1 text-sm text-amber-700">{plan.price}</p>
            {plan.yearly && <p className="text-xs text-amber-700">{plan.yearly}</p>}
            <p className="mt-2 text-xs text-amber-900">Est. cost: {plan.cost}</p>
            <p className="mt-3 text-xs text-amber-700">{tierDescriptions[plan.id]}</p>
            <ul className="mt-3 space-y-1 text-xs text-amber-900">
              {plan.perks.map((perk) => (
                <li key={perk}>• {perk}</li>
              ))}
            </ul>
            <button
              type="button"
              onClick={() => updateTier(plan.id)}
              className={`mt-4 w-full rounded-full border px-4 py-2 text-sm ${
                tier === plan.id
                  ? "border-amber-700 bg-amber-700 text-white"
                  : "border-amber-200 hover:bg-amber-50"
              }`}
            >
              {tier === plan.id ? "Selected" : "Choose tier"}
            </button>
          </div>
        ))}
      </section>
    </div>
  );
}
