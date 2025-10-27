// components/folder-sidebar.tsx
"use client";
import { useEffect, useState } from "react";

export function FolderSidebar({ onSelect }: { onSelect: (tag: string) => void }) {
  const [folders, setFolders] = useState<string[]>([]);
  useEffect(() => {
    fetch("/api/folders")
      .then((r) => r.json())
      .then(setFolders)
      .catch(() => setFolders([]));
  }, []);
  return (
    <aside className="w-48 p-4 border-r hidden lg:block">
      <h3 className="font-semibold mb-2">Tags</h3>
      <ul className="space-y-2">
        {folders.map((f) => (
          <li key={f} onClick={() => onSelect(f)} className="cursor-pointer hover:text-blue-600">
            #{f}
          </li>
        ))}
      </ul>
    </aside>
  );
}
