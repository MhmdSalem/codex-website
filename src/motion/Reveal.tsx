"use client";

import type { ReactNode } from "react";

import { durations, staggers } from "@/motion/config";
import { useGsapScope } from "@/motion/hooks/useGsapScope";

/**
 * One entrance for a whole page.
 *
 * Sections stay server components; this is the single client boundary that
 * gives them motion. Anything marked `data-reveal` rises once as it enters, and
 * siblings that share a parent arrive together as a group rather than as
 * unrelated events.
 *
 * The scope skips itself entirely under a reduced-motion preference, and the
 * server markup is the finished state — so the page is complete with no
 * JavaScript, and nothing here can leave content invisible.
 */
export function Reveal({ children }: { children: ReactNode }) {
  const ref = useGsapScope<HTMLDivElement>(({ gsap, q }) => {
    // Grouped by parent so a headline and its paragraph read as one arrival.
    const groups = new Map<Element, Element[]>();
    for (const element of q("[data-reveal]")) {
      const parent = element.parentElement ?? element;
      const group = groups.get(parent);
      if (group) group.push(element);
      else groups.set(parent, [element]);
    }

    for (const [parent, elements] of groups) {
      gsap.from(elements, {
        autoAlpha: 0,
        y: 24,
        duration: durations.reveal,
        stagger: staggers.loose,
        scrollTrigger: { trigger: parent, start: "top 88%", once: true },
      });
    }
  });

  return <div ref={ref}>{children}</div>;
}
