import type { IconName } from "./Icon";

/**
 * The scene as numbers.
 *
 * Everything the canvas draws is a function of these seven values, and nothing
 * else. One GSAP timeline scrubs them from the scroll position; the render loop
 * reads them. That split is what makes the scene reversible for free: there is
 * no "on enter" and no "has fired", so scrolling up cannot leave anything
 * behind — the picture at scroll position X is the same picture whichever
 * direction you arrived from.
 */
export interface Stage {
  /** State one framing: the core alone, with the headline. */
  hero: number;
  /** State two: the five fragments are present. */
  chaos: number;
  /** Data paths between the fragments and the core. */
  link: number;
  /** 0 = fragments at rest, 1 = the last one has been drawn in. */
  pull: number;
  /** State three: the dashboard has assembled out of the core. */
  dash: number;
  /** 0 = the mark sits in the core, 1 = it has landed in the dashboard. */
  glyph: number;
  /** Processing. Drives every glow in the scene. */
  energy: number;
}

export const OPENING: Stage = {
  hero: 1,
  chaos: 0,
  link: 0,
  pull: 0,
  dash: 0,
  glyph: 0,
  energy: 0.5,
};

/**
 * The frame drawn under `prefers-reduced-motion`: the end of the story, held
 * still. The mark stays in the core (`glyph: 0`) because in that mode the
 * dashboard is a block further down the page rather than a panel on top of the
 * core, so there is nowhere for it to travel to.
 */
export const SETTLED: Stage = {
  // Enough `hero` to keep the rim defined: this frame has to read as an object
  // in a still image, with no motion to explain what it is.
  hero: 0.6,
  chaos: 0,
  link: 0.5,
  pull: 1,
  dash: 1,
  glyph: 0,
  energy: 0.72,
};

/** What a business runs on before it runs on software. */
export interface Fragment {
  id: string;
  label: string;
  icon: IconName;
  /**
   * Rest position, as a fraction of the half-viewport measured from the core.
   * Fractions rather than pixels or `min(w,h)` units so the five stay inside
   * the frame on any aspect ratio without a breakpoint ladder.
   */
  fx: number;
  fy: number;
  /** Phase offset for the idle float, so the five never bob in unison. */
  drift: number;
}

export const FRAGMENTS: readonly Fragment[] = [
  { id: "sheets", label: "Spreadsheets", icon: "sheet", fx: -0.64, fy: -0.48, drift: 0 },
  { id: "whatsapp", label: "WhatsApp", icon: "chat", fx: 0.58, fy: -0.58, drift: 1.7 },
  { id: "pdf", label: "PDF files", icon: "file", fx: 0.74, fy: 0.1, drift: 3.1 },
  { id: "email", label: "Emails", icon: "mail", fx: -0.76, fy: 0.22, drift: 4.4 },
  { id: "data", label: "Scattered data", icon: "data", fx: 0.08, fy: 0.68, drift: 5.6 },
];

export const clamp01 = (value: number) => (value < 0 ? 0 : value > 1 ? 1 : value);
export const lerp = (from: number, to: number, t: number) => from + (to - from) * t;
export const smoothstep = (t: number) => t * t * (3 - 2 * t);

/** Deterministic per-index randomness, so a resize never reshuffles the dust. */
export function noise(index: number) {
  const value = Math.sin(index * 12.9898 + 78.233) * 43758.5453;
  return value - Math.floor(value);
}

/**
 * How far one fragment has travelled, given the scene's overall `pull`.
 *
 * The five arrive in sequence rather than together: five plates converging on
 * one point at the same instant is a collapse, five arriving in turn is a
 * system being assembled.
 */
export function fragmentPull(pull: number, index: number, count: number) {
  const step = 0.09;
  const span = 1 - step * (count - 1);
  return smoothstep(clamp01((pull - index * step) / span));
}

/**
 * How far a fragment has dissolved into the core.
 *
 * It starts well before the fragment arrives, and that is deliberate: a plate
 * that stays solid until it reaches the centre parks a label on top of the mark
 * and reads as a collision. Fading it across the last third of the journey reads
 * as the core taking it in.
 */
export function absorbed(pullOfFragment: number) {
  return smoothstep(clamp01((pullOfFragment - 0.62) / 0.38));
}

export interface StoryParts {
  headline: HTMLElement;
  chaosNote: HTMLElement;
  dashNote: HTMLElement;
  cue: HTMLElement;
  dashboard: HTMLElement;
  dashRows: HTMLElement[];
  spark: SVGPathElement | null;
}

/**
 * The story, in one timeline.
 *
 * Durations are fractions of the scene's scroll distance, so the numbers below
 * read as a storyboard: state one holds for the first sixth, the fragments
 * arrive over the second quarter, the pull runs through the middle, and the
 * dashboard assembles in the last quarter. The overlaps are the point — the
 * fragments start moving before the paths have finished drawing, and the
 * dashboard begins to exist before the last fragment lands, so there is never a
 * frame where one thing has ended and the next has not begun.
 *
 * `ease: "none"` on the stage values by default: they are being scrubbed by a
 * scrollbar, and an eased tween inside a scrub reads as the scroll slipping.
 * The exceptions are marked.
 */
export function choreograph(tl: gsap.core.Timeline, stage: Stage, parts: StoryParts) {
  const { headline, chaosNote, dashNote, cue, dashboard, dashRows, spark } = parts;

  tl
    // ── State one → the frame opens up ─────────────────────────────────────
    .to(cue, { opacity: 0, duration: 0.06 }, 0.02)
    .to(headline, { opacity: 0, y: -24, duration: 0.12 }, 0.06)
    .to(stage, { hero: 0, duration: 0.18 }, 0.04)

    // ── State two → the fragments arrive, unconnected ──────────────────────
    .to(stage, { chaos: 1, duration: 0.18, ease: "power2.out" }, 0.14)
    .fromTo(chaosNote, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.1 }, 0.2)

    // ── The paths appear, and the core starts pulling ──────────────────────
    .to(stage, { link: 1, duration: 0.16 }, 0.34)
    .to(stage, { pull: 1, duration: 0.34, ease: "power1.inOut" }, 0.44)
    .to(chaosNote, { opacity: 0, y: -16, duration: 0.1 }, 0.5)
    .to(stage, { energy: 1, duration: 0.28 }, 0.5)

    // ── State three → the dashboard comes out of the core ──────────────────
    .to(stage, { dash: 1, duration: 0.2, ease: "power2.out" }, 0.74)
    .fromTo(
      dashboard,
      { opacity: 0, scale: 0.9 },
      // The one eased visual: the panel arrives like something being placed,
      // which is the whole promise of the state it opens.
      { opacity: 1, scale: 1, duration: 0.22, ease: "power3.out" },
      0.74,
    )
    .fromTo(
      dashRows,
      { opacity: 0, y: 14 },
      { opacity: 1, y: 0, duration: 0.12, stagger: 0.03 },
      0.8,
    )
    .to(stage, { glyph: 1, duration: 0.12 }, 0.82)
    // Settles rather than stays at full: the system is running, not igniting.
    .to(stage, { energy: 0.55, duration: 0.14 }, 0.86)
    .fromTo(dashNote, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.1 }, 0.88);

  if (spark) {
    const length = spark.getTotalLength();
    tl.fromTo(
      spark,
      { strokeDasharray: length, strokeDashoffset: length },
      { strokeDashoffset: 0, duration: 0.14 },
      0.84,
    );
  }

  return tl;
}
