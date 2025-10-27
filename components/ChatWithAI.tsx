"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Send, Loader2 } from "lucide-react";

export default function ChatWithAI({ transcript }: { transcript: string }) {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [chat, setChat] = useState<{ role: string; content: string }[]>([]);

  async function sendMessage() {
    if (!input.trim()) return;
    const newMessage = { role: "user", content: input };
    setChat([...chat, newMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/ai/rag", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: input,
          context: transcript,
        }),
      });

      const data = await res.json();
      const reply = data.answer || data.error || "AI did not respond.";
      setChat((prev) => [...prev, { role: "assistant", content: reply }]);
    } catch (error) {
      console.error(error);
      setChat((prev) => [...prev, { role: "assistant", content: "Error connecting to AI." }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/5 p-4 rounded-xl border border-white/10"
    >
      <div className="h-60 overflow-y-auto space-y-3 mb-4">
        {chat.map((msg, idx) => (
          <div
            key={idx}
            className={`p-3 rounded-lg ${
              msg.role === "user" ? "bg-blue-600/40 text-right" : "bg-gray-700/30 text-left"
            }`}
          >
            {msg.content}
          </div>
        ))}
      </div>

      <div className="flex items-center gap-2">
        <input
          type="text"
          placeholder="Ask AI about this audio..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 bg-transparent border border-white/20 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400"
        />
        <button
          onClick={sendMessage}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg flex items-center justify-center"
        >
          {loading ? <Loader2 className="animate-spin" size={18} /> : <Send size={18} />}
        </button>
      </div>
    </motion.div>
  );
}
