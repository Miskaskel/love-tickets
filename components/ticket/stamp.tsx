"use client";

import { motion } from "framer-motion";

export function Stamp() {
  return (
    <motion.div
      className="pointer-events-none absolute inset-0 flex items-center justify-center z-20"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.3 }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 2.4, rotate: -18 }}
        animate={{ opacity: 0.88, scale: 1, rotate: -12 }}
        transition={{ delay: 0.45, duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
        className="select-none"
      >
        <div
          className="font-label text-4xl sm:text-5xl tracking-[0.15em] uppercase text-red-700/80 border-[6px] border-red-700/80 rounded-lg px-6 py-2"
          style={{
            textShadow: "0 0 1px rgba(185,28,28,0.4)",
            mixBlendMode: "multiply",
          }}
        >
          Utilizado
        </div>
      </motion.div>
    </motion.div>
  );
}
