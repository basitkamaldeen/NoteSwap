"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton, useUser } from "@clerk/nextjs";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, PenTool as NotebookPen, X } from "lucide-react"


export default function Navbar() {
  const pathname = usePathname();
  const { user } = useUser();
  const [open, setOpen] = useState(false);

  const links = [
    { name: "Dashboard", href: "/dashboard" },
    { name: "AI Assistant", href: "/ai" },
    { name: "Audio Notes", href: "/audio" },
  ];

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed top-0 left-0 w-full bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 backdrop-blur-lg text-white shadow-lg z-50"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        {/* Logo */}
        <Link href="/" className="text-xl md:text-2xl font-bold flex items-center gap-2">
          <NotebookPen className="w-6 h-6 text-blue-400" />
          NoteSwap
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {links.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={`transition ${
                pathname === link.href
                  ? "text-blue-400 font-semibold"
                  : "hover:text-blue-300"
              }`}
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-4">
          {user ? (
            <UserButton afterSignOutUrl="/" />
          ) : (
            <Link
              href="/sign-in"
              className="hidden md:block bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-white"
            >
              Sign In
            </Link>
          )}

          {/* Mobile Menu Button */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden p-2 rounded-md bg-white/10 hover:bg-white/20 transition"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden flex flex-col bg-slate-800/95 border-t border-slate-700"
          >
            {links.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setOpen(false)}
                className={`py-3 px-6 text-sm border-b border-slate-700 ${
                  pathname === link.href
                    ? "bg-blue-600 text-white"
                    : "hover:bg-slate-700"
                }`}
              >
                {link.name}
              </Link>
            ))}
            {!user && (
              <Link
                href="/sign-in"
                onClick={() => setOpen(false)}
                className="py-3 px-6 text-sm bg-blue-600 hover:bg-blue-700 text-center"
              >
                Sign In
              </Link>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
