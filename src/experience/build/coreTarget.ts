/**
 * Where the core should be, when a scene asks for it.
 *
 * The core drifts across the viewport on its own. A scene that wants the core
 * at a particular point — the services growing out of it — writes its target
 * here every frame and the core blends toward it; `blend` at 0 hands the core
 * back to its own drift. One record, no events, so there is nothing to miss.
 */
export const coreTarget = {
  /** 0 = free drift, 1 = exactly on the target. */
  blend: 0,
  /** Viewport coordinates of the target centre, in px. */
  x: 0,
  y: 0,
  /** Scale the core should take at the target, relative to its resting size. */
  scale: 1,
};
