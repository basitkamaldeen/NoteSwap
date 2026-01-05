'use client';

import React from 'react';
import NoteCardFavorite_v2 from './FavoriteButton_v2';

type Note = {
  id: number;
  title: string;
  content?: string | null;
  tags?: string[];
  favoriteCount?: number;
};

export default function NoteCard_v2({ note }: { note: Note }) {
  return (
    <article className="p-4 rounded border bg-white dark:bg-slate-800 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold">{note.title}</h3>
          <div className="text-sm text-slate-500 mt-1">
            {note.content ? note.content.slice(0, 200) + (note.content.length > 200 ? '…' : '') : 'No content'}
          </div>
        </div>
        <div className="flex flex-col items-end gap-2">
          <NoteCardFavorite_v2 noteId={note.id} initial={Boolean(note.favoriteCount && note.favoriteCount > 0)} />
          <a className="text-xs text-blue-600" href={`/notes/${note.id}`}>
            View
          </a>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        {(note.tags || []).map((t) => (
          <span key={t} className="text-xs px-2 py-1 bg-slate-100 dark:bg-slate-700 rounded">
            {t}
          </span>
        ))}
      </div>
    </article>
  );
}
