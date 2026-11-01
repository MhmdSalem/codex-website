/**
 * The story, as data.
 *
 * Eight scenes, each declaring the one thing that matters: what the software
 * core is doing while the reader is looking at it. The core layer reads this
 * array and nothing else; the scene components read their copy and nothing else.
 * Reordering the story is reordering this array.
 */

export type CoreMode =
  /** A closed circle. The core at rest, before anything is built. */
  | "ring"
  /** Bands turning at different rates. One idea starting to gather systems. */
  | "orbit"
  /** No centre, no order, no links. The tools a business already has. */
  | "scatter"
  /** Even rings on even spokes. The same material, organised. */
  | "weave"
  /** A wide, faint ellipse. The core stepping back behind the products. */
  | "halo"
  /** A horizontal run. The core stretched into a process. */
  | "trace"
  /** Rings leaving the centre on a slow beat. A system in production. */
  | "pulse"
  /** Everything falling inward. The closing argument. */
  | "converge";

/**
 * What the core looks like at one point in the story.
 *
 * Positions are fractions of the viewport and radii are fractions of its short
 * side, so a state means the same thing on a phone and on a 4K display. The
 * 0–1 dials are all independent on purpose: `energy` is how bright the core is,
 * `link` is how connected its systems are, and the gap between those two is
 * most of the narrative — scene 3 is bright enough to see and completely
 * unlinked.
 */
export interface CoreState {
  mode: CoreMode;
  /** Centre of the core, as a fraction of the viewport. Mirrored in RTL. */
  x: number;
  y: number;
  /** Radius, as a fraction of the viewport's short side. */
  radius: number;
  /** Overall brightness. */
  energy: number;
  /** How strongly the systems are drawn to each other. */
  link: number;
  /** The closed ring around the core. */
  ring: number;
  /** Cold white at 0, brand terracotta at 1. */
  warmth: number;
  /** The wordmark inside the core. */
  word: number;
  /** The `</>` glyph inside the core. */
  glyph: number;
  /** Turns per second. Nothing here completes a revolution in under 20s. */
  spin: number;
}

export interface Scene {
  /** Also the DOM id, the anchor and the translation key. */
  id: string;
  core: CoreState;
}

/**
 * The eight states.
 *
 * Read the `mode` column top to bottom and the argument is visible without any
 * copy: ring, orbit, scatter, weave, halo, trace, pulse, converge. Gather,
 * break, repair, prove, explain, run, return.
 */
export const SCENES: readonly Scene[] = [
  {
    id: "intro",
    core: {
      mode: "ring",
      x: 0.5,
      // Slightly above centre so the ring's lower edge clears the closing line
      // of the scene rather than cutting through it.
      y: 0.46,
      radius: 0.25,
      energy: 0.6,
      link: 0.12,
      ring: 1,
      warmth: 0.8,
      word: 1,
      glyph: 0,
      spin: 0.04,
    },
  },
  {
    id: "spark",
    core: {
      // Off to the trailing side: this is the first scene with a headline, and
      // the headline gets the leading half of the frame.
      mode: "orbit",
      x: 0.68,
      y: 0.5,
      radius: 0.19,
      energy: 1,
      link: 0.55,
      ring: 0.14,
      warmth: 1,
      word: 0,
      glyph: 1,
      spin: 0.14,
    },
  },
  {
    id: "problem",
    core: {
      // Wide, dim and cold. The only scene where the core has no centre — the
      // material is all still here, and none of it is connected to anything.
      mode: "scatter",
      x: 0.46,
      y: 0.5,
      radius: 0.44,
      energy: 0.32,
      link: 0,
      ring: 0,
      warmth: 0.08,
      word: 0,
      glyph: 0,
      spin: 0.02,
    },
  },
  {
    id: "transformation",
    core: {
      // In the channel between the copy and the panel, with its bright centre on
      // the panel's leading edge: the light the system is emerging from. Smaller
      // than its neighbours because that channel is narrow at 1024px.
      mode: "weave",
      x: 0.53,
      y: 0.52,
      radius: 0.17,
      energy: 0.95,
      link: 1,
      ring: 0.34,
      warmth: 0.9,
      word: 0,
      // The glyph belongs to the scene where the core is the subject. Here it
      // would be a 40px mark half-covered by a panel.
      glyph: 0,
      spin: 0.1,
    },
  },
  {
    id: "products",
    core: {
      // Behind the work, not in front of it. Two product plates carry this
      // scene and the core is the light they are standing in.
      mode: "halo",
      x: 0.5,
      y: 0.46,
      radius: 0.52,
      energy: 0.38,
      link: 0.3,
      ring: 0.08,
      warmth: 0.45,
      word: 0,
      glyph: 0,
      spin: 0.03,
    },
  },
  {
    id: "process",
    core: {
      // On the hairline the four steps stand on, not behind their text: the run
      // and the rule are meant to read as the same line.
      mode: "trace",
      // Centred on the content column rather than the viewport, so the run stops
      // short of the chapter rail instead of crossing it.
      x: 0.56,
      y: 0.475,
      radius: 0.28,
      energy: 0.55,
      link: 0.85,
      ring: 0,
      warmth: 0.6,
      word: 0,
      glyph: 0,
      spin: 0,
    },
  },
  {
    id: "living",
    core: {
      mode: "pulse",
      x: 0.5,
      y: 0.5,
      radius: 0.46,
      energy: 0.55,
      link: 0.45,
      ring: 0.1,
      warmth: 0.4,
      word: 0,
      glyph: 0,
      spin: 0.05,
    },
  },
  {
    id: "convergence",
    core: {
      mode: "converge",
      x: 0.5,
      // Above centre, not on it: the mark returns inside the core here and the
      // closing line sits underneath it. At 0.5 the two occupy the same band.
      y: 0.38,
      radius: 0.3,
      energy: 1,
      link: 0.9,
      ring: 0.5,
      warmth: 1,
      word: 1,
      glyph: 0,
      spin: 0.08,
    },
  },
] as const;

export const SCENE_IDS = SCENES.map((scene) => scene.id);

/** Marks the elements the core layer measures. One per scene, in order. */
export const SCENE_ATTRIBUTE = "data-core-scene";

const KEYS = [
  "x",
  "y",
  "radius",
  "energy",
  "link",
  "ring",
  "warmth",
  "word",
  "glyph",
  "spin",
] as const satisfies readonly (keyof CoreState)[];

/** Straight linear blend of every dial. Easing is the caller's business. */
export function blendState(from: CoreState, to: CoreState, t: number): CoreState {
  const out = { mode: to.mode } as CoreState;
  for (const key of KEYS) out[key] = from[key] + (to[key] - from[key]) * t;
  return out;
}
