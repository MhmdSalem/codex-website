"use client";

import type { CSSProperties } from "react";

import { Arrow } from "@/components/ui/Arrow";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { easings } from "@/motion/config";
import { useGsapScope } from "@/motion/hooks/useGsapScope";

import { glowAccent, sceneTrigger } from "./accent";
import styles from "./build.module.css";
import { BUILD_STEPS } from "./code";
import { CodeTokens, EditorWindow } from "./CodeBlock";

export interface BuildSceneProps {
  command: string;
  eyebrow: string;
  headline: string;
  lead: string;
  cta: { label: string; href: string };
  editor: { file: string; lang: string; compiling: string; built: string };
  product: { name: string; tag: string };
  stage: {
    live: string;
    verified: string;
    admit: string;
    deny: string;
    checkins: string;
    guests: { a: string; b: string; c: string; d: string };
  };
  terminal: { run: string; open: string; verify: string; metrics: string; daawa: string };
  daawa: { name: string; tag: string; features: string[] };
}

const BARS = [30, 45, 38, 60, 52, 74, 68, 88, 100];

/**
 * Scene 03 — build.
 *
 * Pinned. The scroll steps through six lines of the gate loop; each line
 * highlights as it "runs" and the part of the product it produces appears on
 * the stage beside it — the gate opens, a badge is verified, a guest is denied,
 * guests are admitted, the count climbs. A terminal logs the build underneath,
 * and when the first product is built the second one arrives.
 */
export function BuildScene({
  command,
  eyebrow,
  headline,
  lead,
  cta,
  editor,
  product,
  stage,
  terminal,
  daawa,
}: BuildSceneProps) {
  const rootRef = useGsapScope<HTMLElement>(({ gsap, q, container }) => {
    const lines = q("[data-step]") as HTMLElement[];
    const pieces = (id: number) => q(`[data-piece="${id}"]`);
    const state = q("[data-editor-lang]")[0];
    const count = q("[data-count]")[0];
    const counter = { value: 0 };

    const timeline = gsap.timeline({
      defaults: { ease: easings.outExpo },
      scrollTrigger: sceneTrigger(container, "+=260%"),
    });

    BUILD_STEPS.forEach((step, index) => {
      const at = index;
      timeline.add(() => {
        lines.forEach((line, lineIndex) => line.classList.toggle(styles.lnHl!, lineIndex === index));
      }, at);
      step.pieces.forEach((id) => {
        timeline.to(
          pieces(id),
          { opacity: 1, y: 0, scale: 1, duration: 0.6, stagger: 0.08 },
          at + 0.1,
        );
      });
    });

    const last = BUILD_STEPS.length - 1;
    timeline.to(
      counter,
      {
        value: 1284,
        duration: 1,
        ease: "none",
        onUpdate: () => {
          if (count) count.textContent = Math.round(counter.value).toLocaleString("en-US");
        },
      },
      last + 0.3,
    );
    timeline.add(() => {
      if (state) state.textContent = editor.built;
    }, last + 0.6);
    timeline.to(q("[data-term-line]"), { opacity: 1, y: 0, duration: 0.4, stagger: 0.35 }, 1.5);
    timeline.to(q("[data-daawa]"), { opacity: 1, y: 0, duration: 0.8 }, last + 0.9);
    timeline.to({}, { duration: 0.8 });

    gsap.from(q("[data-editor]"), {
      x: -40,
      autoAlpha: 0,
      duration: 1,
      scrollTrigger: { trigger: container, start: "top 70%", once: true },
    });
    gsap.from(q("[data-rise]"), {
      y: 30,
      autoAlpha: 0,
      duration: 1.1,
      stagger: 0.1,
      scrollTrigger: { trigger: container, start: "top 75%", once: true },
    });
  });

  return (
    <section ref={rootRef} id="products" aria-label={eyebrow} className={styles.scene}>
      <div className={styles.wrap}>
        <div>
          <div data-rise className={styles.cmd}>
            {command}
          </div>
          <h2 data-rise className={styles.h2}>
            {glowAccent(headline)}
          </h2>
          <p data-rise className={styles.lead}>
            {lead}
          </p>
          <div data-rise className={cn(styles.ctas, "mb-8")}>
            <Button href={cta.href} variant="outline" size="sm">
              {cta.label}
              <Arrow />
            </Button>
          </div>

          <EditorWindow
            file={editor.file}
            lang={editor.compiling}
            dataAttr={{ "data-editor": "" }}
          >
            <pre className={styles.pre}>
              {BUILD_STEPS.map((step) => (
                <span key={step.number} data-step className={styles.ln} data-n={step.number}>
                  <CodeTokens line={step.line} />
                </span>
              ))}
            </pre>
          </EditorWindow>
        </div>

        <div className={styles.stage}>
          <div className={styles.app}>
            <div className={cn(styles.appHd, styles.piece)} data-piece="0">
              <b>{product.name}</b>
              <span className={cn(styles.chip, styles.piece)} data-piece="1">
                ● {stage.live}
              </span>
            </div>
            <div className={styles.appGrid}>
              <div className={cn(styles.card, styles.piece)} data-piece="2">
                <div className={styles.photo} />
                <div className={styles.l} />
                <div className={cn(styles.l, styles.lb)} />
                <span className={styles.ok}>{stage.verified}</span>
              </div>
              <div className={styles.rows}>
                <div className={cn(styles.row, styles.piece)} data-piece="3">
                  <i />
                  {stage.guests.a}
                  <em>{stage.admit}</em>
                </div>
                <div className={cn(styles.row, styles.rowDeny, styles.piece)} data-piece="4">
                  <i />
                  {stage.guests.b}
                  <em>{stage.deny}</em>
                </div>
                <div className={cn(styles.row, styles.piece)} data-piece="5">
                  <i />
                  {stage.guests.c}
                  <em>{stage.admit}</em>
                </div>
                <div className={cn(styles.row, styles.piece)} data-piece="5">
                  <i />
                  {stage.guests.d}
                  <em>{stage.admit}</em>
                </div>
              </div>
              <div className={cn(styles.chart, styles.piece)} data-piece="6">
                {BARS.map((height, index) => (
                  <i key={index} style={{ "--h": `${height}%` } as CSSProperties} />
                ))}
              </div>
              <div className={cn(styles.count, styles.piece)} data-piece="6">
                <b data-count>0</b>
                <span>{stage.checkins}</span>
              </div>
            </div>
          </div>

          <div className={styles.term}>
            <div data-term-line className={styles.termLine}>
              <span className={styles.termDim}>$</span> {terminal.run}
            </div>
            <div data-term-line className={styles.termLine}>
              <span className={styles.termOk}>✓</span> {terminal.open}
            </div>
            <div data-term-line className={styles.termLine}>
              <span className={styles.termOk}>✓</span> {terminal.verify}
            </div>
            <div data-term-line className={styles.termLine}>
              <span className={styles.termOk}>✓</span> {terminal.metrics}
            </div>
            <div data-term-line className={styles.termLine}>
              <span className={styles.termWarn}>→</span> {terminal.daawa}
            </div>
          </div>

          <div data-daawa className={styles.daawa}>
            <span className={styles.tag}>{daawa.tag}</span>
            <b>{daawa.name}</b>
            <ul>
              {daawa.features.map((feature) => (
                <li key={feature}>{feature}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
