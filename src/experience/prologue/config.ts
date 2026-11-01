/**
 * THE FIRST LINE — prologue configuration.
 *
 * Scene windows, driver tuning and the session key, in one place. The full
 * concept, and the reason each of these numbers is what it is, lives in
 * docs/prologue.md.
 */

export type SceneId =
  "void" | "sketch" | "structure" | "design" | "products" | "scale" | "statement";

export interface SceneWindow {
  id: SceneId;
  /** Seconds on the master timeline. */
  start: number;
  end: number;
  /** Built scenes only. The film's duration is derived from these. */
  enabled: boolean;
  title: string;
}

/**
 * The full 22-second edit, declared up front.
 *
 * Windows are fixed now rather than discovered later, so pacing is a constraint
 * every scene is designed against. Scene lengths shorten through the middle and
 * open up again at the end: the film accelerates as the idea gains momentum,
 * then breathes for the payoff.
 */
export const sceneWindows: readonly SceneWindow[] = [
  { id: "void", start: 0, end: 3.0, enabled: true, title: "Void" },
  { id: "sketch", start: 3.0, end: 7.6, enabled: false, title: "Sketch" },
  { id: "structure", start: 7.6, end: 11.0, enabled: false, title: "Structure" },
  { id: "design", start: 11.0, end: 14.2, enabled: false, title: "Design" },
  { id: "products", start: 14.2, end: 16.8, enabled: false, title: "Products" },
  { id: "scale", start: 16.8, end: 19.0, enabled: false, title: "Scale" },
  { id: "statement", start: 19.0, end: 22.0, enabled: false, title: "Statement" },
];

export const enabledScenes = sceneWindows.filter((scene) => scene.enabled);

/**
 * The film runs only as long as the scenes that exist.
 *
 * Enabling the next scene extends the film automatically — no second number to
 * keep in sync, and no dead air at the end of a partial build.
 */
export const prologueDuration = enabledScenes.reduce((end, scene) => Math.max(end, scene.end), 0);

export const driver = {
  /**
   * Pixels of accumulated scroll that would advance the whole film. Roughly
   * four wheel flicks — enough that scrolling reads as leaning on the film
   * rather than dragging a scrubber.
   */
  scrollDistance: 1800,
  /** Fraction of the pending scroll boost consumed per frame. */
  scrollDrain: 0.1,
  /** One keyboard press is worth this fraction of the film. */
  keyStep: 0.12,
  /** Skip is choreographed, not a cut. */
  skipDuration: 0.9,
  /** Handoff to the homepage. */
  exitDuration: 0.9,
} as const;

export const stageTuning = {
  /** Pointer follow. Heavy enough to have mass, light enough not to feel broken. */
  pointerLerp: 0.12,
  /** Total camera travel across the film, as a scale delta. */
  cameraPush: 0.05,
  /**
   * Grain opacity at full strength. Scenes tween a normalised 0–1 value and the
   * layer converts it: a screen-blended noise plate at opacity 1 is television
   * static, and film grain lives around three percent.
   */
  grainOpacity: 0.06,
  /** Radius, in CSS pixels, within which the light reveals the dust. */
  discoverRadius: 340,
  /** Particles at full power, and on a low-power device. */
  particleCount: 90,
  particleCountLow: 44,
  /** Retina beyond this buys nothing on a field of soft dots. */
  maxPixelRatio: 1.5,
} as const;

export const SESSION_KEY = "codex:prologue:seen";
