"use client";

import { useTranslations } from "next-intl";
import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import { createPortal } from "react-dom";

import { useSmoothScroll } from "@/components/providers/SmoothScrollProvider";
import { Logo } from "@/components/ui/Logo";
import {
  CARET_ARRIVE_EVENT,
  OPENING_DONE_EVENT,
  type CaretArriveDetail,
} from "@/experience/caret/pointer";
import { gsap, registerGsap } from "@/motion/gsap";
import { useIsomorphicLayoutEffect } from "@/motion/hooks/useIsomorphicLayoutEffect";

import {
  BAR,
  FORCE_REPLAY,
  openingEase,
  REPLAY_PARAM,
  SESSION_KEY,
  timing,
  TYPE_STEPS,
  WORDMARK_END,
} from "./config";
import styles from "./opening.module.css";

/** `done` is a skipped opening; `finished` is one that played through. */
type Phase = "deciding" | "playing" | "done" | "finished";

function markPlayed(): void {
  try {
    window.sessionStorage.setItem(SESSION_KEY, "1");
  } catch {
    // Storage can be unavailable in private modes; playing again is fine.
  }
}

function replayDeclined(): boolean {
  if (FORCE_REPLAY) return false;
  try {
    return new URLSearchParams(window.location.search).get(REPLAY_PARAM) === "0";
  } catch {
    return false;
  }
}

/**
 * The opening.
 *
 * The gate decides before paint whether the sequence runs at all — on every
 * full load, unless motion is reduced — and marks the
 * document as taken over in that same effect. The hero reads that mark when it
 * mounts, which is how it knows to wait for {@link OPENING_DONE_EVENT} instead
 * of playing its entrance under a black layer nobody can see through.
 */
export function Opening() {
  const [phase, setPhase] = useState<Phase>("deciding");

  useIsomorphicLayoutEffect(() => {
    // Every full load, on every device: the mark being typed is how the site
    // loads. Only a motion-sensitivity preference skips it; `?intro=0` skips it
    // too, for anyone working on the page underneath.
    const skip = window.matchMedia("(prefers-reduced-motion: reduce)").matches || replayDeclined();

    if (skip) {
      markPlayed();
      setPhase("done");
      return;
    }

    document.documentElement.dataset.prologue = "running";
    setPhase("playing");
  }, []);

  const handleFinished = useCallback(() => setPhase("finished"), []);

  // Announced from here rather than from the scene's cleanup: in development
  // React mounts effects twice, and a cleanup-time event would tell the hero to
  // start while the layer is still up. This effect runs once the scene has
  // genuinely unmounted and the document is released. `finished` is distinct
  // from `done` so a skipped opening announces nothing.
  useEffect(() => {
    if (phase === "finished") window.dispatchEvent(new Event(OPENING_DONE_EVENT));
  }, [phase]);

  if (phase !== "playing") return null;

  // Outside `<main>`, which is inert while the opening runs — the skip control
  // has to stay reachable.
  return createPortal(<OpeningScene onFinished={handleFinished} />, document.body);
}

function OpeningScene({ onFinished }: { onFinished: () => void }) {
  const t = useTranslations("prologue");
  const rootRef = useRef<HTMLDivElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLSpanElement>(null);
  const skipRef = useRef<() => void>(() => {});

  const finishedRef = useRef(onFinished);
  useIsomorphicLayoutEffect(() => {
    finishedRef.current = onFinished;
  }, [onFinished]);

  const smoothScroll = useSmoothScroll();
  const handleSkip = useCallback(() => skipRef.current(), []);

  useIsomorphicLayoutEffect(() => {
    const root = rootRef.current;
    const box = boxRef.current;
    const logo = logoRef.current;
    const bar = barRef.current;
    if (!root || !box || !logo || !bar) return;

    registerGsap();
    markPlayed();

    // ---------------------------------------------------------------- takeover
    const previousInert = new Map<HTMLElement, boolean>();
    document.documentElement.dataset.prologue = "running";
    document.querySelectorAll<HTMLElement>("[data-prologue-inert]").forEach((element) => {
      previousInert.set(element, element.inert);
      element.inert = true;
    });
    smoothScroll.stop();

    let leaving = false;

    /** Hands the bar to the caret and lets the layer go. */
    const leave = () => {
      if (leaving) return;
      leaving = true;
      window.clearTimeout(ceiling);

      const rect = bar.getBoundingClientRect();
      const detail: CaretArriveDetail = {
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
      };
      window.dispatchEvent(new CustomEvent<CaretArriveDetail>(CARET_ARRIVE_EVENT, { detail }));

      ctx.add(() => {
        gsap
          .timeline({ onComplete: () => finishedRef.current() })
          .to(bar, { autoAlpha: 0, duration: 0.25, ease: openingEase.out }, 0)
          .to(root, { autoAlpha: 0, duration: timing.exit, ease: openingEase.inOut }, 0);
      });
    };
    skipRef.current = leave;

    // ------------------------------------------------------------------- scene
    const ctx = gsap.context(() => {
      const travel = box.clientWidth * BAR.left;
      const uncover = `inset(0 ${((1 - WORDMARK_END) * 100).toFixed(3)}% 0 0)`;
      const typeEase = `steps(${TYPE_STEPS})`;

      gsap
        .timeline({ defaults: { ease: openingEase.out }, onComplete: leave })
        .to(bar, { autoAlpha: 1, duration: 0.2 }, timing.settle)
        .to(logo, { clipPath: uncover, duration: timing.type, ease: typeEase }, timing.settle + 0.3)
        .to(bar, { x: travel, duration: timing.type, ease: typeEase }, "<")
        .add(() => {
          bar.dataset.blink = "true";
        })
        .to({}, { duration: timing.hold })
        .add(() => {
          bar.dataset.blink = "false";
        })
        .to(logo, { autoAlpha: 0, scale: 0.985, duration: timing.fade, ease: openingEase.inOut });
    }, root);

    // The opening must never trap a visitor: the wall clock ends it if nothing
    // else does.
    const ceiling = window.setTimeout(leave, timing.ceiling * 1000);

    return () => {
      window.clearTimeout(ceiling);
      ctx.revert();

      delete document.documentElement.dataset.prologue;
      previousInert.forEach((wasInert, element) => {
        element.inert = wasInert;
      });
      smoothScroll.scrollTo(0, true);
      smoothScroll.start();
    };
  }, [smoothScroll]);

  const barStyle = {
    "--bar-top": BAR.top,
    "--bar-width": BAR.width,
    "--bar-height": BAR.height,
  } as CSSProperties;

  return (
    <div ref={rootRef} className={styles.root} role="group" aria-label={t("label")}>
      <div ref={boxRef} className={styles.logoBox} aria-hidden="true">
        <div ref={logoRef} className={styles.logo}>
          <Logo className="h-full" />
        </div>
        <span ref={barRef} className={styles.bar} style={barStyle} data-blink="false" />
      </div>

      <button type="button" className={styles.skip} onClick={handleSkip}>
        {t("skip")}
      </button>
    </div>
  );
}
