// components/file-uploader.tsx
"use client";
import { useState } from "react";

export function FileUploader({ onUploaded }: { onUploaded: (url: string) => void }) {
  const [loading, setLoading] = useState(false);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setLoading(true);
    const reader = new FileReader();
    reader.onload = async () => {
      const base64 = reader.result as string;
      const res = await fetch("/api/files/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ filename: file.name, data: base64 }),
      });
      const data = await res.json();
      onUploaded(data.url);
      setLoading(false);
    };
    reader.readAsDataURL(file);
  }

  return (
    <div>
      <input type="file" onChange={handleFile} />
      {loading && <p>Uploading...</p>}
    </div>
  );
}
