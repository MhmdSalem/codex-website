"use client";

import { durations, scrollTriggerDefaults, staggers } from "../config";
import { SplitText } from "../gsap";
import { useGsapScope } from "./useGsapScope";

type RevealUnit = "lines" | "words" | "chars";

interface TextRevealOptions {
  /** What to split the copy into before revealing. */
  unit?: RevealUnit;
  /** Seconds between units. */
  stagger?: number;
  /** Delay before the reveal starts, in seconds. */
  delay?: number;
  /** Start the reveal on scroll instead of immediately. */
  onScroll?: boolean;
}

/**
 * Masked text reveal.
 *
 * The element is split with GSAP's SplitText (free since GSAP 3.13), each unit
 * is wrapped in an overflow-clipped line, and the units slide up from below.
 * `revert()` restores the original nodes so screen readers, copy-paste and
 * re-splits on resize all behave.
 */
export function useTextReveal<T extends HTMLElement = HTMLDivElement>({
  unit = "lines",
  stagger = staggers.base,
  delay = 0,
  onScroll = true,
}: TextRevealOptions = {}) {
  return useGsapScope<T>(
    ({ gsap, container }) => {
      const split = new SplitText(container, {
        type: unit,
        mask: unit,
        linesClass: "reveal-line",
      });

      const targets = split[unit];
      if (!targets || targets.length === 0) return;

      gsap.from(targets, {
        yPercent: 110,
        duration: durations.reveal,
        stagger,
        delay,
        ...(onScroll ? { scrollTrigger: { trigger: container, ...scrollTriggerDefaults } } : {}),
      });

      return () => split.revert();
    },
    [unit, stagger, delay, onScroll],
  );
}
