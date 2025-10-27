"use client";

import { useEffect, useState } from "react";
import { AudioRecorder } from "@/components/audio-recorder";
import { AudioPlayer } from "@/components/audio-player";

export default function AudioDashboard() {
  const [audioNotes, setAudioNotes] = useState([]);

  async function fetchAudioNotes() {
    const res = await fetch("/api/audio-notes");
    const data = await res.json();
    setAudioNotes(data);
  }

  useEffect(() => {
    fetchAudioNotes();
  }, []);

  return (
    <div className="p-8 min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <h1 className="text-3xl font-bold mb-6">🎙️ Audio Notes</h1>
      <AudioRecorder onUploaded={fetchAudioNotes} />

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {audioNotes.map((note: any) => (
          <AudioPlayer
            key={note.id}
            title={note.title}
            url={note.audioUrl}
            transcript={note.transcript}
            summary={note.summary}
          />
        ))}
      </div>
    </div>
  );
}
