import type { gsap as Gsap } from "gsap";
import type { StageState } from "../state";

interface SceneContext {
  gsap: typeof Gsap;
  state: StageState;
}

/**
 * SCENE 01 — VOID · 0.0 → 3.0s
 *
 * Black. Then grain. Then dust. The visitor holds the only light source and has
 * to move it to discover that anything is there at all.
 *
 * Every beat is offset from the others on purpose: one motion owns each moment,
 * which is what buys the opening its calm. The timings below are the shooting
 * script in docs/prologue.md, in code.
 */
export function buildVoidScene({ gsap, state }: SceneContext): gsap.core.Timeline {
  const tl = gsap.timeline({ defaults: { ease: "none" } });

  // 0.0 → 0.35s is deliberately empty. Silence before the first note: without a
  // genuinely blank beat, the fade-in has nothing to be measured against.

  // Grain arrives first because it defines the medium — it is what tells the
  // eye this is a photographed space rather than an unstyled div.
  tl.to(state, { grain: 1, duration: 1.2, ease: "power1.inOut" }, 0.35);

  // The vignette closes around the frame so the light pool has walls. Without
  // it the darkness reads as "empty"; with it, as "unlit".
  tl.to(state, { vignette: 1, duration: 1.6, ease: "power2.out" }, 0.6);

  // The light becomes available slightly after the grain, so the first thing
  // the visitor does is wait, and the second thing is discover.
  tl.to(state, { light: 1, duration: 1.4, ease: "power2.out" }, 0.6);

  // Dust emerges last and never reaches full brightness. The room stays mostly
  // unknown, which is the entire emotional job of this scene.
  tl.to(state, { particles: 1, duration: 2.2, ease: "power2.inOut" }, 0.8);

  // The camera push runs the full length of the scene, linear and unbroken. It
  // is slow enough to be felt and not seen, and it never stops for the rest of
  // the film — the camera is always moving toward the idea.
  tl.to(state, { camera: 1, duration: 3 }, 0);

  return tl;
}
