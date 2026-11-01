/**
 * The pointer, as the caret sees it.
 *
 * One mutable record shared between the caret (which writes it every frame)
 * and any scene that wants to light itself from the same place — the hero's
 * lamp follows the caret, not the raw pointer, so both move as one object.
 *
 * `x`/`y` are the last raw pointer position; `cx`/`cy` are where the caret
 * actually is after easing. `active` turns on at the first pointer move, or
 * when the opening hands its bar over — until then nothing should follow it.
 */
export const pointer = {
  x: 0,
  y: 0,
  cx: 0,
  cy: 0,
  active: false,
};

/** Fraction of the remaining distance the caret closes per frame. */
export const CARET_LERP = 0.18;

/** The caret trails the native pointer by this much, in px, so it never covers it. */
export const CARET_OFFSET = { x: 14, y: -13 } as const;

/** Fired by the opening when its bar becomes the caret, with viewport coordinates. */
export const CARET_ARRIVE_EVENT = "codex:caret-arrive";

/** Fired once the opening has fully left and the page may begin. */
export const OPENING_DONE_EVENT = "codex:opening-done";

export interface CaretArriveDetail {
  x: number;
  y: number;
}
