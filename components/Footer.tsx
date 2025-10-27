"use client";

import { motion } from "framer-motion";
import { Github, Twitter, Mail } from "lucide-react";

export default function Footer() {
  return (
    <motion.footer
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="mt-20 w-full bg-gradient-to-b from-transparent via-blue-950/40 to-blue-950/80 backdrop-blur-lg border-t border-white/10 py-10 text-center text-white"
    >
      <div className="container mx-auto px-6">
        {/* Logo / Brand Name */}
        <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-indigo-500 text-transparent bg-clip-text mb-4">
          NoteSwap
        </h1>

        {/* Tagline */}
        <p className="text-gray-300 text-sm max-w-md mx-auto mb-6">
          Save, share, and discover notes with the power of AI. Built for
          students, creators, and dreamers ✨
        </p>

        {/* Social Icons */}
        <div className="flex justify-center gap-6 mb-6">
          <a
            href="https://github.com"
            target="_blank"
            className="hover:text-blue-400 transition transform hover:scale-110"
          >
            <Github size={22} />
          </a>
          <a
            href="https://twitter.com"
            target="_blank"
            className="hover:text-blue-400 transition transform hover:scale-110"
          >
            <Twitter size={22} />
          </a>
          <a
            href="mailto:support@noteswap.app"
            className="hover:text-blue-400 transition transform hover:scale-110"
          >
            <Mail size={22} />
          </a>
        </div>

        {/* Divider */}
        <div className="h-px bg-white/10 w-3/4 mx-auto mb-6"></div>

        {/* Bottom Text */}
        <p className="text-xs text-gray-400">
          © {new Date().getFullYear()} NoteSwap. Crafted with 💙 using Next.js &
          Tailwind.
        </p>
      </div>
    </motion.footer>
  );
}
