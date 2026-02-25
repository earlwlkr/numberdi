"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

export function Countdown({ startedAt }: { startedAt: number }) {
  const [count, setCount] = useState<number | "GO!" | null>(null);

  useEffect(() => {
    function tick() {
      const elapsed = Date.now() - startedAt;
      if (elapsed < 1000) setCount(3);
      else if (elapsed < 2000) setCount(2);
      else if (elapsed < 3000) setCount(1);
      else if (elapsed < 4000) setCount("GO!");
      else setCount(null);
    }
    tick();
    const interval = setInterval(tick, 50);
    return () => clearInterval(interval);
  }, [startedAt]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <AnimatePresence mode="wait">
        {count !== null && (
          <motion.div
            key={String(count)}
            initial={{ scale: 0.3, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 2, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="text-9xl font-black text-white drop-shadow-2xl"
          >
            {count}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
