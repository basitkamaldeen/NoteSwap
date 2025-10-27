"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { UploadCloud, Loader2 } from "lucide-react";

export default function AudioUploader() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/audio/upload", {
      method: "POST",
      body: formData,
    });

    setLoading(false);
    if (res.ok) alert("✅ Audio uploaded successfully!");
    else alert("❌ Upload failed. Try again.");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/10 backdrop-blur-lg p-6 rounded-2xl shadow-xl text-white text-center"
    >
      <h2 className="text-2xl font-semibold mb-6">📤 Upload Audio File</h2>

      <input
        type="file"
        accept="audio/*"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
        className="block w-full text-sm text-gray-300 bg-white/5 border border-gray-600 rounded-lg cursor-pointer p-3 mb-4"
      />

      <button
        onClick={handleUpload}
        disabled={loading}
        className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg w-full"
      >
        {loading ? <Loader2 className="animate-spin inline-block" /> : <><UploadCloud size={18}/> Upload</>}
      </button>
    </motion.div>
  );
}
