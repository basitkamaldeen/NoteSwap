"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { PlayCircle, Trash2 } from "lucide-react";

export default function AudioList({ onSelect, selectedAudio }: { onSelect: (id: string) => void; selectedAudio: string | null }) {
  const [audios, setAudios] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/audio/list")
      .then((res) => res.json())
      .then((data) => setAudios(data || []));
  }, []);

  async function handleDelete(id: string) {
    await fetch(`/api/audio/${id}`, { method: "DELETE" });
    setAudios(audios.filter((a) => a.id !== id));
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/10 p-6 rounded-2xl shadow-xl text-white"
    >
      <h2 className="text-2xl font-semibold mb-4">🎧 Your Audio Notes</h2>

      {audios.length === 0 ? (
        <p className="text-gray-300">No audio files yet.</p>
      ) : (
        <div className="space-y-3">
          {audios.map((audio) => (
            <div
              key={audio.id}
              className={`flex justify-between items-center p-3 rounded-lg cursor-pointer transition ${
                selectedAudio === audio.id ? "bg-blue-600/60" : "bg-white/5 hover:bg-white/10"
              }`}
              onClick={() => onSelect(audio.id)}
            >
              <span>{audio.filename}</span>
              <div className="flex items-center gap-3">
                <PlayCircle size={20} />
                <Trash2
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(audio.id);
                  }}
                  size={20}
                  className="text-red-400 hover:text-red-600"
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
