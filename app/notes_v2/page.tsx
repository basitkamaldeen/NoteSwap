'use client';

import React, { useEffect, useState } from 'react';
import NoteCard_v2 from '../../components/NoteCard_v2';

type Note = {
  id: number;
  title: string;
  content?: string | null;
  tags?: string[];
  favoriteCount?: number;
};

export default function NotesV2Page() {
  const [notes, setNotes] = useState<Note[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/notes_v2')
      .then((r) => r.json())
      .then((data) => setNotes(data))
      .catch(() => setNotes([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="p-4 min-h-screen bg-gray-50 dark:bg-slate-900">
      <header className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Notes (v2)</h1>
        <a className="px-3 py-1 bg-indigo-600 text-white rounded" href="/notes_v2/create">New Note</a>
      </header>

      {loading && <div>Loading notes…</div>}

      {!loading && notes && notes.length === 0 && <div>No notes yet. Create one.</div>}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {notes && notes.map((n) => <NoteCard_v2 key={n.id} note={n} />)}
      </div>
    </main>
  );
}
