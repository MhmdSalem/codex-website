/**
 * Motion constants, mirrored from the CSS design tokens.
 *
 * GSAP and Motion take seconds; CSS takes milliseconds. Keeping both in one
 * place is what stops a transition in JS from drifting away from the same
 * transition written in CSS.
 *
 * The choreography rules these values encode are documented in
 * docs/design-system.md § Motion Principles.
 */

export const easings = {
  linear: "none",
  outSoft: "power3.out",
  outExpo: "expo.out",
  inOutQuart: "power4.inOut",
  inOutCirc: "circ.inOut",
} as const;

/** Cubic-bézier equivalents for Motion and inline styles. */
export const bezier = {
  outSoft: [0.22, 1, 0.36, 1],
  outExpo: [0.16, 1, 0.3, 1],
  inOutQuart: [0.76, 0, 0.24, 1],
  inOutCirc: [0.85, 0, 0.15, 1],
  spring: [0.34, 1.56, 0.64, 1],
} as const satisfies Record<string, [number, number, number, number]>;

/** Seconds. */
export const durations = {
  instant: 0.12,
  fast: 0.24,
  base: 0.4,
  slow: 0.7,
  slower: 1.1,
  reveal: 1.4,
  transition: 0.9,
} as const;

/** Page-transition choreography, in seconds. */
export const transition = {
  curtainIn: 0.45,
  curtainHold: 0.12,
  curtainOut: 0.6,
  preloaderMin: 0.6,
  preloaderMax: 2,
} as const;

/** Seconds between staggered children. */
export const staggers = {
  tight: 0.03,
  base: 0.06,
  loose: 0.11,
} as const;

/**
 * Longest a stagger may run in total. Past this the tail of a list is still
 * arriving after the reader has moved on, so children are batched instead.
 */
export const STAGGER_MAX = 0.48;

/** Resolve a per-child stagger that keeps a list inside {@link STAGGER_MAX}. */
export function staggerFor(count: number, step: number = staggers.base) {
  if (count <= 1) return 0;
  return Math.min(step, STAGGER_MAX / (count - 1));
}

/**
 * Maximum translation a scroll-linked layer may take, as a fraction of its own
 * height. Anything beyond `background` reads as a glitch rather than depth.
 */
export const parallaxDepth = {
  background: 0.15,
  midground: 0.08,
  foreground: 0,
} as const;

/** Shared ScrollTrigger start positions so scenes fire consistently. */
export const scrollTriggerDefaults = {
  start: "top 85%",
  end: "bottom 15%",
  toggleActions: "play none none none",
} as const;

export const lenisOptions = {
  duration: 1.1,
  lerp: 0.1,
  wheelMultiplier: 1,
  touchMultiplier: 1.6,
  smoothWheel: true,
  /** Touch scrolling stays native — smoothing it costs more than it buys. */
  syncTouch: false,
  autoRaf: false,
} as const;

/** Hover choreography, in seconds. */
export const hover = {
  underline: 0.24,
  invert: 0.4,
  mediaScale: 0.7,
  magneticStrength: 0.35,
  magneticRadius: 120,
} as const;

export type EasingName = keyof typeof easings;
export type DurationName = keyof typeof durations;
export type ParallaxLayer = keyof typeof parallaxDepth;
