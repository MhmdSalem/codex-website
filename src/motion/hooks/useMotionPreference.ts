"use client";

import { useEffect, useState } from "react";

export type MotionTier = "full" | "reduced" | "none";

export interface MotionCapability {
  /** The user asked for less motion, at the OS level. */
  prefersReducedMotion: boolean;
  /** A touch or stylus device with no precise pointer. */
  isCoarsePointer: boolean;
  /** Few CPU cores or a narrow viewport — scale scenes down. */
  isLowPower: boolean;
  /** What the motion layer is allowed to do. */
  tier: MotionTier;
}

const DEFAULT_CAPABILITY: MotionCapability = {
  prefersReducedMotion: false,
  isCoarsePointer: false,
  isLowPower: false,
  tier: "full",
};

/**
 * Synchronous capability read, for imperative setup that must not wait for a
 * React state update — a scene that re-initialises when the hook settles would
 * restart its timeline one frame after mounting.
 */
export function readMotionCapability(): MotionCapability {
  return readCapability();
}

function readCapability(): MotionCapability {
  if (typeof window === "undefined") return DEFAULT_CAPABILITY;

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isCoarsePointer = window.matchMedia("(pointer: coarse)").matches;
  const cores = navigator.hardwareConcurrency ?? 8;
  const isLowPower = cores <= 4 || window.innerWidth < 768;

  return {
    prefersReducedMotion,
    isCoarsePointer,
    isLowPower,
    tier: prefersReducedMotion ? "none" : isLowPower ? "reduced" : "full",
  };
}

/**
 * The single source of truth for "how much motion is appropriate right now".
 *
 * Every scene reads this before building a timeline. Server output assumes
 * full motion but renders the final visual state, so nothing depends on JS to
 * become visible.
 */
export function useMotionCapability(): MotionCapability {
  const [capability, setCapability] = useState<MotionCapability>(DEFAULT_CAPABILITY);

  useEffect(() => {
    const update = () => setCapability(readCapability());
    update();

    const queries = [
      window.matchMedia("(prefers-reduced-motion: reduce)"),
      window.matchMedia("(pointer: coarse)"),
    ];

    queries.forEach((query) => query.addEventListener("change", update));
    window.addEventListener("resize", update, { passive: true });

    return () => {
      queries.forEach((query) => query.removeEventListener("change", update));
      window.removeEventListener("resize", update);
    };
  }, []);

  return capability;
}

/** Convenience wrapper when only the reduced-motion flag matters. */
export function usePrefersReducedMotion(): boolean {
  return useMotionCapability().prefersReducedMotion;
}
