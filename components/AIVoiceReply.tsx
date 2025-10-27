"use client";

import { useState } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { motion } from "framer-motion";

export default function AIVoiceReply({ text }: { text: string }) {
  const [speaking, setSpeaking] = useState(false);

  const handleSpeak = () => {
    if (!text) return alert("No AI response to speak.");

    const synth = window.speechSynthesis;
    if (synth.speaking) {
      synth.cancel();
      setSpeaking(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.pitch = 1;
    utterance.rate = 1.05;

    utterance.onstart = () => setSpeaking(true);
    utterance.onend = () => setSpeaking(false);

    synth.speak(utterance);
  };

  return (
    <motion.button
      whileTap={{ scale: 0.9 }}
      onClick={handleSpeak}
      className={`fixed bottom-6 right-6 z-50 px-4 py-3 rounded-full shadow-lg ${
        speaking ? "bg-red-600" : "bg-blue-600"
      } hover:opacity-90 flex items-center gap-2 text-white`}
    >
      {speaking ? <VolumeX size={20} /> : <Volume2 size={20} />}
      {speaking ? "Stop" : "Listen"}
    </motion.button>
  );
}
