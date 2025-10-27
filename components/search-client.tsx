// components/search-client.tsx
"use client";
import { useState } from "react";

export function SearchClient({ onResults }: { onResults: (r: any[]) => void }) {
  const [q, setQ] = useState("");
  async function run() {
    const res = await fetch("/api/notes/search", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ q }),
    });
    const data = await res.json();
    onResults(data);
  }
  return (
    <div className="flex gap-2">
      <input value={q} onChange={(e)=>setQ(e.target.value)} placeholder="Search notes" className="p-2 border rounded" />
      <button onClick={run} className="px-3 py-2 bg-blue-600 text-white rounded">Search</button>
    </div>
  );
}
