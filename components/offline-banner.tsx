"use client";
import { useEffect, useState } from "react";

export function OfflineBanner() {
  const [offline, setOffline] = useState(false);

  useEffect(() => {
    const handleOffline = () => setOffline(!navigator.onLine);
    window.addEventListener("online", handleOffline);
    window.addEventListener("offline", handleOffline);
    handleOffline();
    return () => {
      window.removeEventListener("online", handleOffline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  if (!offline) return null;

  return (
    <div className="bg-red-600 text-white p-2 text-center">
      ⚠️ You’re offline. Notes will sync once you reconnect.
    </div>
  );
}
