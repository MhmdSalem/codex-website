"use client";

import { motion, type Variants } from "framer-motion";
import { type ReactNode } from "react";

type RevealProps = {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  once?: boolean;
};

const variants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: (custom: { delay: number; y: number }) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: custom.delay,
      duration: 0.7,
      ease: [0.16, 1, 0.3, 1],
    },
  }),
};

export function Reveal({
  children,
  delay = 0,
  y = 30,
  className,
  once = true,
}: RevealProps) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin: "-80px" }}
      variants={variants}
      custom={{ delay, y }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
