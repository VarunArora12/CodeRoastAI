"use client";

import { motion, type HTMLMotionProps } from "framer-motion";
import type { ReactNode } from "react";

type FadeInProps = HTMLMotionProps<"div"> & {
  children: ReactNode;
  delay?: number;
};

export function FadeIn({ children, delay = 0, ...props }: FadeInProps) {
  return (
    <motion.div
      animate={{ opacity: 1, y: 0 }}
      initial={false}
      transition={{ duration: 0.45, delay, ease: [0.16, 1, 0.3, 1] }}
      {...props}
    >
      {children}
    </motion.div>
  );
}
