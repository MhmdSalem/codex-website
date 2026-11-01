import { Fragment } from "react";

import styles from "./build.module.css";

/**
 * `*marked*` fragments of a headline, set in the glowing accent.
 *
 * Same convention as `withAccent` in components/ui, with the build sequence's
 * own treatment: the accent here carries a glow, because the type is large
 * enough to be lit rather than merely coloured.
 */
export function glowAccent(text: string) {
  return text.split(/\*([^*]+)\*/g).map((part, index) =>
    index % 2 === 1 ? (
      <span key={index} className={styles.accent}>
        {part}
      </span>
    ) : (
      <Fragment key={index}>{part}</Fragment>
    ),
  );
}

/** Reads once whether the viewport is wide enough to pin a scene. */
export function canPin(): boolean {
  return typeof window !== "undefined" && window.matchMedia("(min-width: 64rem)").matches;
}

/**
 * The ScrollTrigger for a scrubbed scene.
 *
 * On a laptop the scene pins and the scroll drives it over `end`. On a phone
 * pinning a tall stacked section would trap the reader, so the same timeline
 * is scrubbed across the section's own travel through the viewport instead:
 * the story still plays as you scroll, it just does not hold the screen.
 */
export function sceneTrigger(container: HTMLElement, end: string) {
  return canPin()
    ? { trigger: container, start: "top top", end, pin: true, scrub: 0.5 }
    : { trigger: container, start: "top 70%", end: "bottom 40%", scrub: 0.5 };
}
