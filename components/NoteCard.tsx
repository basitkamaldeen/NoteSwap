"use client";

import { motion } from "framer-motion";
import { Trash2 } from "lucide-react";

export default function NoteCard({
  note,
  onDelete,
}: {
  note: any;
  onDelete: (id: string) => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.03 }}
      transition={{ duration: 0.4 }}
      className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-md hover:shadow-blue-500/30 transition-all"
    >
      <h2 className="text-xl font-semibold text-white mb-2">
        {note.title || "Untitled Note"}
      </h2>

      <p className="text-gray-300 text-sm line-clamp-4 mb-4">
        {note.content || "No content yet."}
      </p>

      <div className="flex justify-between items-center text-xs text-gray-400">
        <span>{new Date(note.createdAt).toLocaleDateString()}</span>

        <button
          onClick={() => onDelete(note.id)}
          className="text-red-400 hover:text-red-500 transition"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </motion.div>
  );
}
