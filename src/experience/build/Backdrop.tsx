"use client";

import dynamic from "next/dynamic";

import styles from "./build.module.css";
import { Core } from "./Core";

/**
 * The network is the heaviest thing on the route and none of it is content,
 * so it arrives as its own chunk after hydration. `ssr: false` because a
 * canvas has nothing to render on the server.
 */
const NetworkField = dynamic(
  () => import("./NetworkField").then((module) => module.NetworkField),
  { ssr: false },
);

/**
 * Everything behind every page: the warm and cool glow, the living network,
 * and the core — the mark inside its turning rings, drifting with the scroll.
 * All of it is fixed at z 0; page content sits above at z 1 or as positioned
 * blocks later in the tree, because the body paints its own background over
 * anything at a negative z-index.
 */
export function Backdrop() {
  return (
    <>
      <div className={styles.glow} aria-hidden="true" />
      <NetworkField />
      <Core />
    </>
  );
}
