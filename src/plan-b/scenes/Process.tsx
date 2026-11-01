import { useTranslations } from "next-intl";

import { accent } from "../copy";
import { Glyph, type GlyphName } from "../Glyph";
import { SceneShell } from "../SceneShell";

const STEPS = [
  { id: "discover", glyph: "search" },
  { id: "design", glyph: "draft" },
  { id: "develop", glyph: "code" },
  { id: "launch", glyph: "launch" },
] as const satisfies readonly { id: string; glyph: GlyphName }[];

/**
 * 06 — How We Build.
 *
 * The core stops being a point and becomes a path: it stretches into a horizontal
 * run behind the four steps, with traffic moving along it. The hairline the steps
 * sit on is the same line the core is drawing, which is why the process reads as
 * one continuous thing rather than four boxes.
 */
export function Process() {
  const t = useTranslations("planB.process");

  return (
    <SceneShell id="process" number="06" label={t("label")} gloss={t("gloss")}>
      <h2 data-reveal className="max-w-[24ch] font-display text-title-2 font-bold text-white">
        {accent(t("headline"))}
      </h2>

      <ol className="relative mt-16 grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
        {/* The rail the steps stand on. Behind the markers, and only where there
            is a row for it to run along. */}
        <span
          aria-hidden="true"
          className="absolute inset-x-0 top-4 hidden h-px bg-hairline lg:block"
        />

        {STEPS.map((step, index) => (
          <li key={step.id} data-reveal className="relative">
            <span className="flex size-8 items-center justify-center rounded-full border border-white/15 bg-background text-accent">
              <Glyph name={step.glyph} className="size-4" />
            </span>
            <p className="mt-6 font-mono text-micro tracking-widest text-white/40">
              {String(index + 1).padStart(2, "0")}
            </p>
            <h3 className="mt-2 font-display text-title-3 text-white">
              {t(`steps.${step.id}.title`)}
            </h3>
            <p className="mt-3 max-w-[26ch] text-caption text-muted">
              {t(`steps.${step.id}.body`)}
            </p>
          </li>
        ))}
      </ol>
    </SceneShell>
  );
}
