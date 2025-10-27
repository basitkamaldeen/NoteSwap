"use client";
import { useState, useRef } from "react";

export function SpeechRecorder({ onTranscribed }: { onTranscribed: (text: string) => void }) {
  const [recording, setRecording] = useState(false);
  const recognitionRef = useRef<any>(null);

  function startRecording() {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech recognition not supported on this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.onresult = (e: any) => {
      const transcript = Array.from(e.results).map((r: any) => r[0].transcript).join(" ");
      onTranscribed(transcript);
    };
    recognition.start();
    recognitionRef.current = recognition;
    setRecording(true);
  }

  function stopRecording() {
    recognitionRef.current?.stop();
    setRecording(false);
  }

  return (
    <button
      onClick={recording ? stopRecording : startRecording}
      className={`mt-2 px-3 py-2 rounded-lg text-white ${recording ? "bg-red-600" : "bg-green-600"}`}
    >
      {recording ? "🛑 Stop Recording" : "🎤 Start Recording"}
    </button>
  );
}
