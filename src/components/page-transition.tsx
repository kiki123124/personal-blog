"use client";

import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";

export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <>
      {children}

      {/* 遮罩：每次路由变化时从顶部扫过再收起 */}
      <AnimatePresence>
        <motion.div
          key={`mask-${pathname}`}
          className="fixed inset-0 z-[90] bg-background pointer-events-none origin-top"
          initial={{ scaleY: 1 }}
          animate={{ scaleY: 0 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        />
      </AnimatePresence>
    </>
  );
}
