"use client";

import { FileText, Database, Sparkles, Share2, Search, Brain } from "lucide-react";
import { motion } from "framer-motion";

export function ExtractionVisualization() {
  return (
    <div className="relative w-full h-[400px] flex items-center justify-center overflow-hidden bg-neutral-50/50 dark:bg-neutral-900/20 rounded-3xl border border-neutral-200 dark:border-neutral-800">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-20 bg-white dark:bg-neutral-950 p-6 rounded-2xl shadow-xl border border-neutral-200 dark:border-neutral-800"
      >
        <FileText className="w-12 h-12 text-neutral-900 dark:text-white" />
        <motion.div
          animate={{ opacity: [0, 1, 0], y: -20 }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
          className="absolute -top-4 -right-4"
        >
          <Sparkles className="w-6 h-6 text-neutral-400" />
        </motion.div>
      </motion.div>

      {[
        { Icon: Database, x: 120, y: -80, delay: 0.2 },
        { Icon: Search, x: -120, y: -60, delay: 0.4 },
        { Icon: Brain, x: 140, y: 60, delay: 0.6 },
        { Icon: Share2, x: -100, y: 90, delay: 0.8 },
      ].map(({ Icon, x, y, delay }, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, x: 0, y: 0 }}
          animate={{ opacity: 1, x, y }}
          transition={{ duration: 0.8, delay, type: "spring" }}
          className="absolute z-10 bg-white dark:bg-neutral-950 p-3 rounded-xl shadow-lg border border-neutral-200 dark:border-neutral-800"
        >
          <Icon className="w-5 h-5 text-neutral-600 dark:text-neutral-400" />
        </motion.div>
      ))}

      <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
        {[
          { x2: "calc(50% + 120px)", y2: "calc(50% - 80px)" },
          { x2: "calc(50% - 120px)", y2: "calc(50% - 60px)" },
          { x2: "calc(50% + 140px)", y2: "calc(50% + 60px)" },
          { x2: "calc(50% - 100px)", y2: "calc(50% + 90px)" },
        ].map((coords, i) => (
          <motion.line
            key={i}
            x1="50%"
            y1="50%"
            x2={coords.x2}
            y2={coords.y2}
            stroke="currentColor"
            className="text-neutral-200 dark:text-neutral-800"
            strokeWidth="2"
            strokeDasharray="4 4"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 + i * 0.2 }}
          />
        ))}
      </svg>
      
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
    </div>
  );
}
