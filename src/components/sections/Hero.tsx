"use client";

import { useTranslations } from "next-intl";

import { withAccent } from "@/components/ui/Accent";
import { Arrow } from "@/components/ui/Arrow";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { OPENING_DONE_EVENT, pointer } from "@/experience/caret/pointer";
import styles from "@/experience/hero/field.module.css";
import { HeroField } from "@/experience/hero/HeroField";
import type { ResolvedLink } from "@/lib/links";
import { cn } from "@/lib/utils";
import { durations, easings, staggers } from "@/motion/config";
import { SplitText } from "@/motion/gsap";
import { useGsapScope } from "@/motion/hooks/useGsapScope";

interface HeroProps {
  eyebrow: string;
  headline: string;
  subheading: string;
  /** CMS-driven when set, falling back to the localised default. */
  primary: ResolvedLink;
  secondary: ResolvedLink;
}

/** How far the blueprint drifts under the pointer, in px, at the viewport edge. */
const BLUEPRINT_DRIFT = 14;

/**
 * The homepage opening: a dark room drawn in light.
 *
 * The claim on the leading side; behind and beside it, a hairline grid that is
 * only visible where the lamp reaches, and a blueprint of a product drawn on
 * as the page arrives. The lamp is the caret — the same eased position the
 * cursor publishes — so the bar the visitor carries is what lights the room.
 *
 * The entrance is one timeline. It animates *from* hidden, so the server
 * markup is the finished state and the hero is complete without JavaScript and
 * under reduced motion. When the opening is running it waits for the handoff;
 * otherwise it plays at once.
 */
