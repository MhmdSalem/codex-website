/**
 * The shared stage state.
 *
 * Scenes animate numbers; layers render them. A scene never touches the DOM,
 * which is what lets a canvas layer, a CSS layer and an SVG layer be
 * choreographed by one timeline without any of them knowing about each other.
 *
 * Every value is normalised 0–1 unless noted, so a scene can tween it without
 * knowing what unit the layer will turn it into.
 */
export interface StageState {
  /** Film grain opacity. */
  grain: number;
  /** Density and brightness of the dust field. */
  particles: number;
  /** Edge falloff. Encloses the frame so the light pool has walls. */
  vignette: number;
  /** Camera push, 0 at the first frame and 1 at the last. */
  camera: number;
  /** How much light the pointer is allowed to emit. */
  light: number;
  /** Handoff to the homepage. */
  exit: number;
}

export function createStageState(): StageState {
  return {
    grain: 0,
    particles: 0,
    vignette: 0,
    camera: 0,
    light: 0,
    exit: 0,
  };
}

/** Pointer position in CSS pixels, plus the smoothed value the layers read. */
export interface PointerState {
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  /** True once the visitor has actually moved a pointer. */
  engaged: boolean;
}

export function createPointerState(width: number, height: number): PointerState {
  const x = width / 2;
  const y = height / 2;
  return { x, y, targetX: x, targetY: y, engaged: false };
}
