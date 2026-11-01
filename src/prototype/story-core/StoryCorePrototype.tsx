"use client";

import { useEffect, useRef } from "react";

import { cn } from "@/lib/utils";
import { registerGsap, ScrollTrigger } from "@/motion/gsap";

import { Icon } from "./Icon";
import {
  absorbed,
  choreograph,
  FRAGMENTS,
  fragmentPull,
  lerp,
  noise,
  OPENING,
  SETTLED,
  type Stage,
} from "./stage";
import styles from "./story-core.module.css";

type Rgb = [number, number, number];

/** Viewport heights of scrolling the scene takes from start to finish. */
const SCROLL_LENGTH = 3.4;
/** Ambient dust. The only thing in the scene that is decoration. */
const DUST = 70;
const DUST_LOW = 28;
/** Data packets per path. Three reads as flow; more reads as a barcode. */
const PACKETS = 3;
const MAX_PIXEL_RATIO = 1.5;
/** Where the core sits, as a fraction of the stage height. */
const CORE_Y = 0.44;
/** Frozen clock for the reduced-motion frame: late enough to look settled. */
const STILL_CLOCK = 9;

function hexToRgb(value: string): Rgb {
  const hex = value.replace("#", "").trim();
  const full =
    hex.length === 3
      ? hex
          .split("")
          .map((char) => char + char)
          .join("")
      : hex;
  const int = Number.parseInt(full || "ffffff", 16);
  return [(int >> 16) & 255, (int >> 8) & 255, int & 255];
}

function rgba([r, g, b]: Rgb, alpha: number) {
  return `rgba(${Math.round(r)},${Math.round(g)},${Math.round(b)},${alpha})`;
}

/** One soft dot, pre-rendered. Every glow in the scene is this sprite, scaled. */
function makeGlow(colour: Rgb, size: number) {
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const context = canvas.getContext("2d");
  if (!context) return canvas;

  const half = size / 2;
  const gradient = context.createRadialGradient(half, half, 0, half, half, half);
  gradient.addColorStop(0, rgba(colour, 1));
  gradient.addColorStop(0.3, rgba(colour, 0.22));
  gradient.addColorStop(1, rgba(colour, 0));
  context.fillStyle = gradient;
  context.fillRect(0, 0, size, size);
  return canvas;
}

/** Point on a quadratic curve, one axis at a time. */
const quad = (from: number, control: number, to: number, t: number) => {
  const inverse = 1 - t;
  return inverse * inverse * from + 2 * inverse * t * control + t * t * to;
};

interface Anchor {
  x: number;
  y: number;
  /** How far this fragment has travelled toward the core. */
  pull: number;
  /** How far into the core it has gone. */
  gone: number;
}

/**
 * Story Core — a motion prototype.
 *
 * One continuous scene, three states, and one object that survives all three:
 * a software core. The scene is pinned and scrubbed, so the scroll is a
 * transport control rather than a sequence of triggers — every frame is a pure
 * function of one number, which is why scrolling back up plays the
 * transformation backwards instead of leaving debris on screen.
 *
 * The division of labour:
 *
 *   GSAP timeline  →  scrubs the seven numbers in `Stage` from scroll position,
 *                     and tweens the copy and the dashboard chrome.
 *   Render loop    →  reads those numbers and draws the core, the paths, the
 *                     packets and the dust; positions the five plates and the
 *                     travelling mark.
 *
 * Nothing is drawn twice and nothing is animated in two places, so a plate and
 * the line feeding it can never disagree about where the plate is.
 *
 * 2D canvas, not WebGL: the scene is one sprite, five curves, fifteen packets
 * and seventy dots. A renderer and a scene graph would be a dependency added to
 * draw the same pixels on the same GPU.
 */
