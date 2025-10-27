"use client";
import { useState } from "react";

export function LikeButton({ noteId, initialLikes = 0 }: any) {
  const [likes, setLikes] = useState(initialLikes);

  async function likeNote() {
    setLikes((prev) => prev + 1);
    await fetch(`/api/notes/${noteId}/like`, { method: "POST" });
  }

  return (
    <button onClick={likeNote} className="flex items-center gap-1 text-red-600">
      ❤️ {likes}
    </button>
  );
}
