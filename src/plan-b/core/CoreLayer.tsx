"use client";

import { useEffect, useRef } from "react";

import { Logo } from "@/components/ui/Logo";
import { registerGsap } from "@/motion/gsap";

import { blendState, SCENES, SCENE_ATTRIBUTE, type CoreMode, type CoreState } from "../timeline";
import { LAYOUTS, seedFor, type Placed, type Seed } from "./layouts";
import styles from "./core.module.css";

type Rgb = [number, number, number];

const POINTS = 140;
const POINTS_LOW = 64;
const MAX_PIXEL_RATIO = 1.5;
/** Frozen clock for the reduced-motion rendering: late enough to look settled. */
const STILL_TIME = 6;

/** Widest to narrowest, so the hard edge lands on top of its own halo. */
const RING_PASSES = [
  { line: 24, alpha: 0.08 },
  { line: 8, alpha: 0.16 },
  { line: 2.5, alpha: 1 },
] as const;

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

function mix(from: Rgb, to: Rgb, t: number): Rgb {
  return [
    from[0] + (to[0] - from[0]) * t,
    from[1] + (to[1] - from[1]) * t,
    from[2] + (to[2] - from[2]) * t,
  ];
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
  gradient.addColorStop(0.3, rgba(colour, 0.2));
  gradient.addColorStop(1, rgba(colour, 0));
  context.fillStyle = gradient;
  context.fillRect(0, 0, size, size);
  return canvas;
}

const smoothstep = (t: number) => t * t * (3 - 2 * t);
const clamp01 = (value: number) => (value < 0 ? 0 : value > 1 ? 1 : value);

interface Resolved {
  state: CoreState;
  from: CoreMode;
  to: CoreMode;
  /** 0 at the `from` scene's centre, 1 at the `to` scene's centre. */
  blend: number;
}

/**
 * The software core. One canvas, one loop, for the whole page.
 *
 * Mounted once by the Plan B layout and never unmounted, because the concept is
 * that this object persists: a core that remounted per section would be eight
 * cores that look alike. Scenes never touch it — it finds them by attribute,
 * reads how far the reader has travelled, and interpolates between the states
 * declared in `timeline.ts`.
 *
 * 2D canvas rather than WebGL: the whole scene is 140 points, one stroke pass
 * and one sprite. A WebGL context would add a renderer and a scene graph to draw
 * dots, and would still be drawing them on the same GPU.
 */
