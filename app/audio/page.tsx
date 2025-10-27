"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import AudioRecorder from "@/components/AudioRecorder";
import { Loader2, FileAudio, Sparkles } from "lucide-react";

export default function AudioPage() {
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [transcript, setTranscript] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleTranscribe() {
    if (!audioFile) {
      setError("Please record or upload an audio file first.");
      return;
    }

    setError("");
    setTranscript("");
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("audio", audioFile);

      const res = await fetch("/api/audio/transcribe", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      setLoading(false);

      if (data.error) setError(data.error);
      else setTranscript(data.text || "No text returned.");
    } catch (err: any) {
      setLoading(false);
      setError(err.message);
    }
  }

  return (
    <div className="min-h-screen px-6 py-20 md:px-16 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-4xl mx-auto text-center"
      >
        <h1 className="text-4xl font-bold mb-3 flex justify-center items-center gap-2">
          <FileAudio className="w-8 h-8 text-blue-400" /> Audio Tools
        </h1>
        <p className="text-gray-300 mb-10">
          Record, upload, and transcribe your voice notes into readable text using AI.
        </p>

        <AudioRecorder onRecordingComplete={(file) => setAudioFile(file)} />

        {audioFile && (
          <div className="mt-6 bg-white/10 p-4 rounded-xl border border-white/10 text-left">
            <p className="text-sm mb-2 text-gray-300">Selected File:</p>
            <p className="font-mono">{audioFile.name}</p>
          </div>
        )}

        <button
          onClick={handleTranscribe}
          disabled={loading || !audioFile}
          className="mt-6 bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-xl text-lg font-semibold flex items-center justify-center gap-2 mx-auto disabled:bg-gray-600"
        >
          {loading ? <Loader2 className="animate-spin" /> : <Sparkles />}
          {loading ? "Transcribing..." : "Transcribe Audio"}
        </button>

        {error && (
          <p className="text-red-400 mt-4 bg-white/10 p-3 rounded-lg">{error}</p>
        )}

        {transcript && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="mt-8 bg-white/10 p-6 rounded-xl text-left"
          >
            <h2 className="text-2xl font-semibold mb-2">🧾 Transcription</h2>
            <p className="text-gray-200 leading-relaxed whitespace-pre-wrap">
              {transcript}
            </p>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
