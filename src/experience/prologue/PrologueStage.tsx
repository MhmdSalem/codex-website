"use client";

import { useTranslations } from "next-intl";
import { useCallback, useEffect, useRef, useState } from "react";

import { useSmoothScroll } from "@/components/providers/SmoothScrollProvider";
import { gsap, registerGsap } from "@/motion/gsap";
import { useIsomorphicLayoutEffect } from "@/motion/hooks/useIsomorphicLayoutEffect";
import { readMotionCapability } from "@/motion/hooks/useMotionPreference";

import { createPrologueAudio, readSoundPreference, type PrologueAudio } from "./audio";
import { driver, enabledScenes, prologueDuration, sceneWindows, stageTuning } from "./config";
import { ParticleField, type ParticleFieldHandle } from "./ParticleField";
import styles from "./Prologue.module.css";
import { getSceneBuilder } from "./scenes";
import { createPointerState, createStageState } from "./state";

interface PrologueStageProps {
  onComplete: () => void;
}

/**
 * The projector.
 *
 * Owns one master timeline, one playhead, and one frame loop. Time and scroll
 * advance the same playhead, so the film plays itself at 1× for a passive
 * viewer and fast-forwards for anyone who scrolls. See docs/prologue.md.
 */
export function PrologueStage({ onComplete }: PrologueStageProps) {
  const t = useTranslations("prologue");

  const rootRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const grainRef = useRef<HTMLDivElement>(null);
  const vignetteRef = useRef<HTMLDivElement>(null);
  const poolRef = useRef<HTMLDivElement>(null);
  const coreRef = useRef<HTMLDivElement>(null);
  const controlsRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<ParticleFieldHandle>(null);

  const audioRef = useRef<PrologueAudio | null>(null);
  const skipRef = useRef<() => void>(() => {});
  // The frame loop is set up once and outlives any re-render, so it reaches the
  // latest callback through a ref rather than closing over a stale one.
  const completeRef = useRef(onComplete);
  useEffect(() => {
    completeRef.current = onComplete;
  }, [onComplete]);

  const [soundOn, setSoundOn] = useState(false);
  const [lowPower, setLowPower] = useState(false);

  const handleSkip = useCallback(() => skipRef.current(), []);

  const handleSound = useCallback(() => {
    if (!audioRef.current) audioRef.current = createPrologueAudio();
    const audio = audioRef.current;

    setSoundOn((current) => {
      if (current) {
        audio.disable();
        return false;
      }
      void audio.enable();
      return true;
    });
  }, []);

  useIsomorphicLayoutEffect(() => {
    const root = rootRef.current;
    const stage = stageRef.current;
    const pool = poolRef.current;
    const core = coreRef.current;
    if (!root || !stage || !pool || !core) return;

    registerGsap();

    const capability = readMotionCapability();
    setLowPower(capability.isLowPower);
    setSoundOn(readSoundPreference());

    const state = createStageState();
    const pointer = createPointerState(window.innerWidth, window.innerHeight);

    // ---------------------------------------------------------------- takeover
    // The film owns the viewport. Lenis is stopped and the document is locked in
    // CSS as well, because Lenis is absent when smooth scroll is switched off.
    const previousChromeInert = new Map<HTMLElement, boolean>();
    document.documentElement.dataset.prologue = "running";
    document.querySelectorAll<HTMLElement>("[data-prologue-inert]").forEach((element) => {
      previousChromeInert.set(element, element.inert);
      element.inert = true;
    });

    // -------------------------------------------------------------- the edit
    const master = gsap.timeline({ paused: true });
    for (const scene of enabledScenes) {
      const build = getSceneBuilder(scene.id);
      if (build) master.add(build({ gsap, state }), scene.start);
    }

    // The escape hatch fades up late, so the opening stays as empty as the
    // brief demands. Keyboard focus overrides this in CSS from the first frame.
    if (controlsRef.current) {
      master.to(controlsRef.current, { opacity: 0.42, duration: 0.6, ease: "power2.out" }, 2.0);
    }

    // ------------------------------------------------------------- the writers
    gsap.set([pool, core], { xPercent: -50, yPercent: -50 });

    const setPoolX = gsap.quickSetter(pool, "x", "px") as (value: number) => void;
    const setPoolY = gsap.quickSetter(pool, "y", "px") as (value: number) => void;
    const setPoolAlpha = gsap.quickSetter(pool, "opacity") as (value: number) => void;
    const setCoreX = gsap.quickSetter(core, "x", "px") as (value: number) => void;
    const setCoreY = gsap.quickSetter(core, "y", "px") as (value: number) => void;
    const setCoreAlpha = gsap.quickSetter(core, "opacity") as (value: number) => void;
    // The camera is written directly rather than through a quickSetter: it is a
    // single transform on a single element, and GSAP's transform cache skips
    // writes it believes are redundant.
    const setCamera = (value: number) => {
      stage.style.transform = `scale3d(${value}, ${value}, 1)`;
    };
    const setGrain = grainRef.current
      ? (gsap.quickSetter(grainRef.current, "opacity") as (value: number) => void)
      : null;
    const setVignette = vignetteRef.current
      ? (gsap.quickSetter(vignetteRef.current, "opacity") as (value: number) => void)
      : null;

    // -------------------------------------------------------------- the driver
    /**
     * While the film is still being shot, the last built scene holds instead of
     * ejecting the visitor. Scene 01 is about discovery, and three seconds is
     * not enough to discover anything — so a partial build lingers and leaves
     * only on an explicit scroll or skip. The finished film exits on its own.
     */
    const holdAtEnd = enabledScenes.length < sceneWindows.length;

    let playhead = 0;
    /** Scroll banked but not yet spent, in seconds of film. */
    let pending = 0;
    let mode: "play" | "skip" | "exit" = "play";
    let elapsed = 0;

    const bankScroll = (pixels: number) => {
      if (mode !== "play" || pixels <= 0) return;
      pending += (pixels / driver.scrollDistance) * prologueDuration;
    };

    const onFrame = (_time: number, deltaTime: number) => {
      // Clamped so a stalled tab does not jump the film forward on return.
      const delta = Math.min(deltaTime / 1000, 0.05);
      elapsed += delta;

      // A film does not play to an empty room. Opening the site in a background
      // tab must not burn the opening; the playhead waits for an audience.
      if (mode === "play" && !document.hidden) {
        const drain = pending * driver.scrollDrain;
        pending -= drain;
        playhead = Math.min(prologueDuration, playhead + delta + drain);
      }

      master.time(playhead);

      // Nobody has moved a pointer: the light drifts on its own so the world
      // still breathes, and still reveals, on touch and for passive viewers.
      if (!pointer.engaged) {
        const width = window.innerWidth;
        const height = window.innerHeight;
        pointer.targetX = width / 2 + Math.sin(elapsed * 0.34) * width * 0.16;
        pointer.targetY = height / 2 + Math.cos(elapsed * 0.23) * height * 0.13;
      }

      pointer.x += (pointer.targetX - pointer.x) * stageTuning.pointerLerp;
      pointer.y += (pointer.targetY - pointer.y) * stageTuning.pointerLerp;

      setPoolX(pointer.x);
      setPoolY(pointer.y);
      setCoreX(pointer.x);
      setCoreY(pointer.y);

      const fade = 1 - state.exit;
      setPoolAlpha(state.light * fade);
      // The core is dimmer than the pool it casts until the visitor takes hold
      // of it — an unheld light should not look like a cursor.
      setCoreAlpha(state.light * fade * (pointer.engaged ? 0.85 : 0.35));
      setCamera(1 + state.camera * stageTuning.cameraPush);
      setGrain?.(state.grain * fade * stageTuning.grainOpacity);
      setVignette?.(state.vignette);

      particlesRef.current?.render(state, pointer, delta);

      if (mode === "play" && playhead >= prologueDuration && (!holdAtEnd || pending > 0.05)) {
        exit();
      }
    };

    // ---------------------------------------------------------------- the exits
    const skip = () => {
      if (mode !== "play") return;
      mode = "skip";
      // Choreographed, not a cut: a hard jump would waste the handoff.
      const proxy = { time: playhead };
      gsap.to(proxy, {
        time: prologueDuration,
        duration: driver.skipDuration,
        ease: "circ.inOut",
        onUpdate: () => {
          playhead = proxy.time;
        },
        onComplete: exit,
      });
    };
    skipRef.current = skip;

    function exit() {
      if (mode === "exit") return;
      mode = "exit";

      gsap
        .timeline({ onComplete: () => completeRef.current() })
        .to(
          state,
          { exit: 1, particles: 0, duration: driver.exitDuration, ease: "power2.inOut" },
          0,
        )
        .to(root, { opacity: 0, duration: driver.exitDuration, ease: "power2.inOut" }, 0);
    }

    // ----------------------------------------------------------- the listeners
    const onPointerMove = (event: PointerEvent) => {
      pointer.targetX = event.clientX;
      pointer.targetY = event.clientY;
      pointer.engaged = true;
    };

    const onWheel = (event: WheelEvent) => bankScroll(Math.abs(event.deltaY));

    let touchY: number | null = null;
    const onTouchStart = (event: TouchEvent) => {
      touchY = event.touches[0]?.clientY ?? null;
      const touch = event.touches[0];
      if (touch) {
        pointer.targetX = touch.clientX;
        pointer.targetY = touch.clientY;
        pointer.engaged = true;
      }
    };
    const onTouchMove = (event: TouchEvent) => {
      const touch = event.touches[0];
      if (!touch) return;
      if (touchY !== null) bankScroll(Math.abs(touchY - touch.clientY) * 2.2);
      touchY = touch.clientY;
      pointer.targetX = touch.clientX;
      pointer.targetY = touch.clientY;
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        skip();
        return;
      }
      // Keyboard gets the same shuttle a wheel does.
      if ([" ", "ArrowDown", "PageDown", "Enter"].includes(event.key)) {
        if (event.key === "Enter" && document.activeElement !== document.body) return;
        if (event.key === " " && document.activeElement !== document.body) return;
        event.preventDefault();
        bankScroll(driver.scrollDistance * driver.keyStep);
      }
    };

    gsap.ticker.add(onFrame);
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("wheel", onWheel, { passive: true });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("keydown", onKeyDown);

    return () => {
      gsap.ticker.remove(onFrame);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("keydown", onKeyDown);

      gsap.killTweensOf(state);
      master.kill();

      delete document.documentElement.dataset.prologue;
      previousChromeInert.forEach((wasInert, element) => {
        element.inert = wasInert;
      });

      audioRef.current?.dispose();
      audioRef.current = null;
    };
  }, []);

  // Lenis is stopped for the life of the stage and handed back on unmount.
  const smoothScroll = useSmoothScroll();
  useIsomorphicLayoutEffect(() => {
    smoothScroll.stop();
    return () => {
      smoothScroll.scrollTo(0, true);
      smoothScroll.start();
    };
  }, [smoothScroll]);

  return (
    <div ref={rootRef} className={styles.root} role="group" aria-label={t("label")}>
      {/*
        The film is decorative and hidden from assistive technology — the whole
        homepage sits complete in the DOM beneath it. The escape hatch is not
        decorative, so it lives outside the hidden branch: putting focusable
        controls inside an aria-hidden subtree is what strands keyboard users.
      */}
      <div ref={stageRef} className={styles.stage} aria-hidden="true">
        <ParticleField ref={particlesRef} className={styles.canvas} lowPower={lowPower} />
        <div ref={poolRef} className={styles.pool} />
        <div ref={coreRef} className={styles.core} />
      </div>

      <div ref={vignetteRef} className={styles.vignette} aria-hidden="true" />
      <div ref={grainRef} className={styles.grain} aria-hidden="true" />

      <div ref={controlsRef} className={styles.controls}>
        <button
          type="button"
          className={styles.control}
          onClick={handleSound}
          aria-pressed={soundOn}
        >
          {soundOn ? t("soundOn") : t("soundOff")}
        </button>
        <button type="button" className={styles.control} onClick={handleSkip}>
          {t("skip")}
        </button>
      </div>
    </div>
  );
}