export function CoreLayer() {
  const layerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const layer = layerRef.current;
    const canvas = canvasRef.current;
    if (!layer || !canvas) return;
    const context = canvas.getContext("2d", { alpha: true });
    if (!context) return;

    const gsap = registerGsap();
    const root = document.documentElement;
    const readToken = (name: string, fallback: string) =>
      getComputedStyle(root).getPropertyValue(name).trim() || fallback;

    const bone = hexToRgb(readToken("--color-bone", "#ece9e2"));
    const signal = hexToRgb(readToken("--color-signal", "#d77758"));
    const white: Rgb = [255, 255, 255];

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const lowPower = window.matchMedia("(max-width: 47.9375rem)");

    const glowWhite = makeGlow(white, 128);
    const glowWarm = makeGlow(signal, 128);

    let width = 0;
    let height = 0;
    let ratio = 1;
    let count = POINTS;
    let seeds: Seed[] = [];
    let links: [number, number][] = [];

    /** Screen-space state, reused every frame rather than reallocated. */
    let px = new Float32Array(0);
    let py = new Float32Array(0);
    let pSize = new Float32Array(0);
    let pHeat = new Float32Array(0);

    // Two scratch objects, written by the two layouts being blended.
    const a: Placed = { x: 0, y: 0, size: 1, heat: 1 };
    const b: Placed = { x: 0, y: 0, size: 1, heat: 1 };

    /**
     * Real seconds, and the core's own clock.
     *
     * They are separate because `spin` differs per scene: multiplying elapsed
     * time by the current rate would rewind the field every time the rate
     * dropped. Integrating the rate instead means the core can speed up and slow
     * down without ever jumping.
     */
    let elapsed = 0;
    let clock = 0;
    let running = false;
    let scenes: HTMLElement[] = [];

    const collect = () => {
      scenes = Array.from(document.querySelectorAll<HTMLElement>(`[${SCENE_ATTRIBUTE}]`));
    };

    const seed = () => {
      count = lowPower.matches ? POINTS_LOW : POINTS;
      seeds = Array.from({ length: count }, (_, index) => seedFor(index));
      px = new Float32Array(count);
      py = new Float32Array(count);
      pSize = new Float32Array(count);
      pHeat = new Float32Array(count);

      /*
        Links by index rather than by proximity.

        A nearest-neighbour pass would have to run every frame, because the field
        is re-laid-out every frame — 140² distance tests to draw 200 lines. Index
        pairs are free, and because a layout maps index to position smoothly, a
        pair that is adjacent in the list is adjacent on screen in every mode
        that has an order. In the mode that has none, `link` is zero.
      */
      links = [];
      for (let index = 0; index < count; index += 1) {
        links.push([index, (index + 1) % count]);
        if (index % 2 === 0) links.push([index, (index + 11) % count]);
      }
    };

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      ratio = Math.min(window.devicePixelRatio || 1, MAX_PIXEL_RATIO);

      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);
      context.setTransform(ratio, 0, 0, ratio, 0, 0);

      seed();
      collect();
    };

    /**
     * How far the reader has travelled, in scenes.
     *
     * The sum is the whole trick: for stacked scenes, every one above the
     * viewport centre contributes 1 and every one below contributes 0, so the
     * total is `index + progress` of whichever scene the centre is in. No
     * branching, no cached offsets, and correct on the frame after a resize.
     */
    const storyPosition = () => {
      const centre = height / 2;
      let total = 0;
      for (const scene of scenes) {
        const rect = scene.getBoundingClientRect();
        if (rect.height === 0) continue;
        total += clamp01((centre - rect.top) / rect.height);
      }
      return total;
    };

    /** The two states either side of the reader, and how far between them. */
    const resolve = (): Resolved => {
      const last = SCENES.length - 1;
      // Anchors sit at each scene's centre, so a declared state is reached when
      // that scene is centred and holds while it is.
      const at = storyPosition() - 0.5;
      const index = Math.max(0, Math.min(last, Math.floor(at)));
      const from = SCENES[index]?.core ?? SCENES[0]?.core;
      const to = SCENES[Math.min(last, index + 1)]?.core ?? from;
      if (!from || !to) throw new Error("Plan B timeline is empty");

      const blend = smoothstep(clamp01(at - index));
      return { state: blendState(from, to, blend), from: from.mode, to: to.mode, blend };
    };

    const draw = (delta: number) => {
      if (width === 0 || height === 0) return;

      const { state, from, to, blend } = resolve();
      elapsed += delta;
      clock += delta * (0.5 + state.spin * 4);

      // RTL mirrors the composition, and the core is part of the composition.
      const flip = root.dir === "rtl";
      const cx = (flip ? 1 - state.x : state.x) * width;
      const cy = state.y * height;
      const unit = Math.min(width, height) * state.radius;
      const mirror = flip ? -1 : 1;

      const layoutFrom = LAYOUTS[from];
      const layoutTo = LAYOUTS[to];

      for (let index = 0; index < count; index += 1) {
        const point = seeds[index];
        if (!point) continue;
        layoutFrom(a, index, count, clock, point);

        // Both layouts, blended per point. This is the concept: the same points
        // travel from one arrangement to the next, so the reader watches an
        // object reorganise rather than one picture dissolve into another.
        if (blend > 0 && layoutTo !== layoutFrom) {
          layoutTo(b, index, count, clock, point);
          px[index] = cx + (a.x + (b.x - a.x) * blend) * unit * mirror;
          py[index] = cy + (a.y + (b.y - a.y) * blend) * unit;
          pSize[index] = a.size + (b.size - a.size) * blend;
          pHeat[index] = a.heat + (b.heat - a.heat) * blend;
        } else {
          px[index] = cx + a.x * unit * mirror;
          py[index] = cy + a.y * unit;
          pSize[index] = a.size;
          pHeat[index] = a.heat;
        }
      }

      context.clearRect(0, 0, width, height);

      const warmth = clamp01(state.warmth);
      const lit = mix(bone, signal, warmth);
      // Two styles per frame, not per point: building a colour string 140 times
      // a frame costs more than everything else in this loop put together.
      const coolStyle = rgba(bone, 1);
      const warmStyle = rgba(lit, 1);

      // Links first: structure under light, so the core reads as a source rather
      // than as another node.
      if (state.link > 0.02) {
        const reach = unit * 0.55;
        context.strokeStyle = rgba(lit, 0.08 * state.link * state.energy);
        context.lineWidth = 1;
        context.beginPath();
        for (const [start, end] of links) {
          const ax = px[start];
          const ay = py[start];
          const bx = px[end];
          const by = py[end];
          if (ax === undefined || ay === undefined || bx === undefined || by === undefined)
            continue;
          // Culled by length: a link long enough to cross the composition reads
          // as a stray line rather than as a connection.
          if (Math.abs(ax - bx) > reach || Math.abs(ay - by) > reach) continue;
          context.moveTo(ax, ay);
          context.lineTo(bx, by);
        }
        context.stroke();
      }

      /*
        The boundary ring, in three passes of one circle: a wide faint halo, a
        mid stroke and a hard edge. Three strokes rather than a shadow blur,
        because `shadowBlur` re-rasterises the path on the CPU every frame.

        The bright arc travels. A ring at even alpha is a diagram of a ring; a
        travelling maximum is what makes it read as light in a channel.
      */
      if (state.ring > 0.02) {
        const alpha = state.ring * (0.5 + state.energy * 0.5);
        const segments = 72;
        for (const pass of RING_PASSES) {
          context.lineWidth = pass.line;
          for (let index = 0; index < segments; index += 1) {
            const start = (index / segments) * Math.PI * 2;
            // Overlapped slightly so the segments join instead of dashing.
            const end = ((index + 1.04) / segments) * Math.PI * 2;
            const wave = Math.max(0, Math.sin(start - clock * 0.5));
            context.strokeStyle = rgba(lit, pass.alpha * alpha * (0.2 + wave ** 3 * 0.8));
            context.beginPath();
            context.arc(cx, cy, unit, start, end);
            context.stroke();
          }
        }
      }

      /*
        The centre light, dimmed by the ring.

        A closed ring holds the core's light in its edge — which is what makes
        the opening frame an eclipse rather than a lamp — so these two dials are
        coupled here on purpose, instead of adding a third that nobody would
        remember to set.
      */
      const centre = state.energy ** 2 * (1 - state.ring * 0.75);
      if (centre > 0.02) {
        /*
          Sized off the viewport, not off `radius`.

          `radius` is how far the field has spread, and the source is not bigger
          because its material scattered — tying the bloom to it turns the two
          widest scenes into a brown haze across the middle of the frame. Energy
          is squared for the same reason: a dim core should be nearly out, not
          uniformly grey.
        */
        const light = Math.min(width, height) * 0.22 * (0.8 + state.energy * 0.4);
        const bloom = light * (1.7 + Math.sin(elapsed * 0.5) * 0.07);
        // The wide warm pass stays low: past roughly a quarter alpha it stops
        // being light on black and starts being a brown disc.
        context.globalAlpha = 0.24 * centre;
        context.drawImage(glowWarm, cx - bloom / 2, cy - bloom / 2, bloom, bloom);
        const hot = light * 0.46;
        context.globalAlpha = 0.9 * centre;
        context.drawImage(glowWhite, cx - hot / 2, cy - hot / 2, hot, hot);
        context.globalAlpha = 1;
      }

      // Points: a halo only where it earns one, then a hard dot for every point.
      // The edge is what makes a 2px mark read as a point rather than a smudge.
      for (let index = 0; index < count; index += 1) {
        const x = px[index];
        const y = py[index];
        if (x === undefined || y === undefined) continue;
        const heat = (pHeat[index] ?? 0) * state.energy;
        if (heat < 0.04) continue;
        const size = pSize[index] ?? 1;

        if (heat > 0.4) {
          const halo = size * 24;
          context.globalAlpha = Math.min(0.45, heat * 0.38);
          const sprite = index % 3 === 0 ? glowWarm : glowWhite;
          context.drawImage(sprite, x - halo / 2, y - halo / 2, halo, halo);
        }

        context.globalAlpha = Math.min(1, 0.3 + heat * 0.8);
        context.fillStyle = index % 4 === 0 ? warmStyle : coolStyle;
        context.beginPath();
        context.arc(x, y, size * 1.2, 0, Math.PI * 2);
        context.fill();
      }
      context.globalAlpha = 1;

      // Published rather than applied: the mark is DOM, and one set of custom
      // properties lets CSS place it inside the core without a second loop.
      layer.style.setProperty("--core-x", `${cx.toFixed(1)}px`);
      layer.style.setProperty("--core-y", `${cy.toFixed(1)}px`);
      layer.style.setProperty("--core-r", `${unit.toFixed(1)}px`);
      /*
        Squared, and only ever as bright as the core it sits in.

        Linear opacity leaves the mark half-visible for the whole length of a
        transition, which puts a grey wordmark on a scene that has no core under
        it. Squaring makes it commit: present where it belongs, gone quickly
        everywhere else.
      */
      layer.style.setProperty("--core-word", (state.word ** 2).toFixed(3));
      layer.style.setProperty("--core-glyph", (state.glyph ** 2 * centre).toFixed(3));
    };

    const tick = () => draw(Math.min(gsap.ticker.deltaRatio(60) / 60, 0.1));

    const start = () => {
      if (running || reduceMotion.matches) return;
      running = true;
      gsap.ticker.add(tick);
    };

    const stop = () => {
      if (!running) return;
      running = false;
      gsap.ticker.remove(tick);
    };

    /**
     * The reduced-motion rendering. The core still answers the scroll, because
     * following the story is the page rather than an animation, but its own
     * clock is frozen: nothing moves unless the reader moves it.
     */
    const drawStill = () => {
      elapsed = STILL_TIME;
      clock = STILL_TIME;
      draw(0);
    };

    let stillQueued = false;
    const queueStill = () => {
      if (stillQueued) return;
      stillQueued = true;
      requestAnimationFrame(() => {
        stillQueued = false;
        drawStill();
      });
    };

    const onVisibility = () => {
      if (document.visibilityState === "visible") start();
      else stop();
    };

    const onMotionChange = () => {
      if (reduceMotion.matches) {
        stop();
        window.addEventListener("scroll", queueStill, { passive: true });
        drawStill();
      } else {
        window.removeEventListener("scroll", queueStill);
        start();
      }
    };

    const onResize = () => {
      resize();
      if (reduceMotion.matches) drawStill();
    };

    resize();

    if (reduceMotion.matches) {
      window.addEventListener("scroll", queueStill, { passive: true });
      drawStill();
    } else {
      start();
    }

    window.addEventListener("resize", onResize, { passive: true });
    document.addEventListener("visibilitychange", onVisibility);
    reduceMotion.addEventListener("change", onMotionChange);
    lowPower.addEventListener("change", onResize);

    return () => {
      stop();
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", queueStill);
      document.removeEventListener("visibilitychange", onVisibility);
      reduceMotion.removeEventListener("change", onMotionChange);
      lowPower.removeEventListener("change", onResize);
    };
  }, []);

  return (
    <div ref={layerRef} aria-hidden="true" className={styles.layer}>
      <canvas ref={canvasRef} className={styles.canvas} />
      <div className={styles.mark}>
        <span className={styles.word}>
          <Logo className="h-full" />
        </span>
        {/* `dir` is not decoration here: the angle brackets are bidi-neutral, so
            in an Arabic paragraph they would resolve to `>/<`. */}
        <span dir="ltr" className={styles.glyph}>
          {"</>"}
        </span>
      </div>
    </div>
  );
}
