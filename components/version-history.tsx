"use client";
import { useState, useEffect } from "react";

export function VersionHistory({ noteId }: { noteId: string }) {
  const [versions, setVersions] = useState<any[]>([]);

  useEffect(() => {
    fetch(`/api/version?id=${noteId}`)
      .then((r) => r.json())
      .then(setVersions);
  }, [noteId]);

  return (
    <div>
      <h3 className="font-bold mt-4">🕒 Version History</h3>
      <ul className="space-y-1 mt-2">
        {versions.map((v, i) => (
          <li key={i} className="text-sm text-gray-500">
            {new Date(v.createdAt).toLocaleString()}
          </li>
        ))}
      </ul>
    </div>
  );
}