export function StoryCorePrototype() {
  const rootRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const glyphRef = useRef<HTMLSpanElement>(null);
  const slotRef = useRef<HTMLSpanElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const chaosNoteRef = useRef<HTMLParagraphElement>(null);
  const dashNoteRef = useRef<HTMLParagraphElement>(null);
  const cueRef = useRef<HTMLDivElement>(null);
  const dashRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const stageEl = stageRef.current;
    const canvas = canvasRef.current;
    const glyph = glyphRef.current;
    const slot = slotRef.current;
    const headline = headlineRef.current;
    const chaosNote = chaosNoteRef.current;
    const dashNote = dashNoteRef.current;
    const cue = cueRef.current;
    const dashboard = dashRef.current;
    if (
      !root ||
      !stageEl ||
      !canvas ||
      !glyph ||
      !slot ||
      !headline ||
      !chaosNote ||
      !dashNote ||
      !cue ||
      !dashboard
    ) {
      return;
    }

    const context = canvas.getContext("2d", { alpha: true });
    if (!context) return;

    const gsap = registerGsap();
    const plates = Array.from(stageEl.querySelectorAll<HTMLElement>("[data-plate]"));
    const dashRows = Array.from(dashboard.querySelectorAll<HTMLElement>("[data-row]"));
    const spark = dashboard.querySelector<SVGPathElement>("[data-spark]");

    const documentRoot = document.documentElement;
    const token = (name: string, fallback: string) =>
      getComputedStyle(documentRoot).getPropertyValue(name).trim() || fallback;

    const bone = hexToRgb(token("--color-bone", "#ece9e2"));
    const signal = hexToRgb(token("--color-signal", "#d77758"));
    const glowWarm = makeGlow(signal, 128);
    const glowWhite = makeGlow([255, 255, 255], 128);

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const lowPower = window.matchMedia("(max-width: 47.9375rem)");

    /** The scene's whole state. The timeline writes it, the loop reads it. */
    const stage: Stage = { ...OPENING };
    const anchors: Anchor[] = FRAGMENTS.map(() => ({ x: 0, y: 0, pull: 0, gone: 0 }));

    let width = 0;
    let height = 0;
    let pixelRatio = 0;
    let clock = 0;
    let dust = DUST;
    /** Set by whichever mode is running, for when the stage changes size. */
    let onResized: (() => void) | null = null;

    /**
     * Match the backing store to the box. Returns whether anything changed.
     *
     * The early exit is not an optimisation: assigning `canvas.width` clears the
     * canvas even when the value is identical, and this runs from a
     * ResizeObserver that fires once on observe. Without it, the single frame
     * drawn for reduced motion is wiped a tick after it is painted.
     */
    const measure = () => {
      dust = lowPower.matches ? DUST_LOW : DUST;

      const nextWidth = canvas.clientWidth;
      const nextHeight = canvas.clientHeight;
      const ratio = Math.min(window.devicePixelRatio || 1, MAX_PIXEL_RATIO);
      if (!nextWidth || !nextHeight) return false;
      if (nextWidth === width && nextHeight === height && ratio === pixelRatio) return false;

      width = nextWidth;
      height = nextHeight;
      pixelRatio = ratio;

      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);
      context.setTransform(ratio, 0, 0, ratio, 0, 0);

      /*
        The mark's type size is set here and only here.

        It is scaled every frame instead, because a font-size written 60 times a
        second relayouts the text on every one of them, while a transform does
        not touch layout at all.
      */
      glyph.style.setProperty("--glyph-size", `${(Math.min(width, height) * 0.08).toFixed(1)}px`);
      return true;
    };

    const draw = (delta: number) => {
      if (!width || !height) return;

      const still = reduceMotion.matches;
      // The core's own clock runs faster when it is working, which is what makes
      // the pull phase read as effort rather than as the same loop sped up.
      clock += delta * (0.6 + stage.energy * 0.7);

      const unit = Math.min(width, height);
      const cx = width / 2;
      const cy = height * (still ? 0.5 : CORE_Y);
      // Grows a little as the systems arrive and a lot once it is carrying a
      // dashboard: the core is the light the panel stands in by then.
      const coreR = unit * (0.1 + 0.03 * stage.chaos + 0.1 * stage.dash);
      const lit = signal;

      // ── Fragments: one position, used by both the plate and its path ──────
      for (let index = 0; index < FRAGMENTS.length; index += 1) {
        const fragment = FRAGMENTS[index];
        const anchor = anchors[index];
        if (!fragment || !anchor) continue;

        const pull = fragmentPull(stage.pull, index, FRAGMENTS.length);
        const gone = absorbed(pull);
        // Idle float, damped to nothing as the fragment starts moving: a plate
        // being drawn into a core should not also be bobbing.
        const float = still ? 0 : Math.sin(clock * 0.5 + fragment.drift) * (1 - pull) * 0.014;

        anchor.pull = pull;
        anchor.gone = gone;
        anchor.x = lerp(cx + fragment.fx * (width / 2), cx, pull);
        anchor.y = lerp(cy + (fragment.fy + float) * (height / 2), cy, pull);

        // In the still layout the plates are in normal flow and CSS owns them.
        if (still) continue;
        const plate = plates[index];
        if (!plate) continue;
        plate.style.transform = `translate3d(${anchor.x.toFixed(1)}px, ${anchor.y.toFixed(1)}px, 0) translate(-50%, -50%) scale(${lerp(1, 0.62, pull).toFixed(3)})`;
        plate.style.opacity = (stage.chaos * (1 - gone)).toFixed(3);
      }

      context.clearRect(0, 0, width, height);

      // ── Dust ─────────────────────────────────────────────────────────────
      context.fillStyle = rgba(bone, 1);
      for (let index = 0; index < dust; index += 1) {
        const a = noise(index);
        const b = noise(index + 101);
        const c = noise(index + 257);
        const x = ((a + clock * 0.004 * (0.4 + b)) % 1) * width;
        const y = ((((b - clock * 0.003 * (0.4 + a)) % 1) + 1) % 1) * height;
        context.globalAlpha = (0.05 + c * 0.12) * (0.35 + stage.energy * 0.65);
        const size = 0.6 + c * 0.9;
        context.fillRect(x, y, size, size);
      }
      context.globalAlpha = 1;

      // ── Data paths, and the packets travelling them ───────────────────────
      if (stage.link > 0.02) {
        for (let index = 0; index < anchors.length; index += 1) {
          const anchor = anchors[index];
          if (!anchor) continue;

          // Brightest while the fragment is actually moving, and gone the moment
          // it is inside the core: a line to nothing is a stray line.
          const alpha =
            stage.link * (0.3 + 0.7 * anchor.pull) * (1 - anchor.gone) * (0.5 + stage.energy * 0.5);
          if (alpha < 0.012) continue;

          const dx = cx - anchor.x;
          const dy = cy - anchor.y;
          // Bent, and alternately: five straight lines to one point is a star,
          // five curves is a system finding its way in.
          const bend = index % 2 === 0 ? 0.16 : -0.16;
          const kx = (anchor.x + cx) / 2 - dy * bend;
          const ky = (anchor.y + cy) / 2 + dx * bend;

          context.strokeStyle = rgba(lit, 0.42 * alpha);
          context.lineWidth = 1;
          context.beginPath();
          context.moveTo(anchor.x, anchor.y);
          context.quadraticCurveTo(kx, ky, cx, cy);
          context.stroke();

          // White dot, warm halo: the packet reads as light in a warm channel
          // rather than as a second colour travelling down it.
          context.fillStyle = rgba(bone, 1);
          for (let packet = 0; packet < PACKETS; packet += 1) {
            const at = (clock * 0.2 + packet / PACKETS + index * 0.17) % 1;
            const px = quad(anchor.x, kx, cx, at);
            const py = quad(anchor.y, ky, cy, at);
            // Accelerating light: dim where the data leaves, bright where it
            // arrives, which is the direction of the whole scene in miniature.
            const heat = alpha * (0.25 + 0.75 * at);
            const halo = 10 + at * 12;
            context.globalAlpha = Math.min(0.5, heat * 0.55);
            context.drawImage(glowWarm, px - halo / 2, py - halo / 2, halo, halo);
            context.globalAlpha = Math.min(1, heat * 1.6);
            context.beginPath();
            context.arc(px, py, 1.4, 0, Math.PI * 2);
            context.fill();
          }
          context.globalAlpha = 1;
        }
      }

      // ── Every node is a system ───────────────────────────────────────────
      for (const anchor of anchors) {
        const alpha = stage.chaos * (1 - anchor.gone);
        if (alpha < 0.02) continue;
        const halo = 16;
        context.globalAlpha = alpha * 0.35;
        context.drawImage(glowWhite, anchor.x - halo / 2, anchor.y - halo / 2, halo, halo);
        context.globalAlpha = alpha * 0.8;
        context.fillStyle = rgba(bone, 1);
        context.beginPath();
        context.arc(anchor.x, anchor.y, 1.6, 0, Math.PI * 2);
        context.fill();
      }
      context.globalAlpha = 1;

      /*
        Processing, as expanding rings.

        Tied to `pull` rather than to the clock on purpose: the pulses are the
        core working through what it is being fed, so they have to run backwards
        when the reader scrolls back. A time-based pulse would keep marching
        outward while the story ran in reverse.
      */
      // Gone once the panel is up: the last state is a system running, and a
      // shockwave still crossing the frame would read as it labouring.
      const working = stage.pull * (1 - stage.dash);
      if (working > 0.02) {
        for (let ring = 0; ring < 2; ring += 1) {
          const phase = (stage.pull * 2.4 + ring * 0.5) % 1;
          context.strokeStyle = rgba(lit, 0.2 * (1 - phase) * working);
          context.lineWidth = Math.max(0.5, 1.6 - phase);
          context.beginPath();
          context.arc(cx, cy, coreR * (1 + phase * 1.9), 0, Math.PI * 2);
          context.stroke();
        }
      }

      /*
        The core's edge, in two passes and with a travelling maximum.

        Weighted by `hero`, so state one has a defined rim — the frame the reader
        opens on should be an object, not a smudge — and the rim softens as the
        core becomes a source feeding five systems.
      */
      const rim = (0.3 + 0.55 * stage.hero) * (0.35 + 0.65 * stage.energy);
      if (rim > 0.02) {
        const segments = 60;
        for (const pass of [
          { line: 7, alpha: 0.1 },
          { line: 1.5, alpha: 1 },
        ]) {
          context.lineWidth = pass.line;
          for (let index = 0; index < segments; index += 1) {
            const start = (index / segments) * Math.PI * 2;
            const end = ((index + 1.05) / segments) * Math.PI * 2;
            const wave = Math.max(0, Math.sin(start - clock * 0.45));
            context.strokeStyle = rgba(lit, pass.alpha * rim * (0.25 + wave ** 3 * 0.75));
            context.beginPath();
            context.arc(cx, cy, coreR, start, end);
            context.stroke();
          }
        }
      }

      // ── The light itself ─────────────────────────────────────────────────
      const bloom = coreR * (2.8 + Math.sin(clock * 0.6) * 0.08) * (0.85 + stage.energy * 0.3);
      context.globalAlpha = 0.46 * stage.energy;
      context.drawImage(glowWarm, cx - bloom / 2, cy - bloom / 2, bloom, bloom);
      /*
        The white centre stays smaller than the mark that sits on it. The mark is
        DOM, drawn on top of this, and a hot spot wider than the glyph turns
        white type on white light — the one legibility trap in the whole scene.
      */
      const hot = coreR * 0.62;
      context.globalAlpha = 0.55 * stage.energy;
      context.drawImage(glowWhite, cx - hot / 2, cy - hot / 2, hot, hot);
      context.globalAlpha = 1;

      // ── Coordinates, published for the DOM that has to track the core ─────
      stageEl.style.setProperty("--core-x", `${cx.toFixed(1)}px`);
      stageEl.style.setProperty("--core-y", `${cy.toFixed(1)}px`);

      if (still) return;

      /*
        The mark's journey: the centre of the core in state one, the dashboard's
        header slot in state three, the same element throughout.

        The slot is measured rather than assumed, because the panel is being
        scaled by the timeline while the mark is flying to it — a hard-coded
        offset would land next to a moving target.
      */
      let targetX = cx;
      let targetY = cy;
      let targetScale = 1;
      if (stage.glyph > 0.001) {
        const box = stageEl.getBoundingClientRect();
        const seat = slot.getBoundingClientRect();
        targetX = seat.left + seat.width / 2 - box.left;
        targetY = seat.top + seat.height / 2 - box.top;
        targetScale = 12 / (unit * 0.08);
      }
      glyph.style.setProperty("--glyph-x", `${lerp(cx, targetX, stage.glyph).toFixed(1)}px`);
      glyph.style.setProperty("--glyph-y", `${lerp(cy, targetY, stage.glyph).toFixed(1)}px`);
      glyph.style.setProperty("--glyph-scale", lerp(1, targetScale, stage.glyph).toFixed(3));
    };

    // ── Modes ───────────────────────────────────────────────────────────────
    // Two ways to render this scene, and the reader's motion preference picks
    // one. Each returns its own teardown so the choice can change at runtime.

    const enterStill = () => {
      Object.assign(stage, SETTLED);
      clock = STILL_CLOCK;

      let queued = false;
      const paint = () => {
        if (queued) return;
        queued = true;
        requestAnimationFrame(() => {
          queued = false;
          draw(0);
        });
      };

      onResized = paint;
      paint();

      return () => {
        onResized = null;
      };
    };

    const enterAnimated = () => {
      Object.assign(stage, OPENING);
      clock = 0;

      let running = false;
      const tick = () => draw(Math.min(gsap.ticker.deltaRatio(60) / 60, 0.1));
      const start = () => {
        if (running) return;
        running = true;
        gsap.ticker.add(tick);
      };
      const stop = () => {
        if (!running) return;
        running = false;
        gsap.ticker.remove(tick);
      };

      const scope = gsap.context(() => {
        const timeline = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: root,
            start: "top top",
            /*
              In multiples of the pinned stage's own height, re-read on every
              refresh: the scene should keep its pacing when the window changes
              rather than its pixel length.

              The stage rather than `window.innerHeight`, because the stage is
              what the reader is looking at — and because on first paint the two
              can disagree, which sets the scene's length from a viewport that
              existed for one frame.
            */
            end: () => `+=${stageEl.offsetHeight * SCROLL_LENGTH}`,
            pin: stageEl,
            scrub: 0.8,
            invalidateOnRefresh: true,
            anticipatePin: 1,
          },
        });

        choreograph(timeline, stage, {
          headline,
          chaosNote,
          dashNote,
          cue,
          dashboard,
          dashRows,
          spark,
        });
      }, root);

      /*
        The loop runs while the scene is on screen, not while the page is being
        scrolled: `scrub` keeps easing the timeline for a beat after the reader
        stops, and a loop that stopped with the scroll would freeze mid-catch-up.
      */
      const observer = new IntersectionObserver(
        ([entry]) => (entry?.isIntersecting ? start() : stop()),
        { rootMargin: "10% 0px" },
      );
      observer.observe(root);

      const onVisibility = () => {
        if (document.visibilityState === "visible") start();
        else stop();
      };
      document.addEventListener("visibilitychange", onVisibility);

      /*
        The scene's length is measured in stage heights, so a stage that changed
        height has invalidated it. ScrollTrigger watches the window for this, but
        not everything that resizes the stage resizes the window — a scrollbar
        appearing is enough, and on first paint the two can disagree for a frame.
      */
      onResized = () => ScrollTrigger.refresh();

      return () => {
        onResized = null;
        stop();
        observer.disconnect();
        document.removeEventListener("visibilitychange", onVisibility);
        scope.revert();
      };
    };

    measure();
    let release = reduceMotion.matches ? enterStill() : enterAnimated();

    const onPreferenceChange = () => {
      release();
      release = reduceMotion.matches ? enterStill() : enterAnimated();
    };

    const resizeObserver = new ResizeObserver(() => {
      if (measure()) onResized?.();
    });
    resizeObserver.observe(canvas);
    // Crossing the low-power breakpoint changes the dust count, which the loop
    // picks up on its next frame — but a still frame has to be told to repaint.
    const onPowerChange = () => {
      measure();
      onResized?.();
    };

    reduceMotion.addEventListener("change", onPreferenceChange);
    lowPower.addEventListener("change", onPowerChange);

    return () => {
      release();
      resizeObserver.disconnect();
      reduceMotion.removeEventListener("change", onPreferenceChange);
      lowPower.removeEventListener("change", onPowerChange);
    };
  }, []);

  return (
    <section ref={rootRef} className={styles.scene} aria-label="Story Core prototype">
      <p className={cn(styles.tag, "font-mono text-micro tracking-widest text-steel uppercase")}>
        Story Core — motion prototype
      </p>

      <div ref={stageRef} className={styles.stage}>
        <div className={styles.core}>
          <canvas ref={canvasRef} className={styles.canvas} aria-hidden="true" />
        </div>

        <h1
          ref={headlineRef}
          className={cn(styles.copy, styles.headline, "text-title-1 text-balance")}
        >
          We build software <span className="text-accent-text">products</span>.
        </h1>

        <div className={styles.field}>
          {FRAGMENTS.map((fragment) => (
            <div key={fragment.id} data-plate className={styles.plate}>
              <Icon name={fragment.icon} className={styles.plateIcon} />
              {fragment.label}
            </div>
          ))}
        </div>

        <p ref={chaosNoteRef} className={cn(styles.copy, styles.note, "text-lead text-muted")}>
          Disconnected tools. Nothing talks to anything.
        </p>

        <div className={styles.dashSeat}>
          <div ref={dashRef} className={styles.dashboard}>
            <div data-row className={styles.dashHead}>
              <span className="flex items-center gap-3">
                {/* Reserves the seat the mark flies into. */}
                <span ref={slotRef} className={cn(styles.glyphSlot, "grid place-items-center")}>
                  <span className={styles.slotMark}>{"</>"}</span>
                </span>
                <span className="font-mono text-micro tracking-widest text-foreground uppercase">
                  One system
                </span>
              </span>
              <span className="flex items-center gap-2 font-mono text-micro tracking-widest text-subtle uppercase">
                <span className="size-1.5 rounded-full bg-accent" />
                Live
              </span>
            </div>

            <div className={styles.metrics}>
              {[
                { label: "Records in flow", value: "1,256" },
                { label: "Automated", value: "84%" },
                { label: "Manual entry", value: "None" },
              ].map((metric) => (
                <div key={metric.label} data-row className={styles.metric}>
                  <p className="font-mono text-micro tracking-wider text-subtle uppercase">
                    {metric.label}
                  </p>
                  <p className="mt-2 text-title-3 text-foreground">{metric.value}</p>
                </div>
              ))}
            </div>

            <svg
              data-row
              className={styles.spark}
              viewBox="0 0 320 60"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <path
                data-spark
                d="M4 48 L44 42 L84 45 L124 33 L164 36 L204 23 L244 26 L284 13 L316 8"
                fill="none"
                stroke="var(--color-accent)"
                strokeWidth="1.5"
                strokeLinejoin="round"
              />
            </svg>

            {/* The five, now inside one thing. The same words as the plates: that
                is the payoff, and it only lands because the words match. */}
            <div data-row className={styles.sources}>
              {FRAGMENTS.map((fragment) => (
                <span key={fragment.id} className={styles.source}>
                  <Icon name="check" className={styles.sourceIcon} />
                  {fragment.label}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/*
          The permanent object: one element for all three states, the `</>` in the
          core and then the mark in the panel's header.

          Last in the stage, and that is load-bearing — it has to paint over the
          dashboard it flies into, and these are siblings at the same layer.
        */}
        <span ref={glyphRef} dir="ltr" aria-hidden="true" className={styles.glyph}>
          {"</>"}
        </span>

        <p ref={dashNoteRef} className={cn(styles.copy, styles.note, "text-lead text-muted")}>
          One flow. One intelligent system.
        </p>

        <div ref={cueRef} className={styles.cue}>
          <span className={styles.cueLine} />
          <span className="font-mono text-micro tracking-widest text-subtle uppercase">Scroll</span>
        </div>
      </div>
    </section>
  );
}
