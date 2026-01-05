'use client';

import React, { useState, useRef } from 'react';

type Props = {
  onCreate?: (title: string, content: string) => Promise<void> | void;
  defaultTitlePrefix?: string;
};

export default function PicToText_v2({ onCreate, defaultTitlePrefix = 'pic-to-text' }: Props) {
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [extractedText, setExtractedText] = useState('');
  const fileRef = useRef<HTMLInputElement | null>(null);

  const readFileAsDataURL = (file: File) =>
    new Promise<string>((res, rej) => {
      const fr = new FileReader();
      fr.onload = () => res(String(fr.result));
      fr.onerror = rej;
      fr.readAsDataURL(file);
    });

  const handleFile = async (file?: File) => {
    if (!file) return;
    const dataUrl = await readFileAsDataURL(file);
    setFilePreview(dataUrl);
  };

  const runHfProxy = async (dataUrl: string) => {
    const api = '/api/ocr';
    const body = { imageBase64: dataUrl };
    const res = await fetch(api, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json?.error || 'HF proxy error');
    return json.extracted || json.data?.[0] || '';
  };

  const runTesseract = async (dataUrl: string) => {
    const Tesseract = (await import('tesseract.js')).default;
    const { data } = await Tesseract.recognize(dataUrl, 'eng', {
      logger: (m: any) => {
        /* optional progress */
      },
    });
    return data.text || '';
  };

  const handleExtract = async () => {
    try {
      if (!filePreview) return;
      setProcessing(true);
      setExtractedText('');
      try {
        const hfText = await runHfProxy(filePreview);
        if (hfText && hfText.trim().length > 0) {
          setExtractedText(hfText);
          setProcessing(false);
          return;
        }
      } catch (err) {
        console.warn('HF proxy failed or not configured, falling back to Tesseract', err);
      }

      const tess = await runTesseract(filePreview);
      setExtractedText(tess);
    } catch (err: any) {
      console.error(err);
      setExtractedText(`Error extracting text: ${err?.message ?? String(err)}`);
    } finally {
      setProcessing(false);
    }
  };

  const handleCreate = async () => {
    const ts = new Date().toISOString().replace(/[:.]/g, '-');
    const title = `${defaultTitlePrefix} - ${ts}`;
    if (onCreate) {
      await onCreate(title, extractedText);
    } else {
      try {
        await navigator.clipboard.writeText(extractedText);
        alert('Extracted text copied to clipboard. You can paste into a new note.');
      } catch {
        alert('Extracted text ready — copy manually from the preview.');
      }
    }
  };

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <div className="space-y-3">
        <label className="block">
          <span className="sr-only">Upload image</span>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            onChange={(e) => handleFile(e.target.files?.[0])}
            className="block w-full text-sm text-slate-500
              file:mr-4 file:py-2 file:px-4
              file:rounded file:border-0
              file:text-sm file:font-semibold
              file:bg-indigo-50 file:text-indigo-700
              hover:file:bg-indigo-100"
          />
        </label>

        {filePreview && (
          <div className="flex flex-col md:flex-row gap-4">
            <img src={filePreview} alt="preview" className="max-w-full md:max-w-xs rounded shadow" />
            <div className="flex-1">
              <div className="flex gap-2 mb-2">
                <button
                  className="px-3 py-2 bg-indigo-600 text-white rounded disabled:opacity-50"
                  onClick={handleExtract}
                  disabled={processing}
                >
                  {processing ? 'Processing...' : 'Extract text'}
                </button>
                <button
                  className="px-3 py-2 bg-gray-200 rounded"
                  onClick={() => {
                    setFilePreview(null);
                    setExtractedText('');
                    if (fileRef.current) fileRef.current.value = '';
                  }}
                >
                  Clear
                </button>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700">Extracted text</label>
                <textarea
                  value={extractedText}
                  onChange={(e) => setExtractedText(e.target.value)}
                  rows={10}
                  className="mt-1 block w-full rounded border p-2 text-sm"
                />
                <div className="flex gap-2 mt-2">
                  <button className="px-3 py-2 bg-green-600 text-white rounded" onClick={handleCreate}>
                    Create note
                  </button>
                  <a
                    className="px-3 py-2 inline-block bg-blue-600 text-white rounded"
                    href={`data:text/plain;charset=utf-8,${encodeURIComponent(extractedText)}`}
                    download={`${defaultTitlePrefix}.txt`}
                  >
                    Download .txt
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
