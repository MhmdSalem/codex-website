/**
 * CODEX TECH intro film — configuration.
 *
 * Everything tunable about the opening loader lives here so the component
 * itself stays about behaviour. See src/experience/intro/CodexIntroLoader.tsx.
 */
import { durations, easings } from "@/motion/config";

/**
 * The film. Change this one line to swap the file.
 *
 * Must stay lowercase and match the folder on disk exactly: the dev server runs
 * on a case-insensitive filesystem and production does not, so `/Videos/...`
 * would work locally and 404 once deployed.
 */
export const introVideoSrc = "/videos/codex-intro-desktop.mp4";

/** The portrait cut, framed for phones. */
export const introVideoSrcMobile = "/videos/codex-intro-mobile.mp4";

/** Below this viewport width the portrait cut is used. Tailwind's `md`. */
export const INTRO_BREAKPOINT = 768;

/**
 * Picks the cut for this device.
 *
 * Resolved in JS rather than with `<source media>` so only the chosen file is
 * ever requested: both cuts are around 9MB, and `media` on a video `<source>`
 * is honoured inconsistently across browsers. Client-side only — the caller
 * runs this before paint, after which the choice is fixed for the session, since
 * swapping the file mid-film would restart it.
 */
export function resolveIntroVideoSrc(): string {
  return window.matchMedia(`(min-width: ${INTRO_BREAKPOINT}px)`).matches
    ? introVideoSrc
    : introVideoSrcMobile;
}

/** Once per browser session. */
export const SESSION_KEY = "codex-intro-played";

/**
 * Set to `true` to replay the film on every load while working on it.
 *
 * For a one-off replay without touching this file, add `?intro=1` to the URL —
 * that works against a production build too.
 */
export const FORCE_REPLAY = false;

/** URL override that forces a replay. */
export const REPLAY_PARAM = "intro";

/**
 * The handoff to the homepage. A short inward scale under the fade reads as the
 * film receding rather than a light being switched off, which is what makes the
 * page underneath feel like it was always there.
 */
export const introExit = {
  duration: durations.transition,
  ease: easings.inOutQuart,
  scale: 0.985,
} as const;

/**
 * The film must never be able to trap a visitor on a black screen. Three
 * independent guards, because the failure modes are independent: the file can
 * fail outright, `ended` can simply not fire, and metadata can never arrive at
 * all — in which case the duration is unknown and only a wall-clock ceiling
 * helps.
 */
export const introGuards = {
  /** Added to the film's own duration before forcing the exit. */
  graceSeconds: 0.75,
  /** Hard ceiling from mount, used until a real duration is known. */
  ceilingSeconds: 20,
} as const;
