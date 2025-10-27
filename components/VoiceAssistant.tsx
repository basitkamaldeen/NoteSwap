"use client";
import { useState } from "react";
import { Mic, Volume2, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

export default function VoiceAssistant() {
  const [listening, setListening] = useState(false);
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleVoice() {
    if (!("webkitSpeechRecognition" in window)) {
      alert("Speech recognition not supported in this browser.");
      return;
    }

    const recognition = new (window as any).webkitSpeechRecognition();
    recognition.lang = "en-US";
    recognition.start();
    setListening(true);

    recognition.onresult = async (event: any) => {
      const transcript = event.results[0][0].transcript;
      setListening(false);
      setLoading(true);
      const res = await fetch("/api/ai/rag", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: transcript }),
      });
      const data = await res.json();
      setResponse(data.answer || "No response.");
      setLoading(false);
    };
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className="fixed bottom-8 right-8 z-50"
    >
      <button
        onClick={handleVoice}
        className={`p-4 rounded-full shadow-lg ${listening ? "bg-red-600" : "bg-blue-600"} hover:scale-105 transition`}
      >
        {loading ? <Loader2 className="animate-spin" /> : listening ? <Mic /> : <Volume2 />}
      </button>
      {response && (
        <div className="mt-4 p-3 bg-white/10 rounded-lg text-white text-sm w-64">{response}</div>
      )}
    </motion.div>
  );
}
