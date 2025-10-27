"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, MessageSquare, RefreshCcw, Loader2, BrainCircuit } from "lucide-react";

export default function AIAssistantPage() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleAction(type: string) {
    if (!input.trim()) return alert("Please enter your note or question!");
    setLoading(true);
    setOutput("");

    const res = await fetch(`/api/ai/${type}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: input }),
    });
    const data = await res.json();

    setOutput(data.summary || data.rewritten || data.quiz || data.answer || "No response.");
    setLoading(false);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="max-w-5xl mx-auto px-6 pt-28 pb-20 text-white"
    >
      <h1 className="text-3xl font-bold mb-8 flex items-center gap-3">
        <BrainCircuit className="w-7 h-7 text-blue-400" /> AI Study Assistant
      </h1>

      <div className="bg-white/10 p-8 rounded-3xl backdrop-blur-lg space-y-6">
        <textarea
          placeholder="Paste your note or question here..."
          className="w-full bg-white/5 border border-white/20 rounded-xl p-4 text-white min-h-[150px] outline-none placeholder-gray-400 focus:ring-2 focus:ring-blue-500"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />

        <div className="flex flex-wrap gap-3 justify-center">
          <button
            onClick={() => handleAction("summarize")}
            className="bg-blue-600 hover:bg-blue-700 px-5 py-2.5 rounded-xl flex items-center gap-2"
          >
            <Sparkles size={18} /> Summarize
          </button>

          <button
            onClick={() => handleAction("rewriter")}
            className="bg-green-600 hover:bg-green-700 px-5 py-2.5 rounded-xl flex items-center gap-2"
          >
            <RefreshCcw size={18} /> Rewrite
          </button>

          <button
            onClick={() => handleAction("quiz")}
            className="bg-purple-600 hover:bg-purple-700 px-5 py-2.5 rounded-xl flex items-center gap-2"
          >
            <MessageSquare size={18} /> Quiz
          </button>
        </div>

        {loading && (
          <div className="flex justify-center gap-2 text-gray-300">
            <Loader2 className="animate-spin" /> Generating...
          </div>
        )}

        {output && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white/5 border border-white/10 rounded-xl p-4 text-sm leading-relaxed whitespace-pre-line"
          >
            {output}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
