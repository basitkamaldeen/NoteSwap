// components/tag-input.tsx
"use client";
import { useState } from "react";

export function TagInput({ value = "", onChange }: { value?: string; onChange: (v: string) => void }) {
  const [text, setText] = useState(value);
  function addTag(t: string) {
    const list = text.split(",").map(s => s.trim()).filter(Boolean);
    list.push(t.trim());
    const next = Array.from(new Set(list)).join(",");
    setText(next);
    onChange(next);
  }
  return (
    <div>
      <input value={text} onChange={(e)=>{setText(e.target.value); onChange(e.target.value)}} className="p-2 border rounded w-full" placeholder="tags, comma separated" />
      <div className="mt-2 flex gap-2">
        <button onClick={() => addTag("lecture")} className="px-2 py-1 bg-gray-100 rounded">#lecture</button>
        <button onClick={() => addTag("biology")} className="px-2 py-1 bg-gray-100 rounded">#biology</button>
      </div>
    </div>
  );
}
