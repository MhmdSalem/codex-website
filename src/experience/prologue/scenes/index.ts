import type { gsap as Gsap } from "gsap";
import type { SceneId } from "../config";
import type { StageState } from "../state";
import { buildVoidScene } from "./voidScene";

export interface SceneContext {
  gsap: typeof Gsap;
  state: StageState;
}

export type SceneBuilder = (context: SceneContext) => gsap.core.Timeline;

/**
 * Scene builders, keyed by id.
 *
 * A scene is a pure function returning a timeline. Adding the next one means
 * writing a builder, registering it here, and flipping `enabled` in the scene
 * window — nothing in the stage changes.
 */
const builders: Partial<Record<SceneId, SceneBuilder>> = {
  void: buildVoidScene,
};

export function getSceneBuilder(id: SceneId): SceneBuilder | undefined {
  return builders[id];
}
