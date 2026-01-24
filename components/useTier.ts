"use client";

import { useEffect, useState } from "react";

export type Tier = "Ajna" | "Jijnasu" | "Jnani";

const STORAGE_KEY = "sadhana-tier";

export const tierLabels: Record<Tier, string> = {
  Ajna: "Ajñā",
  Jijnasu: "Jijñāsu",
  Jnani: "Jñānī"
};

export const tierDescriptions: Record<Tier, string> = {
  Ajna: "Limited access, daily deep-action cap.",
  Jijnasu: "Unlimited personalized answers and practices.",
  Jnani: "All access, latest models, deep synthesis, expert features."
};

export const useTier = () => {
  const [tier, setTier] = useState<Tier>("Ajna");

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY) as Tier | null;
    if (stored) {
      setTier(stored);
    }
  }, []);

  const updateTier = (next: Tier) => {
    setTier(next);
    window.localStorage.setItem(STORAGE_KEY, next);
  };

  return { tier, updateTier };
};

const USAGE_KEY = "sadhana-usage";

export type UsageRecord = {
  date: string;
  deepActions: number;
};

export const useDailyUsage = () => {
  const [usage, setUsage] = useState<UsageRecord>({ date: todayKey(), deepActions: 0 });

  useEffect(() => {
    const stored = window.localStorage.getItem(USAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored) as UsageRecord;
      if (parsed.date === todayKey()) {
        setUsage(parsed);
      }
    }
  }, []);

  const incrementDeep = () => {
    setUsage((prev) => {
      const updated = { date: todayKey(), deepActions: prev.deepActions + 1 };
      window.localStorage.setItem(USAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  return { usage, incrementDeep };
};

const todayKey = () => new Date().toISOString().slice(0, 10);
