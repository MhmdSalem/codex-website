import type { Variants } from "motion/react";
import { bezier, durations, staggers } from "./config";

/**
 * Reusable Motion variants for component-level animation.
 *
 * Scroll-driven, timeline-based and pinned scenes belong to GSAP; Motion
 * handles enter/exit, layout and interaction states. Keeping the two split
 * along that line avoids two libraries fighting over the same element.
 */

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: durations.slow, ease: bezier.outExpo },
  },
};

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: durations.slow, ease: bezier.outExpo },
  },
};

export const maskUp: Variants = {
  hidden: { y: "110%" },
  visible: {
    y: "0%",
    transition: { duration: durations.reveal, ease: bezier.outExpo },
  },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.96 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: durations.slow, ease: bezier.outExpo },
  },
};

/** Parent wrapper that releases its children one after another. */
export function stagger(step: number = staggers.base, delay = 0): Variants {
  return {
    hidden: {},
    visible: {
      transition: { staggerChildren: step, delayChildren: delay },
    },
  };
}

/** Standard viewport options: fire once, slightly before the element lands. */
export const viewportOnce = { once: true, amount: 0.25, margin: "0px 0px -10% 0px" } as const;
