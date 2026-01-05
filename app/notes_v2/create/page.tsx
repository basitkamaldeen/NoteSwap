'use client';

import React, { useState } from 'react';
import MarkdownEditor_v2 from '../../../components/MarkdownEditor_v2';
import TagEditor_v2 from '../../../components/TagEditor'; // reuse existing TagEditor if present
import PDFExportButton_v2 from '../../../components/PDFExportButton_v2';
import PicToText_v2 from '../../../components/PicToText_v2';
import { useRouter } from 'next/navigation';

export default function CreateNoteV2Page() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const router = useRouter();

  const save = async () => {
    const res = await fetch('/api/notes_v2', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: title || 'Untitled', content, tags }),
    });
    if (res.ok) {
      const json = await res.json();
      router.push(`/notes/${json.id}`);
    } else {
      alert('Failed to save note.');
    }
  };

  return (
    <main className="p-4 min-h-screen bg-gray-50 dark:bg-slate-900">
      <header className="flex items-center justify-between mb-6">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Note title"
          className="text-2xl font-semibold bg-transparent border-b px-2 py-1"
        />
        <div className="flex gap-2">
          <PDFExportButton_v2 elementId="note-content" filename={`${title ?? 'note'}.pdf`} />
          <button onClick={save} className="px-3 py-1 bg-green-600 text-white rounded">Save</button>
        </div>
      </header>

      <section className="grid gap-6 md:grid-cols-2">
        <div>
          <h3 className="mb-2 font-medium">Writer</h3>
          <div id="note-content" className="p-2 bg-white dark:bg-slate-800 rounded">
            <MarkdownEditor_v2 initial={content} onChange={(v) => setContent(v)} />
          </div>

          <div className="mt-4">
            <h4 className="font-medium mb-2">Pic-to-Text</h4>
            <PicToText_v2
              onCreate={async (t, extracted) => {
                setContent((c) => (c ? c + '\n\n' + extracted : extracted));
                setTitle((s) => s || t);
              }}
            />
          </div>
        </div>

        <aside>
          <h3 className="mb-2 font-medium">Tags</h3>
          <TagEditor_v2 initialTags={tags} onChange={(ts: string[]) => setTags(ts)} />

          <div className="mt-6">
            <h3 className="mb-2 font-medium">Preview</h3>
            <div className="p-2 bg-white dark:bg-slate-800 rounded prose dark:prose-invert">
              <div dangerouslySetInnerHTML={{ __html: (content || '').replace(/\n/g, '<br/>') }} />
            </div>
          </div>
        </aside>
      </section>
    </main>
  );
}
