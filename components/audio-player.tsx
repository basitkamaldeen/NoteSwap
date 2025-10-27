"use client";

interface AudioPlayerProps {
  title?: string;
  url: string;
  transcript?: string | null;
  summary?: string | null;
}

export function AudioPlayer({ title, url, transcript, summary }: AudioPlayerProps) {
  return (
    <div className="p-4 border rounded-lg bg-white dark:bg-gray-800 shadow">
      <h3 className="font-semibold mb-2">{title || "Lecture Recording"}</h3>
      <audio controls className="w-full mb-2" src={url}></audio>
      {summary && (
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">
          <strong>AI Summary:</strong> {summary}
        </p>
      )}
      {transcript && (
        <details>
          <summary className="cursor-pointer text-blue-500">View Transcript</summary>
          <p className="text-sm mt-2 text-gray-700 dark:text-gray-300">{transcript}</p>
        </details>
      )}
    </div>
  );
}
