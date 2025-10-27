"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { PlusCircle, Loader2, Search, Mic, BrainCircuit } from "lucide-react";
import NoteCard from "@/components/NoteCard";
import NoteEditorModal from "@/components/NoteEditorModal";
import AIToolsPanel from "@/components/AIToolsPanel";

interface Note {
  id: string;
  title: string;
  content: string;
  tags?: string;
  createdAt: string;
}

export default function DashboardPage() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [openEditor, setOpenEditor] = useState(false);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [showAI, setShowAI] = useState(false);

  // Fetch user notes
  useEffect(() => {
    async function fetchNotes() {
      try {
        const res = await fetch("/api/notes");
        if (!res.ok) throw new Error("Failed to load notes");
        const data = await res.json();
        setNotes(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching notes:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchNotes();
  }, []);

  // Create new note
  async function handleAddNote() {
    try {
      const res = await fetch("/api/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: "Untitled Note", content: "" }),
      });
      const newNote = await res.json();
      setNotes([newNote, ...notes]);
    } catch (error) {
      console.error("Error creating note:", error);
    }
  }

  // Delete note
  async function handleDelete(id: string) {
    try {
      await fetch(`/api/notes/${id}`, { method: "DELETE" });
      setNotes(notes.filter((n) => n.id !== id));
    } catch (error) {
      console.error("Error deleting note:", error);
    }
  }

  const filtered = notes.filter(
    (n) =>
      n.title.toLowerCase().includes(search.toLowerCase()) ||
      n.content.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="max-w-7xl mx-auto px-4 sm:px-6 pt-28 pb-20"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-10">
        <h1 className="text-3xl font-bold text-center sm:text-left">Your Notes</h1>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search notes..."
              className="w-full bg-white/10 border border-white/20 text-white placeholder-gray-400 pl-10 pr-4 py-2 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <button
            onClick={handleAddNote}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-xl font-medium transition"
          >
            <PlusCircle size={18} /> Add Note
          </button>
        </div>
      </div>

      {/* Notes List */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-blue-400" />
        </div>
      ) : filtered.length > 0 ? (
        <motion.div
          layout
          className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
        >
          {filtered.map((note) => (
            <NoteCard
              key={note.id}
              note={note}
              onDelete={handleDelete}
              onSelect={() => setSelectedNote(note)}
            />
          ))}
        </motion.div>
      ) : (
        <p className="text-center text-gray-400 mt-10">No notes found. Try adding one!</p>
      )}

      {/* Note Editor */}
      {openEditor && (
        <NoteEditorModal onClose={() => setOpenEditor(false)} />
      )}

      {/* AI Assistant Panel */}
      {showAI && selectedNote && (
        <AIToolsPanel selectedNote={selectedNote.content} />
      )}

      {/* Floating Buttons */}
      <div className="fixed bottom-8 right-8 flex flex-col gap-3 z-50">
        {/* Microphone Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-blue-600 hover:bg-blue-700 text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg shadow-blue-500/30"
          onClick={() => alert('Voice recording feature coming soon!')}
        >
          <Mic size={24} />
        </motion.button>

        {/* AI Assistant Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg shadow-indigo-500/30"
          onClick={() => setShowAI(!showAI)}
        >
          <BrainCircuit size={24} />
        </motion.button>
      </div>
    </motion.div>
  );
}
