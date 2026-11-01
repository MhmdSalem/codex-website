/**
 * The opening — configuration.
 *
 * Three seconds, drawn in code: the mark is typed across the dark, the bar at
 * its end stays, and that bar becomes the caret that accompanies the visitor
 * through the site. Replaces the twenty-second film in
 * src/experience/intro, which stays in the tree unused.
 */
import { durations, easings } from "@/motion/config";

/** Remembered so a refresh mid-opening still lands on the page. */
export const SESSION_KEY = "codex-opening-played";

/** `?intro=0` skips the opening while working on the page beneath it. */
export const REPLAY_PARAM = "intro";

/** Set to `true` to force the opening even when `?intro=0` is present. */
export const FORCE_REPLAY = false;

/**
 * Where the wordmark ends inside the logo's viewBox, as a fraction of its
 * width. Everything past this is the logo's own bar, which the opening hides:
 * the DOM bar riding the wipe lands exactly there and takes over the role.
 */
export const WORDMARK_END = 900 / 946;

/** The logo's bar, as fractions of the logo box. Measured from the SVG paths. */
export const BAR = {
  left: 909 / 946,
  width: 36 / 946,
  top: 8 / 174,
  height: 166 / 174,
} as const;

/** The number of discrete steps the wipe takes — one per glyph of `<codex/>`. */
export const TYPE_STEPS = 8;

export const timing = {
  /** Dark before anything happens. */
  settle: 0.3,
  /** The wipe. */
  type: 1.05,
  /** The bar blinks beside the finished mark. */
  hold: 0.55,
  /** The wordmark leaves. */
  fade: 0.5,
  /** The layer leaves. */
  exit: durations.transition,
  /** Wall-clock ceiling from mount; the opening must never trap a visitor. */
  ceiling: 6,
} as const;

export const openingEase = {
  out: easings.outExpo,
  inOut: easings.inOutQuart,
} as const;
