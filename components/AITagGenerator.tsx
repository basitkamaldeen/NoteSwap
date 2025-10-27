"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Tag, Loader2 } from "lucide-react";

export default function AITagGenerator({ content }: { content: string }) {
  const [tags, setTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  async function generateTags() {
    setLoading(true);
    const res = await fetch("/api/ai/tags", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: content }),
    });
    const data = await res.json();
    setTags(data.tags || []);
    setLoading(false);
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white/10 p-4 rounded-xl mt-6 text-white"
    >
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold flex items-center gap-2"><Tag /> Smart Tag Generator</h3>
        <button
          onClick={generateTags}
          className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded-md text-sm"
        >
          {loading ? <Loader2 className="animate-spin" size={16} /> : "Generate"}
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {tags.map((t) => (
          <span key={t} className="bg-white/20 px-3 py-1 rounded-full text-sm">{t}</span>
        ))}
      </div>
    </motion.div>
  );
}
