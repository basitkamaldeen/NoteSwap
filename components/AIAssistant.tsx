"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Loader2,
  Brain,
  Sparkles,
  Bot,
  Lightbulb,
} from "lucide-react";

export default function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<{ sender: string; text: string }[]>(
    []
  );
  const [loading, setLoading] = useState(false);
  const [context, setContext] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);

  // 🧠 Automatically extract visible text (from notes, transcript, etc.)
  useEffect(() => {
    if (!isOpen) return;

    const pageText =
      document.querySelector(".note-content")?.textContent ||
      document.querySelector(".transcript-text")?.textContent ||
      document.body.textContent?.slice(0, 5000) || "";

    setContext(pageText);

    if (pageText.length > 50) {
      setSuggestions([
        "Summarize this content",
        "Explain it in simpler terms",
        "Create 5 quiz questions based on this",
        "Generate a study outline",
      ]);
    } else {
      setSuggestions([
        "What’s the best way to study efficiently?",
        "How do I remember key concepts?",
      ]);
    }
  }, [isOpen]);

  async function handleSend(customInput?: string) {
    const question = customInput || input.trim();
    if (!question) return;

    setMessages((prev) => [...prev, { sender: "user", text: question }]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/ai/rag", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question, context }),
      });
      const data = await res.json();
      setLoading(false);

      setMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          text:
            data.answer ||
            data.text ||
            data.result ||
            data.error ||
            "🤔 I couldn’t understand that.",
        },
      ]);
    } catch (err) {
      setLoading(false);
      setMessages((prev) => [
        ...prev,
        { sender: "ai", text: "⚠️ Failed to connect to AI assistant." },
      ]);
    }
  }

  return (
    <>
      {/* Floating Button */}
      <motion.button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-full shadow-xl p-4 hover:scale-110 transition-transform"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Sparkles className="w-6 h-6" />
      </motion.button>

      {/* AI Assistant Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            className="fixed bottom-24 right-6 z-50 w-96 max-w-[95vw] bg-slate-900/90 backdrop-blur-lg border border-white/10 text-white rounded-2xl shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="flex justify-between items-center p-4 border-b border-white/10 bg-gradient-to-r from-blue-700 to-indigo-800 rounded-t-2xl">
              <div className="flex items-center gap-2">
                <Bot className="w-5 h-5 text-blue-300" />
                <h2 className="font-semibold text-lg">AI Study Assistant</h2>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="hover:text-red-400 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Suggestions */}
            {suggestions.length > 0 && (
              <div className="px-4 py-3 border-b border-white/10 bg-slate-800/60 text-sm text-gray-300 flex flex-wrap gap-2">
                {suggestions.map((s, i) => (
                  <button
                    key={i}
                    onClick={() => handleSend(s)}
                    className="bg-white/10 hover:bg-blue-600/40 px-3 py-1 rounded-full transition-colors"
                  >
                    <Lightbulb className="inline-block w-4 h-4 mr-1 text-yellow-400" />
                    {s}
                  </button>
                ))}
              </div>
            )}

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 max-h-[350px] scrollbar-thin scrollbar-thumb-slate-700">
              {messages.length === 0 && (
                <p className="text-sm text-gray-400 text-center mt-8">
                  Ask me anything about your notes or transcriptions 🎧📘
                </p>
              )}
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-3 rounded-xl max-w-[85%] ${
                    msg.sender === "user"
                      ? "ml-auto bg-blue-600"
                      : "mr-auto bg-white/10 border border-white/10"
                  }`}
                >
                  {msg.text}
                </motion.div>
              ))}
              {loading && (
                <div className="flex items-center gap-2 text-gray-400 text-sm">
                  <Loader2 className="animate-spin w-4 h-4" /> Thinking...
                </div>
              )}
            </div>

            {/* Input Area */}
            <div className="border-t border-white/10 flex p-3 items-center gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                className="flex-1 bg-transparent text-white placeholder-gray-400 focus:outline-none px-3"
                placeholder="Ask a question..."
              />
              <button
                onClick={() => handleSend()}
                disabled={loading}
                className="p-2 bg-blue-600 hover:bg-blue-700 rounded-full"
              >
                <Brain className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
