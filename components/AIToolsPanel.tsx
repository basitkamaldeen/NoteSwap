"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, MessageSquare, RefreshCcw, BrainCircuit, Loader2 } from "lucide-react";
import AIVoiceReply from "@/components/AIVoiceReply";

export default function AIToolsPanel({ selectedNote }: { selectedNote: string }) {
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState("");
  const [mode, setMode] = useState("");

  async function handleAction(action: string, endpoint: string, body: any) {
    setMode(action);
    setLoading(true);
    setOutput("");

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      setLoading(false);

      if (data.error) setOutput("⚠️ " + data.error);
      else setOutput(data.summary || data.rewritten || data.quiz || data.answer || "No response.");
    } catch (err) {
      setLoading(false);
      setOutput("❌ Network or server error. Please try again.");
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/10 backdrop-blur-lg p-6 rounded-2xl shadow-xl mt-8 text-white relative"
    >
      <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
        <BrainCircuit className="w-6 h-6 text-blue-400" /> AI Study Assistant
      </h2>

      <div className="flex flex-wrap gap-3 mb-6">
        <button
          onClick={() => handleAction("summarize", "/api/ai/summarize", { content: selectedNote })}
          className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <Sparkles size={18} /> Summarize
        </button>

        <button
          onClick={() => handleAction("rewrite", "/api/ai/rewriter", { text: selectedNote, tone: "simpler" })}
          className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <RefreshCcw size={18} /> Rewrite
        </button>

        <button
          onClick={() => handleAction("quiz", "/api/ai/quiz", { content: selectedNote })}
          className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <MessageSquare size={18} /> Quiz
        </button>

        <button
          onClick={() => handleAction("chat", "/api/ai/rag", { question: selectedNote })}
          className="bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <BrainCircuit size={18} /> Chat with Notes
        </button>
      </div>

      {loading ? (
        <div className="flex items-center gap-2 text-gray-300">
          <Loader2 className="animate-spin" /> Processing {mode}...
        </div>
      ) : (
        output && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white/5 p-4 rounded-lg border border-white/10 text-sm leading-relaxed"
          >
            {output}
          </motion.div>
        )
      )}

      {/* 👇 Place the voice button INSIDE the main container (no syntax error) */}
      {output && <AIVoiceReply text={output} />}
    </motion.div>
  );
}
