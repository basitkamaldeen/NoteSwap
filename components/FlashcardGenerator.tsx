"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { FileText, Loader2, Sparkles } from "lucide-react";

export default function FlashcardGenerator({ noteContent }: { noteContent: string }) {
  const [loading, setLoading] = useState(false);
  const [cards, setCards] = useState<string[]>([]);

  async function generateCards() {
    setLoading(true);
    const res = await fetch("/api/ai/flashcards", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: noteContent }),
    });
    const data = await res.json();
    setCards(data.cards || []);
    setLoading(false);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/10 backdrop-blur-lg p-6 rounded-2xl shadow-lg text-white mt-6"
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <FileText className="w-5 h-5 text-yellow-400" /> AI Flashcards
        </h2>
        <button
          onClick={generateCards}
          className="bg-yellow-500 hover:bg-yellow-600 px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <Sparkles size={18} /> Generate
        </button>
      </div>

      {loading && (
        <div className="flex items-center gap-2 text-gray-300">
          <Loader2 className="animate-spin" /> Creating flashcards...
        </div>
      )}

      {!loading && cards.length > 0 && (
        <div className="grid gap-3 sm:grid-cols-2">
          {cards.map((card, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.05 }}
              className="bg-white/5 p-4 rounded-lg border border-white/10"
            >
              {card}
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
