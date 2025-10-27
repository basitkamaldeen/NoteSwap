"use client";

import { useState, useEffect } from "react";
import { z } from "zod";
import { SpeechRecorder } from "./speech-recorder";


const noteSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().optional(),
  tags: z.string().optional(),
});

export function NoteEditor({
  note,
  onClose,
  onNoteCreated,
}: {
  note?: any;
  onClose: () => void;
  onNoteCreated: () => void;
}) {
  const [title, setTitle] = useState(note?.title || "");
  const [content, setContent] = useState(note?.content || "");
  const [tags, setTags] = useState(note?.tags || "");
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    try {
      const payload = noteSchema.parse({ title, content, tags });
      setSaving(true);

      const res = await fetch(note ? `/api/notes/${note.id}` : "/api/notes", {
        method: note ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Save failed");
      onNoteCreated();
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  }

  // Auto-save every 3 s
  useEffect(() => {
    const t = setTimeout(handleSave, 3000);
    return () => clearTimeout(t);
  }, [title, content, tags]);

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg w-full max-w-2xl shadow-lg">
        <h2 className="text-xl font-semibold mb-4">
          {note ? "Edit Note" : "New Note"}
        </h2>
        <input
          className="w-full p-2 border rounded mb-2 dark:bg-gray-700"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
		<SpeechRecorder onTranscribed={(text) => setContent((prev) => prev + " " + text)} />

        <textarea
          className="w-full p-2 border rounded mb-2 h-40 dark:bg-gray-700"
          placeholder="Write something..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <input
          className="w-full p-2 border rounded mb-4 dark:bg-gray-700"
          placeholder="Tags (comma separated)"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
        />

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}
