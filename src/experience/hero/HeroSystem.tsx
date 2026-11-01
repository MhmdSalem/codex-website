"use client";

import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";
import { useRef, type CSSProperties } from "react";

import { Logo } from "@/components/ui/Logo";
import { cn } from "@/lib/utils";

import styles from "./hero.module.css";
import { ModuleGlyph } from "./ModuleGlyph";
import { modulePanels, scene } from "./scene";

/**
 * Split out of the first load.
 *
 * The scene is the heaviest thing on the route and none of it is content, so it
 * arrives as its own chunk after hydration rather than sitting in the bundle that
 * has to parse before the headline can paint. `ssr: false` because a canvas has
 * nothing to render on the server — and if the chunk never arrives, everything
 * below still does.
 */
const SystemCanvas = dynamic(() => import("./SystemCanvas").then((module) => module.SystemCanvas), {
  ssr: false,
});

/**
 * The hero's software system.
 *
 * Geometry on a canvas, labels in the DOM. The split is deliberate: the plane,
 * the light and the traffic are pixels and belong on a canvas, while the six
 * module names are real localised content — canvas text would not translate,
 * would not shape for Arabic, could not be selected and would never reach a
 * screen reader.
 */
export function HeroSystem({ className }: { className?: string }) {
  const t = useTranslations("home");
  // Owns the parallax custom properties the canvas publishes each frame, so it
  // has to be the common ancestor of the canvas and the panels that read them.
  const surfaceRef = useRef<HTMLDivElement>(null);

  return (
    <div ref={surfaceRef} className={cn("relative flex flex-col gap-8 lg:gap-0", className)}>
      {/*
        Fills whatever box the parent gives it. On a laptop that box is the
        viewport-tall trailing layer; on a phone it is the dim field behind
        the claim.
      */}
      <div className="relative h-full w-full">
        <SystemCanvas
          className={cn(styles.veil, "absolute inset-0 size-full")}
          surfaceRef={surfaceRef}
        />

        {/*
          The mark at the centre of its own system. Sits above the core rather
          than on it, so it reads against the dark instead of dissolving into the
          light, and takes a shallow parallax depth so it stays put while the
          scene drifts around it. Decorative — the header carries the name.
        */}
        <div
          aria-hidden
          className={styles.mark}
          style={
            {
              left: `${scene.mark.x * 100}%`,
              top: `${scene.mark.y * 100}%`,
              "--depth": 0.25,
            } as CSSProperties
          }
        >
          <Logo className={cn(styles.float, "h-[clamp(1.75rem,4.4vw,3.75rem)]")} />
        </div>
      </div>

      {/*
        A list, not decoration. These name what the company builds, so they belong
        in the document.

        A sibling of the diagram rather than a child of it, which is what lets the
        same markup be both things: in flow it lands *under* the diagram, and on
        `lg` it goes `absolute inset-0` against this container — which is exactly
        the diagram's box, because the diagram is the container's only other child
        and fills it. Nested inside the diagram it would overlap the canvas in
        flow, since the canvas is absolutely positioned and takes no space.
      */}
      <ul aria-label={t("modulesLabel")} className={styles.panels}>
        {modulePanels.map((panel, index) => (
          <li
            key={panel.id}
            className={styles.panel}
            style={
              {
                "--x": `${panel.x * 100}%`,
                "--y": `${panel.y * 100}%`,
                "--depth": panel.depth,
                "--tilt-x": `${panel.tiltX}deg`,
                "--tilt-y": `${panel.tiltY}deg`,
                "--roll": `${panel.roll}deg`,
              } as CSSProperties
            }
          >
            <span
              className={styles.float}
              // Staggered, so the six never breathe in unison.
              style={{ animationDelay: `${index * -1.9}s` }}
            >
              <span
                className={cn(
                  styles.tilt,
                  styles.plate,
                  "rounded-xs border border-white/12 bg-black/40 px-3 py-2.5",
                  "backdrop-blur-[2px]",
                )}
              >
                <ModuleGlyph id={panel.id} className="size-5 text-white/70" />
                <span
                  data-eyebrow
                  className="font-mono text-[0.625rem] tracking-wider whitespace-nowrap text-white/75 uppercase"
                >
                  {t(`modules.${panel.id}`)}
                </span>
              </span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
