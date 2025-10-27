"use client";
import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

export default function DarkModeToggle() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    if (dark) document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
  }, [dark]);

  return (
    <button
      onClick={() => setDark(!dark)}
      className="fixed bottom-6 left-6 p-3 bg-white/10 backdrop-blur-lg rounded-full shadow-lg text-white hover:bg-white/20 transition"
    >
      {dark ? <Sun size={22} /> : <Moon size={22} />}
    </button>
  );
}
