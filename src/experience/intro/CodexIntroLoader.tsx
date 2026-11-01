"use client";

import { useTranslations } from "next-intl";
import { useCallback, useRef, useState } from "react";
import { createPortal } from "react-dom";

import { useSmoothScroll } from "@/components/providers/SmoothScrollProvider";
import { gsap, registerGsap } from "@/motion/gsap";
import { useIsomorphicLayoutEffect } from "@/motion/hooks/useIsomorphicLayoutEffect";

import styles from "./CodexIntro.module.css";
import {
  FORCE_REPLAY,
  introExit,
  introGuards,
  introVideoSrc,
  REPLAY_PARAM,
  resolveIntroVideoSrc,
  SESSION_KEY,
} from "./config";

type Phase = "deciding" | "playing" | "done";

function hasPlayed(): boolean {
  try {
    return window.sessionStorage.getItem(SESSION_KEY) === "1";
  } catch {
    // Storage is unavailable in some private modes. Playing again is a nicer
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

/** `?intro=1` replays the film without a rebuild, production builds included. */
function replayRequested(): boolean {
  if (FORCE_REPLAY) return true;
  try {
    return new URLSearchParams(window.location.search).has(REPLAY_PARAM);
  } catch {
    return false;
  }
}

/**
 * The CODEX TECH intro film.
 *
 * A fullscreen layer over a homepage that is already rendered underneath it, so
 * the handoff when the film ends is a fade rather than a load. Place it on the
 * homepage only.
 *
 * This component is the gate: it decides whether the film runs at all, in a
 * layout effect before paint, so a returning visitor never sees a frame and a
 * first-time visitor never sees the homepage flash. The layer itself mounts only
 * while the film is playing, which keeps every side effect it takes on tied to a
 * single mount and unmount.
 */
export function CodexIntroLoader() {
  const [phase, setPhase] = useState<Phase>("deciding");
  const [src, setSrc] = useState(introVideoSrc);

  useIsomorphicLayoutEffect(() => {
    // An autoplaying fullscreen film is the exact thing a motion-sensitivity
    // preference is asking us not to do. It is skipped rather than shortened.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      markPlayed();
      setPhase("done");
      return;
    }

    // A fullscreen film on a phone covers the first read and often fails to
    // autoplay. The homepage is the opening there.
    if (window.matchMedia("(max-width: 47.999rem)").matches) {
      markPlayed();
      setPhase("done");
      return;
    }

    if (!replayRequested() && hasPlayed()) {
      setPhase("done");
      return;
    }

    // Batched with the phase change, so the layer's first render already carries
    // the right cut and neither file is requested speculatively.
    setSrc(resolveIntroVideoSrc());
    setPhase("playing");
  }, []);

  const handleFinished = useCallback(() => setPhase("done"), []);

  if (phase !== "playing") return null;

  // Portalled to the body so the film sits outside `<main>`, which is marked
  // inert while it runs — the skip control has to stay reachable.
  return createPortal(<IntroFilm src={src} onFinished={handleFinished} />, document.body);
}

function IntroFilm({ src, onFinished }: { src: string; onFinished: () => void }) {
  const t = useTranslations("prologue");
  const rootRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const skipRef = useRef<() => void>(() => {});

  // The effect below runs once and outlives re-renders, so it reaches the latest
  // callback through a ref rather than closing over a stale one.
  const finishedRef = useRef(onFinished);
  useIsomorphicLayoutEffect(() => {
    finishedRef.current = onFinished;
  }, [onFinished]);

  const smoothScroll = useSmoothScroll();
  const handleSkip = useCallback(() => skipRef.current(), []);

  useIsomorphicLayoutEffect(() => {
    const root = rootRef.current;
    const video = videoRef.current;
    if (!root || !video) return;

    registerGsap();

    // A refresh part-way through the film should land on the homepage, so the
    // session is marked as the film starts rather than when it ends.
    markPlayed();

    // ---------------------------------------------------------------- takeover
    // Lenis is stopped and the document is locked in CSS as well, because Lenis
    // is absent under reduced motion and when the CMS switch is off. Site chrome
    // is suppressed and backgrounded rather than unmounted, so the homepage
    // stays complete for crawlers and assistive technology throughout.
    const previousInert = new Map<HTMLElement, boolean>();
    document.documentElement.dataset.prologue = "running";
    document.querySelectorAll<HTMLElement>("[data-prologue-inert]").forEach((element) => {
      previousInert.set(element, element.inert);
      element.inert = true;
    });
    smoothScroll.stop();

    const ctx = gsap.context(() => {}, root);
    let ceiling: number | undefined;
    let runtime: number | undefined;
    let leaving = false;
    let torndown = false;

    const clearTimers = () => {
      if (ceiling !== undefined) window.clearTimeout(ceiling);
      if (runtime !== undefined) window.clearTimeout(runtime);
      ceiling = undefined;
      runtime = undefined;
    };

    const leave = () => {
      if (leaving) return;
      leaving = true;
      clearTimers();

      ctx.add(() => {
        gsap.to(root, {
          opacity: 0,
          scale: introExit.scale,
          duration: introExit.duration,
          ease: introExit.ease,
          onComplete: () => finishedRef.current(),
        });
      });
    };
    skipRef.current = leave;

    // ------------------------------------------------------------------ guards
    // Until a real duration is known the only thing that can save a stuck film
    // is the wall clock.
    ceiling = window.setTimeout(leave, introGuards.ceilingSeconds * 1000);

    /** Replaces the blind ceiling with the film's actual remaining runtime. */
    const armRuntimeGuard = () => {
      if (runtime !== undefined) return;
      const total = video.duration;
      if (!Number.isFinite(total) || total <= 0) return;

      if (ceiling !== undefined) {
        window.clearTimeout(ceiling);
        ceiling = undefined;
      }
      const remaining = Math.max(0, total - video.currentTime) + introGuards.graceSeconds;
      runtime = window.setTimeout(leave, remaining * 1000);
    };

    video.addEventListener("ended", leave);
    video.addEventListener("error", leave);
    video.addEventListener("playing", armRuntimeGuard);

    // ---------------------------------------------------------------- playback
    // Set imperatively as well as in the markup: React does not always reflect
    // `muted` onto the element, and an unmuted video is refused autoplay.
    video.muted = true;
    void video.play().catch((error: unknown) => {
      // Pausing a video whose play() has not yet settled rejects that promise
      // with AbortError. React's development double-invoke tears this effect down
      // and sets it up again mid-play, so the first attempt always rejects that
      // way — the film is not blocked, it is being replaced. Only a genuine
      // refusal, NotAllowedError, is a reason to give up.
      if (torndown) return;
      if (error instanceof DOMException && error.name === "AbortError") return;
      leave();
    });

    return () => {
      torndown = true;
      clearTimers();
      video.removeEventListener("ended", leave);
      video.removeEventListener("error", leave);
      video.removeEventListener("playing", armRuntimeGuard);
      // Stops the decoder rather than leaving it running behind the homepage.
      video.pause();

      ctx.revert();

      delete document.documentElement.dataset.prologue;
      previousInert.forEach((wasInert, element) => {
        element.inert = wasInert;
      });
      smoothScroll.scrollTo(0, true);
      smoothScroll.start();
    };
  }, [smoothScroll]);

  return (
    <div ref={rootRef} className={styles.root} role="group" aria-label={t("label")}>
      {/*
        The film is decorative — the homepage sits complete in the DOM beneath
        it. The escape hatch is not, so it lives outside the hidden element:
        focusable controls inside an aria-hidden subtree are what strand
        keyboard users.
      */}
      <video
        ref={videoRef}
        className={styles.video}
        src={src}
        autoPlay
        muted
        playsInline
        preload="auto"
        disablePictureInPicture
        aria-hidden="true"
      />

      <button type="button" className={styles.skip} onClick={handleSkip}>
        {t("skip")}
      </button>
    </div>
  );
}
