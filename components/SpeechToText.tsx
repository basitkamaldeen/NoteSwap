"use client";

import { useState, useEffect } from "react";
import { Mic, Square, Save } from "lucide-react";

export default function SpeechToText({ onSave }: { onSave: (text: string) => void }) {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [recognition, setRecognition] = useState<any>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition =
        (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;

      if (SpeechRecognition) {
        const recog = new SpeechRecognition();
        recog.continuous = true;
        recog.interimResults = true;
        recog.lang = "en-US";

        recog.onresult = (event: any) => {
          let finalTranscript = "";
          for (let i = event.resultIndex; i < event.results.length; ++i) {
            finalTranscript += event.results[i][0].transcript;
          }
          setTranscript(finalTranscript);
        };

        setRecognition(recog);
      } else {
        alert("Speech recognition not supported on this browser.");
      }
    }
  }, []);

  const startRecording = () => {
    if (!recognition) return;
    setTranscript("");
    recognition.start();
    setIsRecording(true);
  };

  const stopRecording = () => {
    if (!recognition) return;
    recognition.stop();
    setIsRecording(false);
  };

  const handleSave = () => {
    if (transcript.trim()) {
      onSave(transcript);
      setTranscript("");
    }
  };

  return (
    <div className="bg-slate-800 p-4 rounded-xl text-white shadow-xl border border-blue-700 mt-4">
      <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
        🎙️ Voice Recorder
      </h3>

      <div className="flex items-center gap-4 mb-3">
        {!isRecording ? (
          <button
            onClick={startRecording}
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg flex items-center gap-2"
          >
            <Mic size={18} /> Start
          </button>
        ) : (
          <button
            onClick={stopRecording}
            className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg flex items-center gap-2"
          >
            <Square size={18} /> Stop
          </button>
        )}
        <button
          onClick={handleSave}
          disabled={!transcript.trim()}
          className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg flex items-center gap-2 disabled:opacity-50"
        >
          <Save size={18} /> Save as Note
        </button>
      </div>

      <textarea
        value={transcript}
        onChange={(e) => setTranscript(e.target.value)}
        rows={4}
        placeholder="Your transcribed text will appear here..."
        className="w-full bg-slate-900 border border-blue-700 rounded-lg p-2 text-sm"
      />
    </div>
  );
}
