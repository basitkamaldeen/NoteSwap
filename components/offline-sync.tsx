// components/offline-sync.tsx
"use client";
import { useEffect, useState } from "react";

export function OfflineSync() {
  const [online, setOnline] = useState(true);
  useEffect(() => {
    const on = () => setOnline(navigator.onLine);
    window.addEventListener("online", on);
    window.addEventListener("offline", on);
    on();
    return () => {
      window.removeEventListener("online", on);
      window.removeEventListener("offline", on);
    };
  }, []);

  return (
    <div>
      {!online && (
        <div className="bg-yellow-500 text-black p-2 rounded">You are offline — changes will sync later</div>
      )}
    </div>
  );
}
