import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

import { SCENE_ATTRIBUTE } from "./timeline";
import styles from "./scene.module.css";

interface SceneShellProps {
  /** Scene id from the timeline. Also the anchor and the measured element. */
  id: string;
  /** Position in the story, 1-based, as it is printed. */
  number: string;
  label: string;
  gloss: string;
  children: ReactNode;
  /** Applied to the content column, not the section. */
  className?: string;
}

/**
 * One chapter of the story.
 *
 * Two columns: a rail carrying the chapter number, and the scene itself. The
 * rail is what makes eight full-height scenes read as one document rather than
 * eight pages that happen to be stacked — the reader always knows which chapter
 * they are in and how much argument is left.
 *
 * The section carries the attribute the core layer measures. That is the entire
 * contract between a scene and the core: a scene declares where it is on the
 * page, and the core decides what to do about it.
 */
export function SceneShell({ id, number, label, gloss, children, className }: SceneShellProps) {
  return (
    <section
      id={id}
      aria-label={label}
      // Above the fixed core layer, and transparent, so the core shows through
      // rather than behind a panel.
      className="relative z-10 border-t border-hairline first:border-t-0"
      {...{ [SCENE_ATTRIBUTE]: true }}
    >
      <div className="mx-auto grid w-full max-w-wide lg:grid-cols-[minmax(0,14rem)_minmax(0,1fr)]">
        {/*
          The cell carries the rule and the rail carries the content. They have
          to be two elements: a sticky box shrinks to its content, so a border on
          the rail itself would draw a 6rem stub instead of a line down the scene.
        */}
        {/*
          Below `lg` the rail stacks above the scene, which puts the first one
          under the fixed header — so it clears the header at every breakpoint
          rather than only where it matters. Consistent spacing beats a rule that
          applies to one section.
        */}
        <div className="px-gutter pt-header lg:border-e lg:border-hairline lg:pt-0">
          <div className={styles.rail}>
            <p className="font-mono text-micro tracking-widest text-accent">{number}</p>
            {/* Metadata, not a heading: the scene's own headline is the `h2`, and
                a chapter number promoted into the outline would put eight of
                these above the eight sentences that carry the argument. */}
            <p className="mt-2 font-mono text-micro tracking-widest text-foreground uppercase">
              {label}
            </p>
            {/* The gloss is the chapter in one line — the summary a reader who
                scrolled past the scene would still be able to give. */}
            <p className="mt-3 max-w-[22ch] text-caption text-subtle">{gloss}</p>
          </div>
        </div>

        <div
          className={cn(
            "flex min-h-svh flex-col justify-center px-gutter py-block lg:py-section",
            className,
          )}
        >
          {children}
        </div>
      </div>
    </section>
  );
}
