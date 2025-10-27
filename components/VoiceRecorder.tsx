"use client";
import { useState, useRef } from "react";
import { Mic, Square, Save, Loader2 } from "lucide-react";

export default function VoiceRecorder({ onSave }: { onSave: (text: string) => void }) {
  const [recording, setRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [loading, setLoading] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);

  async function startRecording() {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mediaRecorder = new MediaRecorder(stream);
    const chunks: BlobPart[] = [];

    mediaRecorder.ondataavailable = e => chunks.push(e.data);
    mediaRecorder.onstop = async () => {
      const audioBlob = new Blob(chunks, { type: "audio/webm" });
      setLoading(true);
      // 🧠 Placeholder transcription logic
      const fakeTranscript = "Lecture on AI recorded successfully.";
      setTranscript(fakeTranscript);
      onSave(fakeTranscript);
      setLoading(false);
    };

    mediaRecorderRef.current = mediaRecorder;
    mediaRecorder.start();
    setRecording(true);
  }

  function stopRecording() {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setRecording(false);
    }
  }

  return (
    <div className="p-4 bg-white/10 rounded-2xl backdrop-blur-lg flex flex-col items-center text-white gap-3 shadow-lg">
      {loading ? (
        <Loader2 className="animate-spin text-blue-400" size={28} />
      ) : (
        <>
          <button
            onClick={recording ? stopRecording : startRecording}
            className={`p-4 rounded-full ${
              recording ? "bg-red-500" : "bg-green-600"
            } hover:scale-105 transition`}
          >
            {recording ? <Square size={24} /> : <Mic size={24} />}
          </button>
          {transcript && (
            <div className="flex items-center gap-2 mt-3">
              <Save size={18} />
              <span className="text-sm opacity-80">{transcript}</span>
            </div>
          )}
        </>
      )}
    </div>
  );
}
