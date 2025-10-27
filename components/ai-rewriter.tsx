"use client";
import { useState } from "react";

export function AIRewriter({ text }: { text: string }) {
  const [output, setOutput] = useState("");

  async function rewrite(mode: string) {
    const res = await fetch("/api/ai/rewriter", {
      method: "POST",
      body: JSON.stringify({ text, mode }),
    });
    const data = await res.json();
    setOutput(data.rewritten);
  }

  return (
    <div className="border p-4 mt-3 rounded-lg">
      <div className="flex gap-2 mb-3">
        <button
          onClick={() => rewrite("simple")}
          className="bg-blue-600 text-white px-3 py-2 rounded-lg"
        >
          Simplify ✍🏽
        </button>
        <button
          onClick={() => rewrite("professional")}
          className="bg-purple-600 text-white px-3 py-2 rounded-lg"
        >
          Rephrase 🎯
        </button>
      </div>
      {output && <p className="mt-2 text-gray-700 dark:text-gray-200">{output}</p>}
    </div>
  );
}
