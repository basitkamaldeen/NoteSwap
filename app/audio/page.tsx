import React from "react";
import AudioRecorder from "../../components/AudioRecorder";

export const metadata = {
  title: "Audio — NoteSwap",
};

export default function AudioPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0b1220] py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-2xl font-bold mb-4">Audio Notes</h1>
        <p className="text-sm mb-6 text-slate-600">
          Record voice notes, transcribe using your Hugging Face Space, preview and summarize before saving.
        </p>

        <AudioRecorder />
      </div>
    </div>
  );
}
