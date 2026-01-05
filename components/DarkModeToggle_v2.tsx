'use client';

import React, { useEffect, useState } from 'react';

export default function DarkModeToggle_v2() {
  const [mode, setMode] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const stored = typeof window !== 'undefined' ? localStorage.getItem('theme') : null;
    if (stored === 'dark' || (!stored && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      setMode('dark');
      document.documentElement.classList.add('dark');
    } else {
      setMode('light');
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggle = () => {
    if (mode === 'light') {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setMode('dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      setMode('light');
    }
  };

  return (
    <button
      onClick={toggle}
      aria-label="Toggle theme"
      className="px-3 py-1 rounded bg-slate-100 dark:bg-slate-800"
    >
      {mode === 'dark' ? '🌙 Dark' : '☀️ Light'}
    </button>
  );
}
