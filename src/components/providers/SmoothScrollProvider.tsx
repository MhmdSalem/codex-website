"use client";

import Lenis from "lenis";
import { usePathname } from "next/navigation";
import { createContext, useContext, useEffect, useMemo, useRef, type ReactNode } from "react";
import { lenisOptions } from "@/motion/config";
import { gsap, registerGsap, ScrollTrigger } from "@/motion/gsap";
import { useMotionCapability } from "@/motion/hooks/useMotionPreference";

interface SmoothScrollProviderProps {
  children: ReactNode;
  /** Site-wide switch from CMS theme settings. */
  enabled?: boolean;
}

export interface SmoothScrollApi {
  /** Suspend scrolling for a full-viewport takeover. */
  stop: () => void;
  /** Hand the scroll back. */
  start: () => void;
  scrollTo: (target: number | string | HTMLElement, immediate?: boolean) => void;
}

const NOOP_API: SmoothScrollApi = {
  stop: () => {},
  start: () => {},
  scrollTo: () => {},
};

const SmoothScrollContext = createContext<SmoothScrollApi>(NOOP_API);

/**
 * Imperative access to the scroll.
 *
 * Falls back to no-ops when Lenis is not running (reduced motion, or the CMS
 * switch is off), so callers never have to branch. Anything that must also work
 * without Lenis — locking the page during the prologue, for instance — has to
 * carry a CSS-side lock as well.
 */
export function useSmoothScroll(): SmoothScrollApi {
  return useContext(SmoothScrollContext);
}

/**
 * Smooth scrolling, driven by Lenis and stepped from GSAP's ticker.
 *
 * Running both from a single requestAnimationFrame loop is what keeps
 * ScrollTrigger in sync with the smoothed scroll position; two independent
 * loops produce visible jitter on pinned sections.
 *
 * Smooth scrolling is switched off entirely under reduced motion, where
 * hijacking the scroll is both disorienting and an accessibility failure.
 */
export function SmoothScrollProvider({ children, enabled = true }: SmoothScrollProviderProps) {
  const lenisRef = useRef<Lenis | null>(null);
  const pathname = usePathname();
  const { prefersReducedMotion } = useMotionCapability();

  const active = enabled && !prefersReducedMotion;

  useEffect(() => {
    if (!active) return;

    registerGsap();

    const lenis = new Lenis({ ...lenisOptions });
    lenisRef.current = lenis;

    const update = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(update);
    gsap.ticker.lagSmoothing(0);

    lenis.on("scroll", ScrollTrigger.update);

    return () => {
      gsap.ticker.remove(update);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [active]);

  // Client-side navigation must land at the top and re-measure every scene.
  useEffect(() => {
    lenisRef.current?.scrollTo(0, { immediate: true });
    ScrollTrigger.refresh();
  }, [pathname]);

  const api = useMemo<SmoothScrollApi>(
    () => ({
      stop: () => lenisRef.current?.stop(),
      start: () => lenisRef.current?.start(),
      scrollTo: (target, immediate = false) => lenisRef.current?.scrollTo(target, { immediate }),
    }),
    [],
  );

  return <SmoothScrollContext.Provider value={api}>{children}</SmoothScrollContext.Provider>;
}
