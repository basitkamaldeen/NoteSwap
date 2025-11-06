// components/WaveformPlayer.tsx
"use client";
import React, { useEffect, useRef, useState } from "react";

type Props = {
  src: string | null;
  id?: string;
};

export default function WaveformPlayer({ src, id = "wave" }: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const wsRef = useRef<any>(null);
  const [hasWave, setHasWave] = useState(false);

  useEffect(() => {
    let mounted = true;
    async function setup() {
      if (!src || !mounted) return;
      // lazy-load wavesurfer only when needed
      try {
        const WaveSurfer = (await import("wavesurfer.js")).default;
        const WaveSurferRegions = (await import("wavesurfer.js/dist/plugins/regions")).default;
        // create wavesurfer
        const ws = WaveSurfer.create({
          container: containerRef.current as HTMLElement,
          waveColor: "rgba(255,255,255,0.12)",
          progressColor: "rgba(96,165,250,0.9)",
          height: 80,
          responsive: true,
        });
        wsRef.current = ws;
        ws.load(src);
        setHasWave(true);
      } catch (e) {
        console.warn("WaveSurfer not available, falling back to native audio:", e);
        setHasWave(false);
      }
    }
    setup();
    return () => {
      mounted = false;
      try {
        wsRef.current?.destroy?.();
      } catch {}
    };
  }, [src]);

  if (!src) return <div className="text-sm text-gray-400">No audio</div>;

  return (
    <div className="space-y-2">
      <div ref={containerRef} id={id} className="w-full" />
      {!hasWave && (
        <audio ref={audioRef} controls src={src} className="w-full" />
      )}
    </div>
  );
}
