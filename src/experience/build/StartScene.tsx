"use client";

import { Arrow } from "@/components/ui/Arrow";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { useGsapScope } from "@/motion/hooks/useGsapScope";

import { glowAccent } from "./accent";
import styles from "./build.module.css";

export interface StartSceneProps {
  command: string;
  eyebrow: string;
  headline: string;
  body: string;
  cta: { label: string; href: string };
  or: string;
  email?: string;
  prompt: string;
}

/**
 * Scene 06 — start.
 *
 * The invitation, typed at a prompt: when the scene comes into view the
 * command that would start the visitor's project writes itself out.
 */
export function StartScene({ command, eyebrow, headline, body, cta, or, email, prompt }: StartSceneProps) {
  const rootRef = useGsapScope<HTMLElement>(({ gsap, q, container }) => {
    const target = q("[data-prompt]")[0];
    const typed = { length: 0 };

    gsap
      .timeline({ scrollTrigger: { trigger: container, start: "top 65%", once: true } })
      .from(q("[data-rise]"), { y: 30, autoAlpha: 0, duration: 1.1, stagger: 0.1 })
      .to(
        typed,
        {
          length: prompt.length,
          duration: prompt.length * 0.06,
          ease: `steps(${prompt.length})`,
          onUpdate: () => {
            if (target) target.textContent = prompt.slice(0, Math.round(typed.length));
          },
        },
        0.6,
      );
  });

  return (
    <section ref={rootRef} id="closingCta" aria-label={eyebrow} className={styles.scene}>
      <div className={cn(styles.wrap, styles.wrapSingle)}>
        <div>
          <div data-rise className={styles.cmd}>
            {command}
          </div>
          <h2 data-rise className={styles.h2}>
            {glowAccent(headline)}
          </h2>
          <p data-rise className={styles.lead}>
            {body}
          </p>
          <div data-rise className={styles.prompt} aria-hidden="true">
            <span className={styles.promptD}>$</span>
            <span data-prompt />
            <span className={styles.caret} />
          </div>
          <div data-rise className={styles.ctas}>
            <Button href={cta.href} variant="primary" size="md">
              {cta.label}
              <Arrow />
            </Button>
            {email ? (
              <span className="inline-flex items-center gap-2 text-caption text-subtle">
                {or}
                <a href={`mailto:${email}`} className={styles.email}>
                  {email}
                </a>
              </span>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
