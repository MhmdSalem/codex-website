"use client";

import { Arrow } from "@/components/ui/Arrow";
import { Button } from "@/components/ui/Button";
import { OPENING_DONE_EVENT, pointer } from "@/experience/caret/pointer";
import type { ResolvedLink } from "@/lib/links";
import { cn } from "@/lib/utils";
import { easings } from "@/motion/config";
import { useGsapScope } from "@/motion/hooks/useGsapScope";

import { glowAccent } from "./accent";
import styles from "./build.module.css";
import { GATE_CODE, lineLength, planeText } from "./code";
import { CodeTokens, EditorWindow } from "./CodeBlock";

export interface WriteSceneProps {
  command: string;
  eyebrow: string;
  headline: string;
  subheading: string;
  primary: ResolvedLink;
  secondary: ResolvedLink;
  editor: { file: string; lang: string };
  kpis: { value: string; label: string }[];
}

/**
 * Scene 01 — write.
 *
 * The claim on the leading side; on the trailing side an editor types the gate
 * loop of the company's own product, character by character, in a window that
 * leans with the pointer. Behind both, three planes of loose code drift at
 * different depths. The entrance waits for the opening's handoff.
 */
export function WriteScene({
  command,
  eyebrow,
  headline,
  subheading,
  primary,
  secondary,
  editor,
  kpis,
}: WriteSceneProps) {
  const rootRef = useGsapScope<HTMLElement>(({ gsap, q, container, capability }) => {
    const typed = q("[data-typed]");
    const window_ = q("[data-editor]")[0] as HTMLElement | undefined;
    const planes = q("[data-plane]") as HTMLElement[];

    // ---------------------------------------------------------------- typing
    const timeline = gsap.timeline({ paused: true, defaults: { ease: easings.outExpo } });
    timeline.from(q("[data-rise]"), { y: 30, autoAlpha: 0, duration: 1.2, stagger: 0.1 }, 0);
    timeline.from(q("[data-editor]"), { y: 40, autoAlpha: 0, duration: 1.2 }, 0.1);
    typed.forEach((span, index) => {
      const length = lineLength(GATE_CODE[index] ?? []);
      timeline.to(
        span,
        {
          clipPath: "inset(0 0% 0 0)",
          duration: Math.max(0.08, length * 0.022),
          ease: `steps(${Math.max(1, length)})`,
        },
        index === 0 ? 0.5 : ">",
      );
    });
    q("[data-kpi]").forEach((element) => {
      const target = Number(element.getAttribute("data-kpi"));
      const decimals = Number(element.getAttribute("data-dec") ?? 0);
      const counter = { value: 0 };
      timeline.to(
        counter,
        {
          value: target,
          duration: 2,
          ease: "power2.out",
          onUpdate: () => {
            element.textContent = counter.value.toFixed(decimals);
          },
        },
        0.9,
      );
    });

    const waiting = document.documentElement.dataset.prologue === "running";
    const play = () => timeline.play();
    if (waiting) window.addEventListener(OPENING_DONE_EVENT, play, { once: true });
    else play();
    // Insurance: the opening has its own six-second ceiling, but the claim must
    // never depend on an event that might not arrive.
    const fallback = window.setTimeout(play, 7000);

    // ------------------------------------------------------- pointer + planes
    let tick: (() => void) | undefined;
    if (!capability.isCoarsePointer) {
      tick = () => {
        const px = pointer.active ? pointer.cx / window.innerWidth - 0.5 : 0;
        const py = pointer.active ? pointer.cy / window.innerHeight - 0.5 : 0;
        if (window_) {
          window_.style.transform = `perspective(1400px) rotateY(${(-10 + px * -10).toFixed(2)}deg) rotateX(${(4 + py * 8).toFixed(2)}deg)`;
        }
        const scroll = window.scrollY;
        planes.forEach((plane, index) => {
          const z = [-300, -120, -520][index] ?? -300;
          const rotate = [-10, 8, -22][index] ?? 0;
          const scale = [1.1, 1, 1.4][index] ?? 1;
          plane.style.transform = `translate3d(${(px * (30 + index * 20)).toFixed(1)}px, ${(py * (20 + index * 14) - scroll * (0.12 + index * 0.08)).toFixed(1)}px, ${z}px) rotateY(${rotate}deg) rotateX(${(py * 6).toFixed(2)}deg) scale(${scale})`;
        });
      };
      gsap.ticker.add(tick);
    }

    // ------------------------------------------------------------------ leave
    gsap.to(q("[data-wrap]"), {
      yPercent: -10,
      autoAlpha: 0.2,
      ease: "none",
      scrollTrigger: { trigger: container, start: "top top", end: "bottom top", scrub: true },
    });

    return () => {
      window.removeEventListener(OPENING_DONE_EVENT, play);
      window.clearTimeout(fallback);
      if (tick) gsap.ticker.remove(tick);
    };
  });

  return (
    <section
      ref={rootRef}
      id="hero"
      aria-label={eyebrow}
      className={cn(styles.scene, "mt-[calc(var(--spacing-header)*-1)] overflow-hidden")}
    >
      <div className={styles.planes} aria-hidden="true">
        <div data-plane className={styles.plane}>
          {planeText(0)}
        </div>
        <div data-plane className={cn(styles.plane, styles.plane2)}>
          {planeText(3)}
        </div>
        <div data-plane className={cn(styles.plane, styles.plane3)}>
          {planeText(5)}
        </div>
      </div>

      <div data-wrap className={styles.wrap}>
        <div>
          <div data-rise className={styles.cmd}>
            {command}
          </div>
          <h1 data-rise className={styles.h1}>
            {glowAccent(headline)}
          </h1>
          <p data-rise className={styles.lead}>
            {subheading}
          </p>
          <div data-rise className={styles.ctas}>
            <Button
              href={primary.href}
              external={primary.external}
              newTab={primary.newTab}
              variant="primary"
              size="md"
            >
              {primary.label}
              <Arrow />
            </Button>
            <Button
              href={secondary.href}
              external={secondary.external}
              newTab={secondary.newTab}
              variant="outline"
              size="md"
            >
              {secondary.label}
              <Arrow />
            </Button>
          </div>
          <div data-rise className={styles.kpis}>
            {kpis.map((kpi) => {
              const decimals = kpi.value.includes(".") ? kpi.value.split(".")[1]!.length : 0;
              return (
                <div key={kpi.label} className={styles.kpi}>
                  <b data-kpi={kpi.value} data-dec={decimals}>
                    {kpi.value}
                  </b>
                  <span>{kpi.label}</span>
                </div>
              );
            })}
          </div>
        </div>

        <EditorWindow file={editor.file} lang={editor.lang} dataAttr={{ "data-editor": "" }}>
          <pre className={styles.pre}>
            {GATE_CODE.map((line, index) => (
              <span key={index} className={styles.ln} data-n={index + 1}>
                <span data-typed className={styles.w}>
                  <CodeTokens line={line} />
                </span>
                {index === GATE_CODE.length - 1 ? <span className={styles.caret} /> : null}
              </span>
            ))}
          </pre>
        </EditorWindow>
      </div>
    </section>
  );
}
