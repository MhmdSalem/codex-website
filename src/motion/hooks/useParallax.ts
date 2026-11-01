"use client";

import { useGsapScope } from "./useGsapScope";

interface ParallaxOptions {
  /** Travel distance as a percentage of the element's height. */
  distance?: number;
  /** Scrub smoothing in seconds; `true` locks 1:1 to the scrollbar. */
  scrub?: number | boolean;
}

/**
 * Vertical parallax tied to scroll position.
 *
 * The travel distance is halved on low-power devices, where long transform
 * distances are the most common cause of dropped frames.
 */
export function useParallax<T extends HTMLElement = HTMLDivElement>({
  distance = 15,
  scrub = 1,
}: ParallaxOptions = {}) {
  return useGsapScope<T>(
    ({ gsap, container, capability }) => {
      const travel = capability.isLowPower ? distance / 2 : distance;

      gsap.fromTo(
        container,
        { yPercent: -travel / 2 },
        {
          yPercent: travel / 2,
          ease: "none",
          scrollTrigger: {
            trigger: container,
            start: "top bottom",
            end: "bottom top",
            scrub,
          },
        },
      );
    },
    [distance, scrub],
  );
}
