"use client";

import { useState, useRef } from "react";

export default function AudioRecorder() {
  const [recording, setRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const mediaRef = useRef<MediaRecorder | null>(null);
  const chunks = useRef<Blob[]>([]);

  async function startRecording() {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const recorder = new MediaRecorder(stream);
    mediaRef.current = recorder;
    chunks.current = [];

    recorder.ondataavailable = (e) => chunks.current.push(e.data);
    recorder.onstop = async () => {
      const blob = new Blob(chunks.current, { type: "audio/webm" });
      const file = new File([blob], `recording-${Date.now()}.webm`, {
        type: "audio/webm",
      });

      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/uploads", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (data.url) {
        setAudioUrl(data.url);
      } else {
        alert("Upload failed: " + data.error);
      }
    };

    recorder.start();
    setRecording(true);
  }

  function stopRecording() {
    mediaRef.current?.stop();
    setRecording(false);
  }

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      <button
        onClick={recording ? stopRecording : startRecording}
        className={`px-6 py-3 text-white rounded-full shadow-lg transition ${
          recording ? "bg-red-600 animate-pulse" : "bg-blue-600 hover:bg-blue-700"
        }`}
      >
        {recording ? "Stop Recording" : "Start Recording"}
      </button>

      {audioUrl && (
        <div className="mt-4 text-center">
          <audio controls src={audioUrl} className="w-full" />
          <p className="text-sm text-gray-400 mt-2">{audioUrl}</p>
        </div>
      )}
    </div>
  );
}
