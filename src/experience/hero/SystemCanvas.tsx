"use client";

import { useEffect, useRef, type RefObject } from "react";

import { registerGsap } from "@/motion/gsap";
import { cn } from "@/lib/utils";

import { scene } from "./scene";

type Rgb = [number, number, number];

interface Node {
  angle: number;
  radius: number;
  /** Amplitude of the slow in-and-out breath along the radius. */
  wobble: number;
  phase: number;
  size: number;
  warm: boolean;
}

interface Shaft {
  angle: number;
  radius: number;
  height: number;
  width: number;
  alpha: number;
  phase: number;
}

interface Particle {
  x: number;
  y: number;
  rise: number;
  size: number;
  alpha: number;
  warm: boolean;
}

interface Packet {
  link: number;
  at: number;
  speed: number;
}

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
  return `rgba(${r},${g},${b},${alpha})`;
}

/**
 * A soft dot, pre-rendered once.
 *
 * Every glow in the scene is this one sprite drawn at a different size and
 * alpha. Building a radial gradient costs more than the fill it produces, and
 * the core alone would need four of them per frame.
 */
function makeGlow(colour: Rgb, size: number, falloff: number) {
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const context = canvas.getContext("2d");
  if (!context) return canvas;

  const half = size / 2;
  const gradient = context.createRadialGradient(half, half, 0, half, half, half);
  gradient.addColorStop(0, rgba(colour, 1));
  gradient.addColorStop(falloff, rgba(colour, 0.16));
  gradient.addColorStop(1, rgba(colour, 0));
  context.fillStyle = gradient;
  context.fillRect(0, 0, size, size);
  return canvas;
}

interface SystemCanvasProps {
  className?: string;
  /**
   * The element the parallax offsets are published on. It has to be the common
   * ancestor of this canvas and the panels, since both read the same two custom
   * properties to stay in the same imaginary camera.
   */
  surfaceRef: RefObject<HTMLDivElement | null>;
}

/**
 * The scene, drawn on a 2D canvas.
 *
 * 2D rather than WebGL because none of this geometry is three-dimensional: it is
 * a flat projection of a plane, computed once per resize and composited per
 * frame. A WebGL context would add a renderer and a scene graph to draw ellipses
 * and lines, and would still be doing it on the same GPU.
 *
 * The whole thing is one canvas and one ticker callback. Structure that never
 * moves — the burst, the rings, the floor — is baked into an offscreen layer at
 * resize and composited with a single `drawImage`; only what actually animates
 * is redrawn.
 */
