"use client";

import { useRef, type DependencyList, type RefObject } from "react";
import { gsap, registerGsap } from "../gsap";
import { useIsomorphicLayoutEffect } from "./useIsomorphicLayoutEffect";
import { useMotionCapability, type MotionCapability } from "./useMotionPreference";

interface GsapScopeContext {
  gsap: typeof gsap;
  /** Scoped selector: only matches elements inside the container. */
  q: (selector: string) => Element[];
  container: HTMLElement;
  capability: MotionCapability;
}

/**
 * Runs a GSAP scene inside a scoped context and tears it down automatically.
 *
 * Every tween, timeline and ScrollTrigger created inside the callback is
 * reverted on unmount and on dependency change, which is what makes scenes
 * safe across client-side navigation and React Strict Mode double-invokes.
 *
 * The scene is skipped when the user prefers reduced motion, so the
 * server-rendered markup — which is always the final visual state — stands.
 * Scenes must therefore animate *from* a hidden state, never *to* one.
 */
export function useGsapScope<T extends HTMLElement = HTMLDivElement>(
  scene: (context: GsapScopeContext) => void | (() => void),
  dependencies: DependencyList = [],
): RefObject<T | null> {
  const containerRef = useRef<T>(null);
  const capability = useMotionCapability();

  // `scene` is intentionally excluded from the dependencies: it is a new
  // function on every render, and callers control re-runs via `dependencies`.
  useIsomorphicLayoutEffect(() => {
    const container = containerRef.current;
    if (!container || capability.prefersReducedMotion) return;

    registerGsap();

    const context = gsap.context((self) => {
      const q = (selector: string): Element[] => self.selector?.(selector) ?? [];
      return scene({ gsap, q, container, capability });
    }, container);

    return () => {
      context.revert();
    };
  }, [capability.prefersReducedMotion, capability.tier, ...dependencies]);

  return containerRef;
}
