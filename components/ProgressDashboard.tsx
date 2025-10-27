"use client";
import { motion } from "framer-motion";
import { BarChart3, Brain, Clock, FileText } from "lucide-react";

export default function ProgressDashboard({ stats }: { stats: any }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/10 p-6 rounded-2xl mt-10 text-white shadow-lg"
    >
      <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
        <BarChart3 /> Productivity Overview
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 bg-blue-600/30 rounded-xl flex flex-col items-center">
          <FileText size={28} />
          <p className="text-lg font-semibold">{stats.notes ?? 0}</p>
          <p className="text-xs text-gray-300">Notes</p>
        </div>
        <div className="p-4 bg-purple-600/30 rounded-xl flex flex-col items-center">
          <Brain size={28} />
          <p className="text-lg font-semibold">{stats.aiUses ?? 0}</p>
          <p className="text-xs text-gray-300">AI Actions</p>
        </div>
        <div className="p-4 bg-green-600/30 rounded-xl flex flex-col items-center">
          <Clock size={28} />
          <p className="text-lg font-semibold">{stats.studyTime ?? 0} min</p>
          <p className="text-xs text-gray-300">Study Time</p>
        </div>
      </div>
    </motion.div>
  );
}
