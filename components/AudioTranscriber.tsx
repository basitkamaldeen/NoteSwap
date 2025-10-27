"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Loader2, FileText, Wand2 } from "lucide-react";

export default function AudioTranscriber({ audioId }: { audioId: string }) {
  const [loading, setLoading] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [summary, setSummary] = useState("");

  const handleTranscribe = async () => {
    setLoading(true);
    const res = await fetch(`/api/audio/transcribe?id=${audioId}`, { method: "POST" });
    const data = await res.json();
    setTranscript(data.text || "No transcript found.");
    setLoading(false);
  };

  const handleSummarize = async () => {
    setLoading(true);
    const res = await fetch("/api/ai/summarize", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: transcript }),
    });
    const data = await res.json();
    setSummary(data.summary || "No summary generated.");
    setLoading(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/10 backdrop-blur-lg p-6 rounded-2xl shadow-xl text-white"
    >
      <h2 className="text-2xl font-semibold mb-4">🧠 Transcription & AI Tools</h2>

      <div className="flex gap-4 mb-4">
        <button
          onClick={handleTranscribe}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-lg flex items-center gap-2"
        >
          {loading ? <Loader2 className="animate-spin" /> : <FileText size={18} />} Transcribe
        </button>

        <button
          onClick={handleSummarize}
          disabled={loading || !transcript}
          className="bg-purple-600 hover:bg-purple-700 px-6 py-2 rounded-lg flex items-center gap-2"
        >
          {loading ? <Loader2 className="animate-spin" /> : <Wand2 size={18} />} Summarize
        </button>
      </div>

      {transcript && (
        <div className="bg-white/5 p-4 rounded-lg mb-4 border border-white/10">
          <h3 className="text-lg font-semibold mb-2">Transcript:</h3>
          <p className="text-gray-200 text-sm whitespace-pre-wrap">{transcript}</p>
        </div>
      )}

      {summary && (
        <div className="bg-white/5 p-4 rounded-lg border border-white/10">
          <h3 className="text-lg font-semibold mb-2">Summary:</h3>
          <p className="text-gray-200 text-sm whitespace-pre-wrap">{summary}</p>
        </div>
      )}
    </motion.div>
  );
}
