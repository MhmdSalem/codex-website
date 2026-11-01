"use client";

import { cn } from "@/lib/utils";
import { useGsapScope } from "@/motion/hooks/useGsapScope";

import { glowAccent } from "./accent";
import styles from "./build.module.css";

export interface IntroSceneProps {
  command: string;
  eyebrow: string;
  lines: string[];
  support: string;
}

/**
 * Scene 02 — the idea, in four sentences.
 *
 * The one quiet moment between the editor and the build. The lines sit dim
 * and light up one after another as the reader scrolls through, so the claim
 * is read at the reader's pace rather than announced.
 */
export function IntroScene({ command, eyebrow, lines, support }: IntroSceneProps) {
  const rootRef = useGsapScope<HTMLElement>(({ gsap, q, container }) => {
    const lineEls = q("[data-line]");
    gsap
      .timeline({
        scrollTrigger: { trigger: container, start: "top 70%", end: "bottom 60%", scrub: 0.6 },
      })
      .to(lineEls, { opacity: 1, duration: 1, stagger: 1, ease: "none" })
      .from(q("[data-support]"), { autoAlpha: 0, y: 20, duration: 1 }, ">-0.5");
  });

  return (
    <section ref={rootRef} id="intro" aria-label={eyebrow} className={styles.scene}>
      <div className={cn(styles.wrap)}>
        <div>
          <div className={styles.cmd}>{command}</div>
          <p className={styles.introLines}>
            {lines.map((line, index) => (
              <span key={index} data-line className={styles.introLine}>
                {glowAccent(line)}
              </span>
            ))}
          </p>
        </div>
        <p data-support className={styles.lead}>
          {support}
        </p>
      </div>
    </section>
  );
}
