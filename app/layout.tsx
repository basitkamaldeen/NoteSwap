"use client";

import { useEffect } from "react";
import { ClerkProvider, useUser } from "@clerk/nextjs";
import { Inter } from "next/font/google";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import "./globals.css";
import AIAssistant from "@/components/AIAssistant";
import WelcomeBanner from "@/components/WelcomeBanner";
import FloatingButtons from "@/components/FloatingButtons";



const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <AppLayout>{children}</AppLayout>
    </ClerkProvider>
  );
}

// 👇 This inner component runs inside ClerkProvider
function AppLayout({ children }: { children: React.ReactNode }) {
  const { user } = useUser();

  // ✅ Sync user automatically to Prisma after login
  useEffect(() => {
    if (user) {
      fetch("/api/auth/sync-user", { method: "POST" });
    }
  }, [user]);

  // Optional smooth scroll animation
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <html lang="en">
      <body
        className={`${inter.className} bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white min-h-screen`}
      >
        {/* Navbar */}
        <Navbar />
		<Navbar />
<WelcomeBanner />

<AnimatePresence mode="wait">
  <motion.main>...</motion.main>
</AnimatePresence>


        {/* Page transition animations */}
        <AnimatePresence mode="wait">
          <motion.main
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.6 }}
            className="px-6 md:px-12 pt-28 pb-20 min-h-[80vh]"
          >
            {children}
          </motion.main>
        </AnimatePresence>

        {/* Footer */}
        <Footer />
		<FloatingButtons />
		<AIAssistant />
      </body>
    </html>
  );
}
