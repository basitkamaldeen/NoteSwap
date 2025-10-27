"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, FileText } from "lucide-react";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white flex flex-col justify-center items-center text-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="flex justify-center mb-4">
          <FileText className="w-12 h-12 text-blue-400" />
        </div>

        <h1 className="text-4xl sm:text-6xl font-bold mb-4">Welcome to NoteSwap</h1>
        <p className="text-gray-300 text-lg mb-8 max-w-xl mx-auto">
          Your intelligent note companion — create, record, and enhance your notes with AI.
        </p>

        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition"
        >
          Get Started <ArrowRight size={20} />
        </Link>
      </motion.div>
    </main>
  );
}
