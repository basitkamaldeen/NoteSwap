// components/title-suggester.tsx
"use client";
import { useState } from "react";

export function TitleSuggester({ content, onPick }: { content: string; onPick: (t: string) => void }) {
  const [titles, setTitles] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  async function suggest() {
    setLoading(true);
    const res = await fetch("/api/ai/title", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content }),
    });
    const data = await res.json();
    setTitles(data.titles || []);
    setLoading(false);
  }

  return (
    <div className="mt-3">
      <button onClick={suggest} className="px-3 py-2 bg-indigo-600 text-white rounded">
        {loading ? "..." : "Suggest Titles"}
      </button>
      <div className="mt-2 flex gap-2 flex-wrap">
        {titles.map((t, i) => (
          <button key={i} onClick={() => onPick(t)} className="px-2 py-1 bg-gray-100 rounded">
            {t}
          </button>
        ))}
      </div>
    </div>
  );
}
