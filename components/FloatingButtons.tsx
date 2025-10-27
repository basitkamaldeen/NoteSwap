// components/FloatingButtons.tsx
"use client";

import { motion } from "framer-motion";
import { Mic, Bot } from "lucide-react";
import { useState } from "react";

export default function FloatingButtons() {
  const [showAI, setShowAI] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 flex flex-col items-end gap-4 z-50">
      {/* AI Assistant Floating Button */}
      <motion.button
        onClick={() => setShowAI(!showAI)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white p-4 rounded-full shadow-lg hover:shadow-2xl transition duration-300"
      >
        <Bot className="w-6 h-6" />
      </motion.button>

      {/* Record Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className="bg-gradient-to-br from-pink-600 to-rose-700 text-white p-4 rounded-full shadow-lg hover:shadow-2xl transition duration-300"
      >
        <Mic className="w-6 h-6" />
      </motion.button>

      {/* AI Assistant Panel */}
      {showAI && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.3 }}
          className="absolute bottom-20 right-0 w-[22rem] bg-white/10 backdrop-blur-xl text-white rounded-2xl p-5 border border-white/20 shadow-2xl"
        >
          <h3 className="text-lg font-semibold mb-3">AI Assistant</h3>
          <p className="text-gray-300 text-sm mb-4">
            Ask me anything about your notes or get instant summaries!
          </p>
          <input
            type="text"
            placeholder="Type your question..."
            className="w-full bg-white/5 border border-white/20 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-400 focus:outline-none"
          />
        </motion.div>
      )}
    </div>
  );
}
