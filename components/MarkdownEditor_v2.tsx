'use client';

import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeSanitize from 'rehype-sanitize';

type Props = {
  initial?: string;
  onChange?: (val: string) => void;
};

export default function MarkdownEditor_v2({ initial = '', onChange }: Props) {
  const [text, setText] = useState(initial);
  const [showPreview, setShowPreview] = useState(true);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium">Note (Markdown)</h3>
        <div className="flex gap-2">
          <button
            onClick={() => setShowPreview(!showPreview)}
            className="text-sm px-2 py-1 rounded bg-slate-100 dark:bg-slate-800"
          >
            {showPreview ? 'Hide preview' : 'Show preview'}
          </button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <textarea
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            onChange?.(e.target.value);
          }}
          className="w-full min-h-[200px] rounded border p-2 text-sm"
        />

        {showPreview && (
          <div className="prose dark:prose-invert max-w-none p-2 rounded border bg-white dark:bg-slate-900">
            <ReactMarkdown rehypePlugins={[rehypeSanitize]}>{text}</ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  );
}
