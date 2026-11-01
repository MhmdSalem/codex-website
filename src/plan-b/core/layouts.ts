/**
 * Where each point of the core goes, per mode.
 *
 * A mode is a pure function from a point's index to a position in core-local
 * units — 1.0 is the core's radius — so two modes can be blended by blending
 * their outputs. That is the mechanism behind the whole concept: the wreckage in
 * scene 3 is the same 140 points as the orbit in scene 2, moved, and the eye
 * follows an object that moves in a way it cannot follow an object that fades.
 *
 * Every function must be stable for a given `(index, time)` and must not
 * allocate: this runs 140 times per frame per mode, twice during a transition.
 */

import type { CoreMode } from "../timeline";

const TAU = Math.PI * 2;

export interface Seed {
  a: number;
  b: number;
  c: number;
}

export interface Placed {
  x: number;
  y: number;
  /** Multiplier on the base dot size. */
  size: number;
  /** 0 = cold white, 1 = fully lit. Scaled by the state's energy afterwards. */
  heat: number;
}

/**
 * Deterministic per-point randomness.
 *
 * Hashed rather than `Math.random()` so a resize — which reseeds — cannot
 * reshuffle the field. The core is a continuous object; it may not flinch when
 * the window changes size.
 */
export function seedFor(index: number): Seed {
  const hash = (salt: number) => {
    const value = Math.sin(index * 127.1 + salt * 311.7) * 43758.5453;
    return value - Math.floor(value);
  };
  return { a: hash(1), b: hash(2), c: hash(3) };
}

/** Writes into `out` rather than returning a new object. */
type Layout = (out: Placed, index: number, count: number, time: number, seed: Seed) => void;

/**
 * A closed circle, barely turning. The core before anything is built.
 *
 * The points sit in a band either side of the boundary rather than on it. On it,
 * they and the ring stroke land on the same pixels and cancel each other out —
 * the ring stops reading as an edge and the points stop reading as material.
 */
const ring: Layout = (out, index, count, time, seed) => {
  const angle = (index / count) * TAU + time * 0.06;
  const radius = 0.86 + seed.a * 0.42;
  out.x = Math.cos(angle) * radius;
  out.y = Math.sin(angle) * radius;
  out.size = 0.5 + seed.b * 0.5;
  out.heat = 0.3 + seed.c * 0.35;
};

/**
 * Three bands at three rates.
 *
 * Different periods per band is what stops this reading as one rotating image:
 * the bands slide past each other, so the shape is never the same twice.
 */
const orbit: Layout = (out, index, count, time, seed) => {
  const band = index % 3;
  const radius = (0.5 + band * 0.42) * (1 + (seed.a - 0.5) * 0.14);
  const angle = (index / count) * TAU * 2.4 + time * (0.5 - band * 0.13) + band * 1.7;
  out.x = Math.cos(angle) * radius;
  out.y = Math.sin(angle) * radius * 0.86;
  out.size = band === 0 ? 1.1 : 0.7;
  out.heat = band === 0 ? 1 : 0.55 + seed.b * 0.3;
};

/**
 * No centre and no order.
 *
 * The drift is per-point and slow, which reads as inert rather than alive —
 * these are files sitting in four places, not a system doing something.
 */
const scatter: Layout = (out, index, count, time, seed) => {
  const drift = time * (0.02 + seed.c * 0.03);
  out.x = (seed.a - 0.5) * 3.6 + Math.sin(drift + seed.b * TAU) * 0.06;
  out.y = (seed.b - 0.5) * 2.3 + Math.cos(drift + seed.a * TAU) * 0.06;
  out.size = 0.5 + seed.c * 0.8;
  out.heat = 0.12 + seed.a * 0.14;
};

/**
 * The same material, organised: five rings on regular spokes.
 *
 * Deliberately almost free of jitter. Every other mode is irregular, so the one
 * scene that claims to have fixed the mess has to look measured, and regularity
 * is the only visual property that reads as "engineered" on its own.
 */
const weave: Layout = (out, index, count, time, seed) => {
  const rings = 5;
  const band = index % rings;
  const step = Math.floor(index / rings);
  const perRing = Math.ceil(count / rings);
  const radius = 0.32 + band * 0.19;
  const angle = (step / perRing) * TAU + time * (0.14 + band * 0.03) + band * 0.42;
  out.x = Math.cos(angle) * radius;
  out.y = Math.sin(angle) * radius * 0.9;
  out.size = band === 0 ? 1 : 0.72;
  out.heat = 0.5 + (1 - band / rings) * 0.5 + seed.a * 0.08;
};

/** A wide, thin ellipse. Light for the products to stand in. */
const halo: Layout = (out, index, count, time, seed) => {
  const angle = (index / count) * TAU + time * 0.05;
  const radius = 1.15 + seed.a * 0.55;
  out.x = Math.cos(angle) * radius;
  out.y = Math.sin(angle) * radius * 0.44;
  out.size = 0.45 + seed.b * 0.5;
  out.heat = 0.2 + seed.c * 0.25;
};

/**
 * The core stretched into a line, with traffic running along it.
 *
 * The `flow` term moves points along the run rather than moving the run, so the
 * shape holds still while something travels through it — which is what a process
 * diagram is.
 */
const trace: Layout = (out, index, count, time, seed) => {
  const flow = (index / count + time * 0.05) % 1;
  out.x = (flow - 0.5) * 3.4;
  // Held to a narrow band. This mode runs along a row of type, and a field that
  // spreads the way the others do would be noise behind four paragraphs.
  out.y = Math.sin(flow * TAU * 1.5) * 0.08 + (seed.b - 0.5) * 0.16;
  out.size = 0.5 + seed.a * 0.7;
  // Brightest mid-run, so the line reads as travelled rather than lit.
  out.heat = 0.3 + Math.sin(flow * Math.PI) * 0.6;
};

/**
 * Rings leaving the centre on a slow beat.
 *
 * Each point owns a phase and restarts when it reaches the edge, so the beat is
 * continuous with no frame where the field is empty.
 */
const pulse: Layout = (out, index, count, time, seed) => {
  const phase = (time * 0.16 + seed.a) % 1;
  const radius = 0.2 + phase * 1.9;
  const angle = (index / count) * TAU + seed.b * 0.4;
  out.x = Math.cos(angle) * radius;
  out.y = Math.sin(angle) * radius * 0.62;
  out.size = 0.5 + seed.c * 0.6;
  // Fades on the way out: a wave that arrives at the frame edge at full
  // strength reads as a boundary rather than as distance.
  out.heat = (1 - phase) * 0.9;
};

/** Everything falling inward, on fixed radials. The closing argument. */
const converge: Layout = (out, index, count, time, seed) => {
  const phase = 1 - ((time * 0.13 + seed.a) % 1);
  const radius = 0.08 + phase * 2.3;
  const angle = (index / count) * TAU + seed.b * 0.5;
  out.x = Math.cos(angle) * radius;
  out.y = Math.sin(angle) * radius * 0.82;
  out.size = 0.5 + (1 - phase) * 0.9;
  out.heat = 0.25 + (1 - phase) * 0.75;
};

export const LAYOUTS: Record<CoreMode, Layout> = {
  ring,
  orbit,
  scatter,
  weave,
  halo,
  trace,
  pulse,
  converge,
};
