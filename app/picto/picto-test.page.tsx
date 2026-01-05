'use client';

import React from 'react';
import PicToText_v2 from '../../components/PicToText_v2';
import DarkModeToggle_v2 from '../../components/DarkModeToggle_v2';

export default function PictoTestPage() {
  return (
    <main className="p-4 min-h-screen bg-gray-50 dark:bg-slate-900">
      <header className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Pic-to-Text (Test, v2)</h1>
        <DarkModeToggle_v2 />
      </header>

      <section className="space-y-6">
        <p className="text-sm text-slate-600 dark:text-slate-300">
          Test page for PicToText_v2. Upload a handwritten image and click "Extract text". The component will
          try /api/ocr first and fall back to client-side Tesseract.js.
        </p>

        <PicToText_v2
          onCreate={async (title, content) => {
            try {
              const res = await fetch('/api/notes_v2', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title, content }),
              });
              if (res.ok) {
                const json = await res.json();
                alert('Note created: ' + (json.id ?? title));
              } else {
                console.log('No /api/notes_v2 endpoint. Note content:\n', content);
                alert('Note content logged to console.');
              }
            } catch (err) {
              console.warn('Save failed, falling back to console log', err);
              console.log('Note:', { title, content });
              alert('Note content logged to console.');
            }
          }}
        />
      </section>
    </main>
  );
}
