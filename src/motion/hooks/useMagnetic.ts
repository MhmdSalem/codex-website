"use client";

import { useEffect, useRef, type RefObject } from "react";
import { gsap, registerGsap } from "../gsap";
import { durations, easings } from "../config";
import { useMotionCapability } from "./useMotionPreference";

interface MagneticOptions {
  /** How far the element follows the pointer, as a fraction of the offset. */
  strength?: number;
  /** Pointer distance in pixels at which the effect engages. */
  radius?: number;
}

/**
 * Pulls an element gently toward the pointer.
 *
 * Disabled on touch devices and under reduced motion, where the effect is
 * either meaningless or unwelcome.
 */
export function useMagnetic<T extends HTMLElement = HTMLButtonElement>({
  strength = 0.35,
  radius = 120,
}: MagneticOptions = {}): RefObject<T | null> {
  const ref = useRef<T>(null);
  const { prefersReducedMotion, isCoarsePointer } = useMotionCapability();

  useEffect(() => {
    const element = ref.current;
    if (!element || prefersReducedMotion || isCoarsePointer) return;

    registerGsap();

    const quickX = gsap.quickTo(element, "x", {
      duration: durations.base,
      ease: easings.outExpo,
    });
    const quickY = gsap.quickTo(element, "y", {
      duration: durations.base,
      ease: easings.outExpo,
    });

    const handleMove = (event: PointerEvent) => {
      const bounds = element.getBoundingClientRect();
      const centerX = bounds.left + bounds.width / 2;
      const centerY = bounds.top + bounds.height / 2;
      const deltaX = event.clientX - centerX;
      const deltaY = event.clientY - centerY;
      const distance = Math.hypot(deltaX, deltaY);

      if (distance > radius + Math.max(bounds.width, bounds.height) / 2) {
        quickX(0);
        quickY(0);
        return;
      }

      quickX(deltaX * strength);
      quickY(deltaY * strength);
    };

    const handleLeave = () => {
      quickX(0);
      quickY(0);
    };

    window.addEventListener("pointermove", handleMove, { passive: true });
    element.addEventListener("pointerleave", handleLeave);

    return () => {
      window.removeEventListener("pointermove", handleMove);
      element.removeEventListener("pointerleave", handleLeave);
      gsap.set(element, { x: 0, y: 0 });
    };
  }, [prefersReducedMotion, isCoarsePointer, strength, radius]);

  return ref;
}
