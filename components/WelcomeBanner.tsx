"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles } from "lucide-react";

export default function WelcomeBanner() {
  const { user, isLoaded } = useUser();
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (!isLoaded) return;

    // Auto-hide after 5 seconds
    const timer = setTimeout(() => setVisible(false), 5000);
    return () => clearTimeout(timer);
  }, [isLoaded]);

  if (!isLoaded || !visible) return null;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
          className="fixed top-6 right-6 z-50 bg-white/10 backdrop-blur-lg border border-white/20 
                     text-white px-6 py-3 rounded-2xl shadow-xl flex items-center gap-3"
        >
          <Sparkles className="text-blue-400 w-5 h-5" />
          <div className="text-sm font-medium">
            {user ? (
              <>
                👋 Welcome back, <span className="font-semibold">{user.firstName || "Friend"}</span>!
              </>
            ) : (
              "🪶 Welcome to NoteSwap — please sign in!"
            )}
          </div>

          {/* Optional close (X) button */}
          <button
            onClick={() => setVisible(false)}
            className="ml-4 text-gray-300 hover:text-white transition"
          >
            ✖
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