export function Hero({ eyebrow, headline, subheading, primary, secondary }: HeroProps) {
  const t = useTranslations("home");

  const rootRef = useGsapScope<HTMLDivElement>(({ gsap, q, container, capability }) => {
    const isRtl = container.closest("[dir=rtl]") !== null;
    const headlineEl = q("[data-hero-headline]")[0];
    const field = q("[data-hero-field]")[0] as HTMLElement | undefined;
    const blueprint = q("[data-hero-blueprint]")[0] as HTMLElement | undefined;
    const strokes = q("[data-hero-blueprint] :is(path, line, rect, circle, polyline)");

    // Lines, not characters — and never in Arabic, where a per-line box
    // breaks the joining and the claim reads as loose glyphs. In RTL the whole
    // headline rises through one mask instead.
    const split =
      headlineEl && !isRtl ? new SplitText(headlineEl, { type: "lines", mask: "lines" }) : null;
    const lines = split?.lines?.length ? split.lines : headlineEl ? [headlineEl] : [];

    // ------------------------------------------------------------- draw-on prep
    // Every stroke starts fully hidden along its own length, so the blueprint
    // is drawn rather than faded. Lengths are read once, before anything moves.
    for (const stroke of strokes) {
      const geometry = stroke as SVGGeometryElement;
      const length = typeof geometry.getTotalLength === "function" ? geometry.getTotalLength() : 0;
      const dash = length > 0 ? length : 600;
      gsap.set(stroke, { strokeDasharray: dash, strokeDashoffset: dash });
    }

    // ---------------------------------------------------------------- entrance
    const timeline = gsap.timeline({
      defaults: { ease: easings.outExpo },
      paused: true,
      // SplitText bakes one div per line and those divs do not reflow; once the
      // reveal has landed the headline goes back to a plain `h1`.
      onComplete: () => split?.revert(),
    });

    timeline
      .from(q("[data-hero-eyebrow]"), { autoAlpha: 0, y: 10, duration: durations.slow }, 0)
      .from(lines, { yPercent: 110, duration: durations.reveal, stagger: staggers.loose }, 0.08)
      .from(q("[data-hero-lead]"), { autoAlpha: 0, y: 14, duration: durations.slow }, 0.5)
      .from(
        q("[data-hero-action]"),
        { autoAlpha: 0, y: 14, duration: durations.slow, stagger: staggers.base },
        0.65,
      )
      .from(q("[data-hero-cue]"), { autoAlpha: 0, duration: durations.slow }, 1.1)
      // The room is lit after the sentence lands, and the blueprint is drawn
      // across the next two seconds — long enough to be seen being drawn.
      // `opacity`, not `autoAlpha`: a hidden `visibility` here is inherited by
      // the blueprint, and the scroll tween below would record that as the
      // blueprint's own resting state.
      .from(q("[data-hero-field]"), { opacity: 0, duration: durations.reveal }, 0.2)
      .to(
        strokes,
        { strokeDashoffset: 0, duration: 2.2, stagger: 0.012, ease: "power1.inOut" },
        0.45,
      );

    // The opening owns the viewport until it hands the bar over; the hero's
    // entrance is what the handoff lands on.
    const waiting = document.documentElement.dataset.prologue === "running";
    const play = () => timeline.play();
    if (waiting) window.addEventListener(OPENING_DONE_EVENT, play, { once: true });
    else play();

    // ----------------------------------------------------------------- the lamp
    // Follows the caret's eased position, converted into the hero's own box.
    // Before the caret exists the lamp rests where the stylesheet put it.
    let cleanupTick: (() => void) | undefined;
    if (field && !capability.isCoarsePointer) {
      const driftX = blueprint
        ? gsap.quickTo(blueprint, "x", { duration: 0.9, ease: easings.outSoft })
        : undefined;
      const driftY = blueprint
        ? gsap.quickTo(blueprint, "y", { duration: 0.9, ease: easings.outSoft })
        : undefined;

      const tick = () => {
        if (!pointer.active) return;
        const rect = container.getBoundingClientRect();
        if (rect.bottom < 0) return;
        const x = pointer.cx - rect.left;
        const y = pointer.cy - rect.top;
        field.style.setProperty("--lx", `${x.toFixed(1)}px`);
        field.style.setProperty("--ly", `${y.toFixed(1)}px`);

        const nx = x / rect.width - 0.5;
        const ny = y / rect.height - 0.5;
        driftX?.(nx * BLUEPRINT_DRIFT * (isRtl ? -1 : 1));
        driftY?.(ny * BLUEPRINT_DRIFT * 0.6);
      };
      gsap.ticker.add(tick);
      cleanupTick = () => gsap.ticker.remove(tick);
    }

    // ------------------------------------------------------------------ leaving
    // Scrubbed, so it belongs to the scroll rather than playing at it.
    gsap.to(q("[data-hero-content]"), {
      yPercent: -6,
      autoAlpha: 0.2,
      ease: "none",
      scrollTrigger: { trigger: container, start: "top top", end: "bottom top", scrub: true },
    });
    if (blueprint) {
      // Explicit start values: the entrance is still running when this is
      // created, so nothing about the element's current state can be trusted
      // as its resting one.
      gsap.fromTo(
        blueprint,
        { yPercent: 0, opacity: 1 },
        {
          yPercent: -12,
          opacity: 0.35,
          ease: "none",
          immediateRender: false,
          scrollTrigger: { trigger: container, start: "top top", end: "bottom top", scrub: true },
        },
      );
    }

    return () => {
      window.removeEventListener(OPENING_DONE_EVENT, play);
      cleanupTick?.();
      split?.revert();
    };
  });

  return (
    <Section
      spacing="flush"
      label={eyebrow}
      className={cn(
        "isolate overflow-hidden",
        // `main` pads for the fixed header so ordinary pages start below it. The
        // hero is the one section that owns the whole viewport and renders *under*
        // the header, so it takes that padding back and clears the header itself.
        "mt-[calc(var(--spacing-header)*-1)]",
      )}
    >
      <div
        ref={rootRef}
        className={cn(
          "relative flex min-h-svh flex-col justify-center",
          "pt-[calc(var(--header-height)+var(--spacing-gutter))]",
          // The extra padding on `lg` reserves the band the scroll cue sits in,
          // so vertically centred content never runs into it.
          "pb-gutter lg:pb-[calc(var(--spacing-gutter)+4rem)]",
        )}
      >
        <HeroField />

        <Container className="relative z-10">
          {/*
            Held to a little under half the measure, which leaves the blueprint
            its side of the composition on a laptop. On a phone the blueprint
            sits behind the claim, dimmed, and the claim takes the width.
          */}
          <div data-hero-content className="lg:max-w-[46%]">
            <div data-hero-eyebrow className="flex items-center gap-4">
              <span className="font-mono text-micro tracking-widest text-white/80 uppercase">
                {eyebrow}
              </span>
              <span aria-hidden className="h-px w-9 bg-accent" />
            </div>

            {/*
              Capped so the Arabic claim wraps as two lines — الفكرة, then the
              product — rather than one long ribbon or a stack of single words.
              English follows the same measure. The wrapper is the mask the
              Arabic headline rises through; in English SplitText masks each
              line on its own.
            */}
            <div className="mt-7 overflow-hidden">
              <h1
                data-hero-headline
                className={cn(
                  "max-w-[18ch] font-display text-title-1 text-white",
                  // The one place the display face is set at 700. Everywhere
                  // else it is 500; the opening claim is the single moment the
                  // brand is allowed to be heavy, and at this size 500 reads as
                  // thin.
                  "font-bold",
                )}
              >
                {withAccent(headline)}
              </h1>
            </div>

            <p data-hero-lead className="mt-7 max-w-[57ch] text-caption text-muted">
              {subheading}
            </p>

            <div className="mt-9 flex w-full flex-col gap-3 xs:w-auto xs:flex-row xs:flex-wrap xs:items-center">
              <span data-hero-action className="inline-flex w-full xs:w-auto">
                <Button
                  href={primary.href}
                  external={primary.external}
                  newTab={primary.newTab}
                  variant="primary"
                  size="sm"
                  className="w-full px-6 py-3 xs:w-auto lg:py-2.5"
                >
                  {primary.label}
                  <Arrow />
                </Button>
              </span>
              <span data-hero-action className="inline-flex w-full xs:w-auto">
                <Button
                  href={secondary.href}
                  external={secondary.external}
                  newTab={secondary.newTab}
                  variant="outline"
                  size="sm"
                  className="w-full px-6 py-3 xs:w-auto lg:py-2.5"
                >
                  {secondary.label}
                  <Arrow />
                </Button>
              </span>
            </div>
          </div>
        </Container>

        {/*
          Out of the flow deliberately, and from `lg` only: below that the
          section is taller than the screen and the page has already said it
          continues.
        */}
        <div
          data-hero-cue
          aria-hidden="true"
          className="absolute inset-x-0 bottom-7 hidden flex-col items-center gap-3 lg:flex"
        >
          <span className="font-mono text-micro tracking-widest text-white/45 uppercase">
            {t("scrollHint")}
          </span>
          <span className="flex h-6 w-4 items-start justify-center rounded-full border border-white/30 pt-1">
            <span className={cn(styles.scrollDot, "size-1 rounded-full bg-accent")} />
          </span>
        </div>
      </div>
    </Section>
  );
}
