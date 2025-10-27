"use client";
import { motion } from "framer-motion";
import { Copy, Save, RotateCcw } from "lucide-react";

export default function TranscriptionResult({
  text,
  onReset,
}: {
  text: string;
  onReset: () => void;
}) {
  function copyText() {
    navigator.clipboard.writeText(text);
    alert("✅ Transcription copied!");
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="mt-10 p-6 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 text-white max-w-2xl text-center shadow-lg"
    >
      <p className="text-lg leading-relaxed mb-6 whitespace-pre-wrap">{text}</p>

      <div className="flex justify-center gap-4">
        <button onClick={copyText} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg flex items-center gap-2">
          <Copy size={18} /> Copy
        </button>
        <button onClick={onReset} className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg flex items-center gap-2">
          <RotateCcw size={18} /> Retry
        </button>
        <button className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg flex items-center gap-2">
          <Save size={18} /> Save to Notes
        </button>
      </div>
    </motion.div>
  );
}