export function SystemCanvas({ className, surfaceRef }: SystemCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d", { alpha: true });
    if (!context) return;

    // Captured now rather than read in the cleanup: by teardown the ref may
    // already point elsewhere, and the properties have to come off the same
    // element they were written to.
    const surface = surfaceRef.current;

    const gsap = registerGsap();
    const root = document.documentElement;
    const readToken = (name: string, fallback: string) =>
      getComputedStyle(root).getPropertyValue(name).trim() || fallback;

    const bone = hexToRgb(readToken("--color-bone", "#ece9e2"));
    const accent = hexToRgb(readToken("--color-signal", "#d77758"));
    const white: Rgb = [255, 255, 255];

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const compact = window.matchMedia("(max-width: 63.9375rem)");

    const glowWhite = makeGlow(white, 256, 0.28);
    const glowBone = makeGlow(bone, 256, 0.34);
    const glowWarm = makeGlow(accent, 256, 0.3);

    let width = 0;
    let height = 0;
    let ratio = 1;
    let core = { x: 0, y: 0 };
    /** The structured plane. */
    let discR = 0;
    /** How far the loose material scatters. */
    let fieldR = 0;

    let plane: HTMLCanvasElement | null = null;
    let nodes: Node[] = [];
    let links: [number, number][] = [];
    let shafts: Shaft[] = [];
    let particles: Particle[] = [];
    let packets: Packet[] = [];

    let elapsed = 0;
    let intro = 0;
    let running = false;
    let visible = true;
    let inView = true;

    // Pointer state in normalised −1…1, and the lerped offset actually drawn.
    const pointer = { x: 0, y: 0 };
    const offset = { x: 0, y: 0 };

    /** Where a plane point lands on screen, at the current squash. */
    const project = (angle: number, radius: number) => ({
      x: core.x + Math.cos(angle) * radius,
      y: core.y + Math.sin(angle) * radius * scene.squash,
    });

    /**
     * The floor: a rectangular grid receding to the core.
     *
     * A true perspective divide rather than a skew — `f / v` is what makes the
     * crossing lines bunch up towards the horizon instead of staying evenly
     * spaced, and that bunching is the entire reason the plane reads as ground.
     */
    const drawFloor = (ctx: CanvasRenderingContext2D) => {
      /*
        World units, projected to pixels by `unit`.

        Keeping the camera and the grid step unitless and doing the pixel
        conversion once is what makes this legible: `camera / v` is a ratio, and
        multiplying a ratio by a pixel scale gives pixels. Folding the scale into
        both the camera height and the focal length instead squares it, and the
        floor lands tens of thousands of pixels off-screen.
      */
      const unit = fieldR;
      const camera = 0.55;
      const near = 1;
      const far = 16;
      const step = 0.12;
      const half = scene.gridColumns / 2;

      for (let index = -half; index <= half; index += 1) {
        const u = index * step;
        const x1 = core.x + (u / far) * unit;
        const y1 = core.y + (camera / far) * unit;
        const x2 = core.x + (u / near) * unit;
        const y2 = core.y + (camera / near) * unit;

        const fade = ctx.createLinearGradient(x1, y1, x2, y2);
        fade.addColorStop(0, rgba(bone, 0));
        fade.addColorStop(0.45, rgba(bone, 0.045));
        fade.addColorStop(1, rgba(bone, 0.1));
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.strokeStyle = fade;
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      for (let row = 0; row <= scene.gridRows; row += 1) {
        // Geometric, not linear: equal steps in depth, which projects to the
        // squeeze towards the horizon.
        const v = near * Math.pow(far / near, row / scene.gridRows);
        const y = core.y + (camera / v) * unit;
        const reach = ((half * step) / v) * unit;
        ctx.beginPath();
        ctx.moveTo(core.x - reach, y);
        ctx.lineTo(core.x + reach, y);
        // Dimmer than the converging lines by design. The rows exist to make the
        // floor a surface rather than a fan; make them equal partners and the
        // scene turns into a chessboard.
        ctx.strokeStyle = rgba(bone, 0.014 + 0.042 * (1 - row / scene.gridRows));
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    };

    /** The burst, the rings and the floor, composited once per resize. */
    const bakePlane = () => {
      const layer = document.createElement("canvas");
      layer.width = Math.max(1, Math.round(width * ratio));
      layer.height = Math.max(1, Math.round(height * ratio));
      const ctx = layer.getContext("2d");
      if (!ctx) return null;
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);

      drawFloor(ctx);

      /**
       * One radial line out of the core.
       *
       * `squash` is the whole argument between a ray and a spoke, and the reason
       * this takes it as an argument rather than reading the scene's: at 0.82 the
       * line reads as light travelling towards the camera, at 0.32 as an axis
       * lying on the ground.
       */
      const radial = (angle: number, from: number, to: number, squash: number, alpha: number) => {
        const start = {
          x: core.x + Math.cos(angle) * from,
          y: core.y + Math.sin(angle) * from * squash,
        };
        const end = {
          x: core.x + Math.cos(angle) * to,
          y: core.y + Math.sin(angle) * to * squash,
        };
        const fade = ctx.createLinearGradient(start.x, start.y, end.x, end.y);
        fade.addColorStop(0, rgba(bone, alpha));
        fade.addColorStop(0.22, rgba(bone, alpha * 0.4));
        fade.addColorStop(0.6, rgba(bone, alpha * 0.12));
        fade.addColorStop(1, rgba(bone, 0));
        ctx.beginPath();
        ctx.moveTo(start.x, start.y);
        ctx.lineTo(end.x, end.y);
        ctx.strokeStyle = fade;
        ctx.lineWidth = 1;
        ctx.stroke();
      };

      // Deterministic pseudo-randomness. Keyed to the index so the burst is
      // uneven without the picture changing between two bakes at the same size —
      // a resize must not reshuffle the scene.
      const noise = (index: number, salt: number) =>
        (Math.sin(index * 12.9898 + salt * 78.233) + 1) / 2;

      const rayCount = compact.matches ? scene.raysLow : scene.rays;
      const reach = Math.max(width, height) * scene.rayReach;
      for (let index = 0; index < rayCount; index += 1) {
        const spread = noise(index, 3);
        // Angles are jittered off the even division, because 132 evenly spaced
        // lines produce moiré fans where the spacing beats against the pixel grid.
        const angle = ((index + spread * 0.7) / rayCount) * Math.PI * 2 + 0.17;
        // Cubed, so most rays are short and a few carry to the frame edge. A
        // linear spread gives every ray a middling length and the burst loses its
        // silhouette.
        const length = reach * (0.12 + Math.pow(noise(index, 7), 2.6) * 0.95);
        radial(angle, discR * 0.08, length, scene.raySquash, 0.16 + spread * 0.22);
      }

      const spokeCount = compact.matches ? scene.spokesLow : scene.spokes;
      for (let index = 0; index < spokeCount; index += 1) {
        const jitter = noise(index, 11);
        const angle = (index / spokeCount) * Math.PI * 2 + 0.4;
        const length = discR * scene.spokeReach * (0.55 + jitter * 0.65);
        radial(angle, discR * 0.12, length, scene.squash, 0.2 + jitter * 0.12);
      }

      for (let index = 1; index <= scene.rings; index += 1) {
        const radius = (discR * index) / scene.rings;
        ctx.beginPath();
        ctx.ellipse(core.x, core.y, radius, radius * scene.squash, 0, 0, Math.PI * 2);
        // Outer rings fainter, so the plane recedes rather than stopping.
        ctx.strokeStyle = rgba(bone, 0.11 * (1 - (index - 1) / scene.rings));
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      for (const at of scene.orbits) {
        const radius = discR * at;
        ctx.beginPath();
        ctx.ellipse(core.x, core.y, radius, radius * scene.squash, 0, 0, Math.PI * 2);
        ctx.strokeStyle = rgba(bone, 0.26);
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      return layer;
    };

    const seed = () => {
      const nodeCount = compact.matches ? scene.nodesLow : scene.nodes;
      const shaftCount = compact.matches ? scene.shaftsLow : scene.shafts;
      const dustCount = compact.matches ? scene.particlesLow : scene.particles;

      nodes = Array.from({ length: nodeCount }, () => ({
        angle: Math.random() * Math.PI * 2,
        // Square-rooted so the scatter is even across the *area* of the field.
        // Linear random piles two thirds of the nodes into the inner third.
        radius: fieldR * (0.08 + Math.sqrt(Math.random()) * 0.95),
        wobble: fieldR * (0.002 + Math.random() * 0.006),
        phase: Math.random() * Math.PI * 2,
        size: 0.85 + Math.random() * 1.35,
        warm: Math.random() < 0.12,
      }));

      // Nearest-neighbour links, computed once on the seeded positions. The
      // whole field turns at one rate, so a pair that starts close stays close
      // and a link can never stretch across the scene.
      const points = nodes.map((node) => project(node.angle, node.radius));
      links = [];
      points.forEach((point, index) => {
        const ranked = points
          .map((other, otherIndex) => ({
            otherIndex,
            distance: (other.x - point.x) ** 2 + (other.y - point.y) ** 2,
          }))
          .filter((entry) => entry.otherIndex !== index)
          .sort((a, b) => a.distance - b.distance)
          .slice(0, scene.links);

        for (const entry of ranked) {
          // One edge per pair, not two.
          if (entry.otherIndex > index) links.push([index, entry.otherIndex]);
        }
      });

      shafts = Array.from({ length: shaftCount }, () => {
        // Heavily biased towards the core, which is what makes the shafts read as
        // one column of light above it. Spread them evenly across the plane and
        // they stop being a column and become a row of stray vertical lines.
        const radius = discR * Math.pow(Math.random(), 2.2) * 2.1;
        return {
          angle: Math.random() * Math.PI * 2,
          radius,
          height: height * (0.95 - (radius / discR) * 0.1) * (0.5 + Math.random() * 0.75),
          width: 0.8 + Math.random() * 1.2,
          alpha: 0.09 + Math.random() * 0.2,
          phase: Math.random() * Math.PI * 2,
        };
      });

      particles = Array.from({ length: dustCount }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        rise: 3 + Math.random() * 9,
        size: 0.7 + Math.random() * 1.3,
        alpha: 0.12 + Math.random() * 0.4,
        warm: Math.random() < 0.1,
      }));

      packets = Array.from({ length: Math.min(scene.packets, links.length) }, () => ({
        link: Math.floor(Math.random() * links.length),
        at: Math.random(),
        speed: scene.packetSpeed * (0.6 + Math.random() * 0.9),
      }));
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;

      width = rect.width;
      height = rect.height;
      ratio = Math.min(window.devicePixelRatio || 1, scene.maxPixelRatio);

      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);
      context.setTransform(ratio, 0, 0, ratio, 0, 0);

      core = { x: width * scene.core.x, y: height * scene.core.y };
      // The disc is keyed to the short side so it scales with the panel rather
      // than stretching with it; the field is keyed to the long side, because it
      // is meant to run past the frame. A system that stops inside its box looks
      // like a diagram of one.
      discR = Math.min(width, height) * scene.discScale;
      fieldR = Math.max(width, height) * scene.fieldScale;

      seed();
      plane = bakePlane();
    };

    const draw = (delta: number) => {
      if (width === 0 || height === 0) return;

      elapsed += delta;
      if (intro < 1) intro = Math.min(1, intro + delta / scene.introDuration);
      // Ease-out on the way in, so the scene arrives and settles rather than
      // fading at a constant rate.
      const lift = 1 - Math.pow(1 - intro, 3);

      offset.x += (pointer.x * scene.parallax - offset.x) * scene.pointerLerp;
      offset.y += (pointer.y * scene.parallax * 0.6 - offset.y) * scene.pointerLerp;

      if (surface) {
        // Published rather than applied per element: the panels are DOM, and one
        // pair of custom properties lets CSS move all six without this loop
        // touching a single style object.
        surface.style.setProperty("--hero-parallax-x", `${offset.x.toFixed(2)}px`);
        surface.style.setProperty("--hero-parallax-y", `${offset.y.toFixed(2)}px`);
      }

      context.clearRect(0, 0, width, height);
      context.save();
      context.translate(offset.x, offset.y);

      if (plane) {
        context.globalAlpha = lift;
        context.drawImage(plane, 0, 0, width, height);
        context.globalAlpha = 1;
      }

      // The field turns as one body, each node breathing along its own radius.
      // Node and position travel together rather than as parallel arrays, so a
      // link can only ever be drawn between two points that exist.
      const spin = elapsed * scene.fieldSpin;
      const live = nodes.map((node) => ({
        node,
        point: project(
          node.angle + spin,
          node.radius + Math.sin(elapsed * 0.28 + node.phase) * node.wobble,
        ),
      }));

      context.strokeStyle = rgba(bone, 0.055 * lift);
      context.lineWidth = 1;
      context.beginPath();
      for (const [fromIndex, toIndex] of links) {
        const from = live[fromIndex];
        const to = live[toIndex];
        if (!from || !to) continue;
        context.moveTo(from.point.x, from.point.y);
        context.lineTo(to.point.x, to.point.y);
      }
      context.stroke();

      // Shafts before the core, so the core's light lands on top of them.
      for (const shaft of shafts) {
        const base = project(shaft.angle, shaft.radius);
        const breath = 0.85 + Math.sin(elapsed * 0.5 + shaft.phase) * 0.15;
        const top = base.y - shaft.height * breath;
        const fade = context.createLinearGradient(base.x, base.y, base.x, top);
        fade.addColorStop(0, rgba(white, shaft.alpha * breath * lift));
        fade.addColorStop(0.35, rgba(bone, shaft.alpha * 0.5 * breath * lift));
        fade.addColorStop(1, rgba(bone, 0));
        context.beginPath();
        context.moveTo(base.x, base.y);
        context.lineTo(base.x, top);
        context.strokeStyle = fade;
        context.lineWidth = shaft.width;
        context.stroke();
      }

      const pulse = 0.5 + Math.sin(elapsed * 0.55) * 0.5;

      /*
        The core, in four passes: a wide ambient bloom, a warm inner glow, a hard
        white centre, and the horizontal flare a bright point picks up through a
        lens.

        The bloom is deliberately restrained. Every value in this scene is inside
        the top stop of the range, so a bloom wide and bright enough to look like
        light *up close* erases the burst it is supposed to be emitting — the
        structure has to survive the light, because the structure is the subject.
      */
      const bloom = discR * (3.3 + pulse * 0.25);
      context.globalAlpha = 0.17 * lift;
      context.drawImage(glowBone, core.x - bloom / 2, core.y - bloom / 2, bloom, bloom);

      const warm = discR * (1.45 + pulse * 0.14);
      context.globalAlpha = 0.26 * lift;
      context.drawImage(glowWarm, core.x - warm / 2, core.y - warm / 2, warm, warm);

      const centre = discR * (0.56 + pulse * 0.08);
      context.globalAlpha = 0.95 * lift;
      context.drawImage(glowWhite, core.x - centre / 2, core.y - centre / 2, centre, centre);

      // A circle squashed almost flat, which is what a flare is.
      context.save();
      context.translate(core.x, core.y);
      context.scale(3.4, 0.1);
      context.globalAlpha = 0.38 * lift;
      context.drawImage(glowWhite, -discR, -discR, discR * 2, discR * 2);
      context.restore();
      context.globalAlpha = 1;

      /*
        Nodes on top of the light, so the plane keeps its structure across the
        brightest part of the scene.

        Two passes per node: a soft halo and a hard dot inside it. The halo alone
        gives a field of smudges — a node has to have an edge to read as a point
        at this size, and the halo is only there so the point sits in the light
        rather than on top of it.
      */
      for (const { node, point } of live) {
        const twinkle = 0.55 + Math.sin(elapsed * 0.7 + node.phase) * 0.45;
        const halo = node.size * (1 + twinkle * 0.25) * 4.2;
        context.globalAlpha = (node.warm ? 0.4 : 0.26) * twinkle * lift;
        const sprite = node.warm ? glowWarm : glowWhite;
        context.drawImage(sprite, point.x - halo / 2, point.y - halo / 2, halo, halo);

        context.globalAlpha = (node.warm ? 0.95 : 0.8) * twinkle * lift;
        context.fillStyle = node.warm ? rgba(accent, 1) : rgba(white, 1);
        context.beginPath();
        context.arc(point.x, point.y, node.size * 0.62, 0, Math.PI * 2);
        context.fill();
      }
      context.globalAlpha = 1;

      // Packets. A dot on a line, which is all a data flow has to be.
      for (const packet of packets) {
        packet.at += packet.speed * delta;
        if (packet.at > 1) {
          packet.at = 0;
          // A new line each time round, so the traffic pattern never settles
          // into a loop the eye can learn.
          packet.link = Math.floor(Math.random() * links.length);
        }
        const link = links[packet.link];
        if (!link) continue;
        const from = live[link[0]];
        const to = live[link[1]];
        if (!from || !to) continue;
        const x = from.point.x + (to.point.x - from.point.x) * packet.at;
        const y = from.point.y + (to.point.y - from.point.y) * packet.at;
        // Brightest mid-flight, so a packet arrives and dims rather than
        // vanishing at the end of its line.
        const strength = Math.sin(packet.at * Math.PI);
        context.globalAlpha = 0.7 * strength * lift;
        context.drawImage(glowWarm, x - 5, y - 5, 10, 10);
      }
      context.globalAlpha = 1;

      for (const particle of particles) {
        particle.y -= particle.rise * delta;
        if (particle.y < -4) {
          particle.y = height + 4;
          particle.x = Math.random() * width;
        }
        context.fillStyle = rgba(particle.warm ? accent : bone, particle.alpha * lift);
        context.beginPath();
        context.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        context.fill();
      }

      context.restore();
    };

    /** One frame, at the finished state. The reduced-motion rendering. */
    const drawStill = () => {
      intro = 1;
      elapsed = 6;
      draw(0);
    };

    const tick = () => {
      // GSAP's delta is in milliseconds and is clamped for us, which is what
      // stops a backgrounded tab from resuming with a multi-second step.
      draw(Math.min(gsap.ticker.deltaRatio(60) / 60, 0.1));
    };

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

    /** Animate only while the scene is both on screen and in a visible tab. */
    const sync = () => {
      if (visible && inView) start();
      else stop();
    };

    const onPointerMove = (event: PointerEvent) => {
      pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
      pointer.y = (event.clientY / window.innerHeight) * 2 - 1;
    };

    const onVisibility = () => {
      visible = document.visibilityState === "visible";
      sync();
    };

    const onMotionChange = () => {
      if (reduceMotion.matches) {
        stop();
        pointer.x = 0;
        pointer.y = 0;
        offset.x = 0;
        offset.y = 0;
        drawStill();
      } else {
        sync();
      }
    };

    const observer = new ResizeObserver(() => {
      resize();
      if (reduceMotion.matches) drawStill();
    });
    observer.observe(canvas);

    const inViewObserver = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry) return;
        inView = entry.isIntersecting;
        sync();
      },
      { rootMargin: "120px" },
    );
    inViewObserver.observe(canvas);

    resize();

    if (reduceMotion.matches) {
      drawStill();
    } else {
      // Fine pointers only. On a touch screen there is no hover to follow, and
      // a pointermove listener there fires on every drag of the page.
      if (window.matchMedia("(pointer: fine)").matches) {
        window.addEventListener("pointermove", onPointerMove, { passive: true });
      }
      sync();
    }

    document.addEventListener("visibilitychange", onVisibility);
    reduceMotion.addEventListener("change", onMotionChange);
    compact.addEventListener("change", resize);

    return () => {
      stop();
      observer.disconnect();
      inViewObserver.disconnect();
      window.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("visibilitychange", onVisibility);
      reduceMotion.removeEventListener("change", onMotionChange);
      compact.removeEventListener("change", resize);
      surface?.style.removeProperty("--hero-parallax-x");
      surface?.style.removeProperty("--hero-parallax-y");
    };
  }, [surfaceRef]);

  return <canvas ref={canvasRef} aria-hidden="true" className={cn("block", className)} />;
}
