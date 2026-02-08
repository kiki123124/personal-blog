"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

export function LoadingScreen() {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(false), 2800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-neutral-950"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
        >
          {/* 用 div 包裹 SVG 启用硬件加速 */}
          <div className="relative">
            <svg
              viewBox="0 0 400 120"
              width="400"
              height="120"
              className="overflow-visible"
            >
              {/* Kiki */}
              <motion.text
                x="20"
                y="85"
                fontSize="72"
                fontFamily="serif"
                fontWeight="bold"
                fill="none"
                stroke="#f59e0b"
                strokeWidth="1.5"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 1.2, ease: "easeInOut" }}
              >
                Kiki
              </motion.text>

              {/* Luo */}
              <motion.text
                x="220"
                y="85"
                fontSize="72"
                fontFamily="serif"
                fontWeight="bold"
                fill="none"
                stroke="#e5e5e5"
                strokeWidth="1.5"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 1.2, ease: "easeInOut", delay: 0.5 }}
              >
                Luo
              </motion.text>

              {/* 装饰线 */}
              <motion.line
                x1="20"
                y1="100"
                x2="380"
                y2="100"
                stroke="#f59e0b"
                strokeWidth="1"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.8, delay: 1.4, ease: "easeInOut" }}
              />
            </svg>

            {/* 副标题 */}
            <motion.p
              className="text-center text-neutral-500 text-sm tracking-widest uppercase mt-4"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.8, duration: 0.5 }}
            >
              Reader · Writer
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
