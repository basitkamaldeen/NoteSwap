"use client";
import { useEffect, useState } from "react";
import { Clock, Play, Pause, RotateCcw } from "lucide-react";

export default function StudyTimer() {
  const [seconds, setSeconds] = useState(0);
  const [active, setActive] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (active) {
      timer = setInterval(() => setSeconds((s) => s + 1), 1000);
    }
    return () => clearInterval(timer);
  }, [active]);

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <div className="flex items-center gap-4 bg-white/10 p-4 rounded-xl text-white">
      <Clock className="w-6 h-6 text-cyan-400" />
      <span className="text-lg font-semibold">{formatTime(seconds)}</span>
      <button
        onClick={() => setActive(!active)}
        className="bg-cyan-600 hover:bg-cyan-700 px-3 py-1 rounded-lg"
      >
        {active ? <Pause size={18} /> : <Play size={18} />}
      </button>
      <button
        onClick={() => setSeconds(0)}
        className="bg-gray-600 hover:bg-gray-700 px-3 py-1 rounded-lg"
      >
        <RotateCcw size={18} />
      </button>
    </div>
  );
}
