"use client";

import { useState } from "react";
import { Save, Loader2 } from "lucide-react";

interface NoteEditorProps {
  noteId?: string;
  initialContent?: string;
  onSave?: (content: string) => Promise<void> | void;
}

export default function NoteEditor({
  noteId,
  initialContent = "",
  onSave,
}: NoteEditorProps) {
  const [content, setContent] = useState(initialContent);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!content.trim()) return;
    setSaving(true);
    try {
      if (onSave) {
        await onSave(content);
      } else {
        // Default save endpoint
        await fetch("/api/notes", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ noteId, content }),
        });
      }
    } catch (err) {
      console.error("Failed to save note:", err);
      alert("❌ Failed to save note. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="w-full flex flex-col gap-3 p-4 bg-slate-900/50 backdrop-blur-md border border-slate-700 rounded-2xl">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Start typing your note here..."
        className="w-full min-h-[250px] p-3 bg-slate-800 text-white rounded-xl border border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <button
        onClick={handleSave}
        disabled={saving}
        className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-all disabled:opacity-60"
      >
        {saving ? <Loader2 className="animate-spin w-5 h-5" /> : <Save className="w-5 h-5" />}
        {saving ? "Saving..." : "Save Note"}
      </button>
    </div>
  );
}
