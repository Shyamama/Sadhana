"use client";

import { useEffect, useState } from "react";

type Source = {
  id: string;
  title: string;
  slug: string;
  ingestedAt: string;
  chunkCount: number;
};

export default function SourcesPage() {
  const [sources, setSources] = useState<Source[]>([]);

  useEffect(() => {
    const loadSources = async () => {
      const response = await fetch("/api/sources");
      const data = await response.json();
      setSources(data.sources ?? []);
    };
    void loadSources();
  }, []);

  const totalChunks = sources.reduce((sum, source) => sum + source.chunkCount, 0);

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-amber-200 bg-white p-6 shadow-sm">
        <p className="text-sm uppercase tracking-[0.2em] text-amber-700">Sources</p>
        <h2 className="text-2xl font-semibold">Catalog & ingestion health</h2>
        <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm">
          <p>Total sources: {sources.length}</p>
          <p>Total chunks: {totalChunks}</p>
          <p>
            Ingestion status:{" "}
            {sources.length > 0 ? "Healthy" : "No sources ingested yet"}
          </p>
        </div>
      </section>

      <section className="rounded-3xl border border-amber-200 bg-white p-6 shadow-sm">
        <h3 className="text-lg font-semibold">Source catalog</h3>
        <div className="mt-4 space-y-3">
          {sources.length === 0 && (
            <p className="text-sm text-amber-700">Run npm run ingest to load sources.</p>
          )}
          {sources.map((source) => (
            <div key={source.id} className="rounded-2xl border border-amber-100 bg-amber-50 p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="text-sm font-semibold">{source.title}</p>
                  <p className="text-xs text-amber-700">{source.slug}</p>
                </div>
                <div className="text-xs text-amber-700">
                  <p>{source.chunkCount} chunks</p>
                  <p>Ingested {new Date(source.ingestedAt).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
