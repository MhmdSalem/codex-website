"use client";

import dynamic from "next/dynamic";
import { useCallback, useState } from "react";
import { createPortal } from "react-dom";

import { useIsomorphicLayoutEffect } from "@/motion/hooks/useIsomorphicLayoutEffect";

import { SESSION_KEY } from "./config";

/**
 * Code-split off the homepage route: the film is a one-time overlay and must
 * not sit in the bundle every returning visitor downloads to read the page.
 */
const PrologueStage = dynamic(() => import("./PrologueStage").then((m) => m.PrologueStage), {
  ssr: false,
});

type Phase = "deciding" | "playing" | "done";

function hasPlayed(): boolean {
  try {
    return window.sessionStorage.getItem(SESSION_KEY) === "1";
  } catch {
    // Storage can be unavailable in private modes. Playing again is a nicer
    // failure than never playing.
    return false;
  }
}

function markPlayed(): void {
  try {
    window.sessionStorage.setItem(SESSION_KEY, "1");
  } catch {
    // Ignored, as above.
  }
}

/**
 * THE FIRST LINE — the gate.
 *
 * Decides whether the film runs at all. The decision happens in a layout
 * effect, before paint, so a returning visitor never sees a frame of it and a
 * first-time visitor never sees the homepage flash underneath.
 */
export function Prologue() {
  const [phase, setPhase] = useState<Phase>("deciding");

  useIsomorphicLayoutEffect(() => {
    // Reduced motion does not get a shortened film. It gets no film.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      markPlayed();
      setPhase("done");
      return;
    }

    if (hasPlayed()) {
      setPhase("done");
      return;
    }

    setPhase("playing");
  }, []);

  const handleComplete = useCallback(() => {
    markPlayed();
    setPhase("done");
  }, []);

  if (phase !== "playing") return null;

  // Portalled to the body so the film sits outside `<main>`, which is marked
  // inert while it runs — the skip control has to stay reachable.
  return createPortal(<PrologueStage onComplete={handleComplete} />, document.body);
}
