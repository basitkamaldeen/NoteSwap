'use client';

import React from 'react';
import PicToText from '../../components/PicToText';
import DarkModeToggle from '../../components/DarkModeToggle';

export default function PicToTextPage() {
  return (
    <main className="p-4 min-h-screen bg-gray-50 dark:bg-slate-900">
      <header className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Pic-to-Text (Test)</h1>
        <DarkModeToggle />
      </header>

      <section className="space-y-6">
        <p className="text-sm text-slate-600 dark:text-slate-300">
          This is a test page for the PicToText component. Upload a handwritten image and click
          &quot;Extract text&quot;. The component will first try your Hugging Face Space proxy at
          <code className="mx-1 px-1 rounded bg-slate-100 dark:bg-slate-800">/api/ocr</code> and fallback
          to client-side Tesseract.js if the proxy is not available.
        </p>

        <PicToText
          onCreate={async (title, content) => {
            try {
              // Attempt to save via API if present; otherwise log to console
              const res = await fetch('/api/notes/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title, content }),
              });
              if (res.ok) {
                const json = await res.json();
                alert('Note created: ' + (json.id ?? title));
              } else {
                console.log('No /api/notes/create endpoint. Note content:\n', content);
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
