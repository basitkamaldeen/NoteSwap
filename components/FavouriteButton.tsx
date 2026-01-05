'use client';

import React, { useState } from 'react';

type Props = {
  noteId: number;
  initial?: boolean;
  userId?: string;
};

export default function FavoriteButton({ noteId, initial = false, userId }: Props) {
  const [fav, setFav] = useState(initial);
  const toggle = async () => {
    const next = !fav;
    setFav(next);
    try {
      await fetch('/api/favorites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ noteId, userId, favorite: next }),
      });
    } catch (err) {
      // revert on error
      setFav(!next);
    }
  };

  return (
    <button onClick={toggle} className={`px-2 py-1 rounded ${fav ? 'bg-yellow-400' : 'bg-slate-100 dark:bg-slate-800'}`}>
      {fav ? '★ Favorited' : '☆ Favorite'}
    </button>
  );
}
