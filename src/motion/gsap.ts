"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { durations, easings } from "./config";

/**
 * The only place GSAP plugins are registered.
 *
 * Importing GSAP from anywhere else risks a scene running before its plugin
 * exists, or the same plugin being registered twice in development.
 */
let registered = false;

export function registerGsap(): typeof gsap {
  if (!registered && typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger, SplitText);

    gsap.defaults({
      ease: easings.outExpo,
      duration: durations.slow,
    });

    ScrollTrigger.config({
      /** Ignore the mobile URL-bar resize, which otherwise re-runs every scene. */
      ignoreMobileResize: true,
    });

    registered = true;
  }

  return gsap;
}

export { gsap, ScrollTrigger, SplitText };
