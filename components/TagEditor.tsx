'use client';

import React, { useEffect, useState } from 'react';

type Props = {
  noteId?: number;
  initialTags?: string[];
  onChange?: (tags: string[]) => void;
};

export default function TagEditor({ noteId, initialTags = [], onChange }: Props) {
  const [tags, setTags] = useState<string[]>(initialTags);
  const [input, setInput] = useState('');
  const [allTags, setAllTags] = useState<string[]>([]);

  useEffect(() => {
    fetch('/api/tags')
      .then((r) => r.json())
      .then((data) => setAllTags(Array.isArray(data) ? data.map((t: any) => t.name) : []))
      .catch(() => {});
  }, []);

  const addTag = (t: string) => {
    if (!t.trim()) return;
    if (tags.includes(t)) {
      setInput('');
      return;
    }
    const next = [...tags, t];
    setTags(next);
    setInput('');
    onChange?.(next);

    // If noteId present, persist
    if (noteId) {
      fetch('/api/tags', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ noteId, tags: [t] }),
      }).catch(() => {});
    }
  };

  const removeTag = (t: string) => {
    const next = tags.filter((x) => x !== t);
    setTags(next);
    onChange?.(next);
    // Removing tag relation left as post-merge improvement
  };

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Add tag and press Enter"
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              addTag(input.trim());
            }
          }}
          className="flex-1 px-2 py-1 border rounded"
        />
        <button
          onClick={() => addTag(input.trim())}
          className="px-3 py-1 bg-indigo-600 text-white rounded"
        >
          Add
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {tags.map((t) => (
          <span key={t} className="flex items-center gap-2 px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded">
            <span className="text-sm">{t}</span>
            <button onClick={() => removeTag(t)} className="text-xs text-red-500">✕</button>
          </span>
        ))}
      </div>

      <div className="text-xs text-slate-500">
        Suggestions:{' '}
        {allTags.slice(0, 10).map((t) => (
          <button key={t} onClick={() => addTag(t)} className="text-blue-600 ml-1">
            {t}
          </button>
        ))}
      </div>
    </div>
  );
}
