"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Share2, X } from "lucide-react";

export default function ShareNoteModal({ noteId, onClose }: { noteId: string; onClose: () => void }) {
  const [email, setEmail] = useState("");
  const [copied, setCopied] = useState(false);
  const shareLink = `${window.location.origin}/share/${noteId}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-md z-50"
    >
      <div className="bg-white/10 p-6 rounded-2xl w-96 text-white relative shadow-2xl border border-white/20">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-300 hover:text-white">
          <X size={20} />
        </button>
        <h2 className="text-xl font-semibold mb-3 flex items-center gap-2"><Share2 /> Share Note</h2>
        <p className="text-sm text-gray-300 mb-4">Send or copy the link to share this note.</p>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Recipient email (optional)"
          className="w-full bg-white/10 p-2 rounded-md outline-none text-white"
        />
        <div className="mt-4 flex flex-col gap-2">
          <button
            onClick={handleCopy}
            className="bg-blue-600 hover:bg-blue-700 py-2 rounded-md font-medium"
          >
            {copied ? "✅ Link Copied!" : "Copy Share Link"}
          </button>
          <p className="text-xs text-gray-400 break-all">{shareLink}</p>
        </div>
      </div>
    </motion.div>
  );
}
