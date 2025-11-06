"use client";
import React, { useEffect, useRef } from "react";

type Props = {
  audioUrl: string | null;
  onReady?: () => void;
  height?: number;
};

export default function WaveSurferPlayer({ audioUrl, onReady, height = 80 }: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const wavesurferRef = useRef<any>(null);

  useEffect(() => {
    let cancelled = false;
    let WaveSurfer: any;

    async function init() {
      if (!containerRef.current) return;
      
      try {
        // Import wavesurfer.js dynamically
        const wavesurferModule = await import("wavesurfer.js");
        WaveSurfer = wavesurferModule.default || wavesurferModule;
        
        // Create wavesurfer instance
        wavesurferRef.current = WaveSurfer.create({
          container: containerRef.current,
          waveColor: "rgba(99,102,241,0.15)",
          progressColor: "rgba(99,102,241,0.9)",
          cursorColor: "rgba(99,102,241,0.8)",
          barWidth: 2,
          height,
          responsive: true,
          normalize: true,
        });

        wavesurferRef.current.on("ready", () => {
          if (!cancelled) {
            onReady?.();
          }
        });

        wavesurferRef.current.on("error", (e: any) => {
          console.error("WaveSurfer error:", e);
        });

        // Load audio if URL is provided
        if (audioUrl) {
          try {
            wavesurferRef.current.load(audioUrl);
          } catch (err) {
            console.error("WaveSurfer load failed:", err);
          }
        }
      } catch (error) {
        console.error("Error initializing WaveSurfer:", error);
      }
    }

    init();

    return () => {
      cancelled = true;
      try {
        if (wavesurferRef.current) {
          wavesurferRef.current.destroy();
          wavesurferRef.current = null;
        }
      } catch (e) {
        console.error("Error destroying WaveSurfer:", e);
      }
    };
  }, [height, onReady]); // Added dependencies

  useEffect(() => {
    if (!wavesurferRef.current || !audioUrl) return;
    
    try {
      wavesurferRef.current.load(audioUrl);
    } catch (err) {
      console.error("WaveSurfer load failed:", err);
    }
  }, [audioUrl]);

  // Optional: Add play/pause controls
  const play = () => {
    if (wavesurferRef.current) {
      wavesurferRef.current.play();
    }
  };

  const pause = () => {
    if (wavesurferRef.current) {
      wavesurferRef.current.pause();
    }
  };

  // Expose controls via window for debugging (optional)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      (window as any).__wavesurfer__ = wavesurferRef.current;
    }
    
    return () => {
      if (typeof window !== 'undefined') {
        (window as any).__wavesurfer__ = null;
      }
    };
  }, []);

  return (
    <div className="w-full rounded-md overflow-hidden border border-slate-200 dark:border-neutral-800 bg-gradient-to-b from-white/60 to-white/30 p-2">
      <div ref={containerRef} />
      
      {/* Optional: Add control buttons */}
      <div className="flex gap-2 mt-2 justify-center">
        <button
          onClick={play}
          className="px-3 py-1 bg-indigo-600 text-white rounded text-sm hover:bg-indigo-700"
        >
          Play
        </button>
        <button
          onClick={pause}
          className="px-3 py-1 bg-gray-600 text-white rounded text-sm hover:bg-gray-700"
        >
          Pause
        </button>
      </div>
    </div>
  );
}