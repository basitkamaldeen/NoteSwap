"use client";
import { useEffect, useState } from "react";
import { WifiOff, Wifi } from "lucide-react";

export default function OfflineSync() {
  const [online, setOnline] = useState(true);

  useEffect(() => {
    const handleOnline = () => setOnline(true);
    const handleOffline = () => setOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return (
    <div
      className={`fixed bottom-6 right-6 px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 ${
        online ? "bg-green-600" : "bg-red-600"
      } text-white`}
    >
      {online ? <Wifi size={18} /> : <WifiOff size={18} />}
      <span>{online ? "Online – synced" : "Offline – changes saved locally"}</span>
    </div>
  );
}
