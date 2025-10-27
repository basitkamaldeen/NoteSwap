"use client";
import { motion } from "framer-motion";
import { CheckCircle, XCircle } from "lucide-react";

export default function NotificationBanner({ message, type }: { message: string; type: "success" | "error" }) {
  return (
    <motion.div
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: -50, opacity: 0 }}
      className={`fixed top-6 right-6 px-5 py-3 rounded-xl shadow-xl text-white z-50 ${
        type === "success" ? "bg-green-600" : "bg-red-600"
      }`}
    >
      <div className="flex items-center gap-2">
        {type === "success" ? <CheckCircle size={20} /> : <XCircle size={20} />}
        <span>{message}</span>
      </div>
    </motion.div>
  );
}
