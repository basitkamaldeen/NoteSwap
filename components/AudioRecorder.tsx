"use client";
import React, { useEffect, useRef, useState } from "react";
import WaveSurferPlayer from "./WaveSurferPlayer";

type SavePayload = {
  title: string;
  transcript: string;
  audioUrl: string;
  createdAt?: string;
};

export default function AudioRecorder() {
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [chunks, setChunks] = useState<Blob[]>([]);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [transcript, setTranscript] = useState<string>("");
  const [summary, setSummary] = useState<string>("");
  const [status, setStatus] = useState<string>("");
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [loadingTranscribe, setLoadingTranscribe] = useState(false);
  const [loadingSummary, setLoadingSummary] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    // cleanup blob url on unmount
    return () => {
      if (audioUrl) URL.revokeObjectURL(audioUrl);
    };
  }, [audioUrl]);

  async function startRecording() {
    setStatus("");
    setTranscript("");
    setSummary("");
    setChunks([]);
    setAudioUrl(null);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mr = new MediaRecorder(stream, { mimeType: "audio/webm" });
      setMediaRecorder(mr);
      const localChunks: Blob[] = [];
      mr.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) localChunks.push(e.data);
      };
      mr.onstop = () => {
        setChunks(localChunks);
        const blob = new Blob(localChunks, { type: "audio/webm" });
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);
      };
      mr.start();
      setIsRecording(true);
      setStatus("Recording...");
    } catch (err: any) {
      console.error(err);
      setStatus("Microphone access denied or not available.");
    }
  }

  function stopRecording() {
    if (!mediaRecorder) return;
    try {
      mediaRecorder.stop();
      setIsRecording(false);
      setMediaRecorder(null);
      setStatus("Recording stopped — preview below.");
    } catch (err) {
      console.error(err);
    }
  }

  function playPause() {
    if (!audioRef.current) return;
    if (audioRef.current.paused) audioRef.current.play();
    else audioRef.current.pause();
  }

  function download(filename = "recording.webm") {
    if (!chunks.length) return;
    const blob = new Blob(chunks, { type: "audio/webm" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = filename;
    a.click();
    URL.revokeObjectURL(a.href);
  }

  async function sendToTranscribe() {
    if (!chunks.length) {
      setStatus("No audio available to transcribe.");
      return;
    }
    setLoadingTranscribe(true);
    setStatus("Uploading and transcribing...");
    setTranscript("");
    setSummary("");
    try {
      const blob = new Blob(chunks, { type: "audio/webm" });
      const fd = new FormData();
      fd.append("audio", blob, `recording-${Date.now()}.webm`);
      // optional hint param for English via query or header
      const res = await fetch("/api/audio/transcribe", {
        method: "POST",
        body: fd,
      });

      const data = await res.json();
      setLoadingTranscribe(false);
      if (!res.ok) {
        console.error("Transcribe failed", data);
        setStatus(`Transcription failed: ${data?.error || res.statusText}`);
        return;
      }
      setTranscript(data.text || data.transcript || "");
      setStatus("Transcription complete. Preview below.");
    } catch (err: any) {
      console.error("Transcribe error", err);
      setStatus("Transcription error, check console.");
      setLoadingTranscribe(false);
    }
  }

  async function summarizePreview() {
    if (!transcript) {
      setStatus("No transcript to summarize.");
      return;
    }
    setLoadingSummary(true);
    setStatus("Summarizing...");
    setSummary("");
    try {
      const res = await fetch("/api/audio/summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: transcript }),
      });
      const data = await res.json();
      setLoadingSummary(false);
      if (!res.ok) {
        console.error("Summarize failed", data);
        setStatus(`Summarize failed: ${data?.error || res.statusText}`);
        return;
      }
      setSummary(data.summary || "");
      setStatus("Summary ready — preview below.");
    } catch (err: any) {
      console.error("Summarize error", err);
      setStatus("Summarize error, check console.");
      setLoadingSummary(false);
    }
  }

  async function saveToDashboard() {
    if (!audioUrl || !transcript) {
      setStatus("You need a recording and a transcript to save.");
      return;
    }
    setSaving(true);
    setStatus("Saving...");
    try {
      // fetch the audio blob again and upload or pass the public/uploads path returned by transcribe route.
      // For now we assume transcribe routes writes file and returns audioUrl path
      // If not, we upload the audio separately.
      const res = await fetch("/api/audio/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: `Audio note ${new Date().toISOString()}`,
          transcript,
          audioUrl: audioUrl,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        console.error("Save failed", data);
        setStatus("Save failed.");
        setSaving(false);
        return;
      }
      setStatus("Saved to dashboard.");
      setSaving(false);
    } catch (err) {
      console.error("Save error", err);
      setStatus("Save error.");
      setSaving(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto p-4">
      <div className="bg-white/70 dark:bg-neutral-900/60 border border-slate-200 dark:border-neutral-800 rounded-2xl p-4 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Audio Recorder</h3>
          <div className="text-sm text-slate-500">{status}</div>
        </div>

        {/* Controls */}
        <div className="flex gap-3 items-center mb-4">
          <button
            onClick={isRecording ? stopRecording : startRecording}
            className={`px-4 py-2 rounded-md font-medium shadow ${
              isRecording ? "bg-red-600 text-white" : "bg-green-600 text-white"
            }`}
          >
            {isRecording ? "Stop" : "Record"}
          </button>

          <button
            onClick={playPause}
            disabled={!audioUrl}
            className="px-4 py-2 rounded-md border border-slate-200 dark:border-neutral-800"
          >
            Play / Pause
          </button>

          <button
            onClick={() => download()}
            disabled={!chunks.length}
            className="px-4 py-2 rounded-md border border-slate-200 dark:border-neutral-800"
          >
            Download
          </button>

          <button
            onClick={sendToTranscribe}
            disabled={loadingTranscribe || !chunks.length}
            className="ml-auto px-4 py-2 rounded-md bg-indigo-600 text-white"
          >
            {loadingTranscribe ? "Transcribing..." : "Transcribe"}
          </button>
        </div>

        {/* Waveform + player */}
        <div className="mb-4">
          <WaveSurferPlayer audioUrl={audioUrl} onReady={() => {}} />
          <audio ref={audioRef} src={audioUrl ?? undefined} className="mt-2 w-full" controls />
        </div>

        {/* Transcript preview */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-medium">Transcript Preview</h4>
            <div className="flex gap-2">
              <button
                onClick={summarizePreview}
                disabled={!transcript || loadingSummary}
                className="px-3 py-1 rounded-md border"
              >
                {loadingSummary ? "Summarizing..." : "Summarize"}
              </button>
              <button
                onClick={saveToDashboard}
                disabled={saving || !transcript}
                className="px-3 py-1 rounded-md bg-emerald-600 text-white"
              >
                {saving ? "Saving..." : "Save to dashboard"}
              </button>
            </div>
          </div>

          <textarea
            value={transcript}
            onChange={(e) => setTranscript(e.target.value)}
            placeholder="Transcript will appear here after transcription. Edit text before summarizing if you like."
            className="w-full min-h-[120px] p-3 rounded-md border border-slate-200 dark:border-neutral-800 bg-transparent"
          />
        </div>

        {/* Summary preview */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-medium">Summary</h4>
            <div className="text-sm text-slate-500">Preview the summary before saving</div>
          </div>
          <textarea
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            placeholder="Summary will appear here after you click Summarize."
            className="w-full min-h-[100px] p-3 rounded-md border border-slate-200 dark:border-neutral-800 bg-transparent"
          />
        </div>
      </div>
    </div>
  );
}
