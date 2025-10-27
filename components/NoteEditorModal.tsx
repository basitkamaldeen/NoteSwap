"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { XCircle, Save } from "lucide-react";

export default function NoteEditorModal({
  onClose,
  onNoteCreated,
}: {
  onClose: () => void;
  onNoteCreated: () => void;
}) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    setSaving(true);
    await fetch("/api/notes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, content }),
    });
    setSaving(false);
    onNoteCreated();
    onClose();
  }

  return (
    <motion.div
      className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-md z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="bg-gradient-to-br from-blue-900/80 to-indigo-900/80 backdrop-blur-xl p-8 rounded-2xl shadow-2xl border border-white/10 w-[90%] max-w-2xl"
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-white">Create a New Note</h2>
          <button onClick={onClose}>
            <XCircle size={28} className="text-gray-300 hover:text-red-400 transition" />
          </button>
        </div>

        <input
          type="text"
          placeholder="Note Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full bg-white/10 border border-white/20 text-white rounded-xl px-4 py-3 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <textarea
          placeholder="Write your note here..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={8}
          className="w-full bg-white/10 border border-white/20 text-white rounded-xl px-4 py-3 mb-6 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
        ></textarea>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-gray-600 hover:bg-gray-700 text-white"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold flex items-center gap-2 shadow-md shadow-blue-700/30"
          >
            <Save size={18} /> {saving ? "Saving..." : "Save Note"}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
