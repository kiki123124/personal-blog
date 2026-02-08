"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

const letters = ["K", "i", "k", "i", " ", "L", "u", "o"];

export function LoadingScreen() {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-background"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.8, ease: "easeInOut" } }}
        >
          <div className="relative flex flex-col items-center">
            {/* 字母逐个弹入 */}
            <div className="flex items-end gap-1">
              {letters.map((letter, i) => (
                <motion.span
                  key={i}
                  className={`font-serif italic text-6xl md:text-7xl text-foreground ${
                    letter === " " ? "w-4" : ""
                  } ${i >= 5 ? "text-amber-500" : ""}`}
                  initial={{ opacity: 0, y: 40, rotate: -8 }}
                  animate={{
                    opacity: 1,
                    y: 0,
                    rotate: i % 2 === 0 ? 1 : -1,
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 200,
                    damping: 12,
                    delay: i * 0.08,
                  }}
                >
                  {letter}
                </motion.span>
              ))}
            </div>

            {/* 下划线描边动画 */}
            <div className="mt-3 overflow-hidden">
              <svg viewBox="0 0 300 12" width="300" height="12">
                <motion.path
                  d="M 0 6 Q 75 2 150 6 Q 225 10 300 6"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  className="text-amber-500"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1, delay: 0.8, ease: "easeInOut" }}
                />
              </svg>
            </div>

            {/* 副标题 */}
            <motion.p
              className="text-muted-foreground text-xs tracking-[0.3em] uppercase mt-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.6, duration: 0.6 }}
            >
              Reader · Writer
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
