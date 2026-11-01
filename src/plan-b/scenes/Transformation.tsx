import { useTranslations } from "next-intl";
import type { CSSProperties } from "react";

import { cn } from "@/lib/utils";

import { accent } from "../copy";
import { Glyph } from "../Glyph";
import { SceneShell } from "../SceneShell";
import styles from "../scene.module.css";

const METRICS = ["flow", "automated", "manual"] as const;

/** Eleven months of something going up. Shape only — no axis, no claim. */
const TREND = "0,26 12,22 24,25 36,17 48,19 60,12 72,14 84,8 96,10 108,4";

/**
 * 04 — The Transformation.
 *
 * The wreckage reassembles into even rings and the links come back. The panel on
 * the trailing side is what the reassembly produced: the same information the
 * six scattered plates held, in one place, with the manual step gone.
 *
 * It is drawn rather than screenshotted on purpose. A fake dashboard image dates
 * the moment it is taken and claims a product that may not look like that; three
 * rows and a trend line claim only what they show.
 */
export function Transformation() {
  const t = useTranslations("planB.transformation");

  return (
    <SceneShell id="transformation" number="04" label={t("label")} gloss={t("gloss")}>
      {/* The copy column is narrow and the gap is wide: the core lives in that
          gap, and it is the only scene where the composition has to leave a
          vertical channel open in the middle of the frame. */}
      <div className="grid gap-14 lg:grid-cols-[minmax(0,15rem)_minmax(0,1fr)] lg:items-center lg:gap-24">
        <div>
          <h2 data-reveal className="font-display text-title-2 font-bold text-white">
            {accent(t("headline"))}
          </h2>
          <p data-reveal className="mt-6 text-caption text-muted">
            {t("lead")}
          </p>
        </div>

        <div
          data-reveal
          className={cn(styles.tilt, "w-full")}
          style={{ "--turn": "-9deg", "--lean": "2deg" } as CSSProperties}
        >
          <div className="overflow-hidden rounded-sm border border-white/12 bg-black/80 backdrop-blur-sm">
            <div className="flex items-center gap-2 border-b border-white/8 px-4 py-3">
              <span className="size-1.5 rounded-full bg-accent" />
              <span className="size-1.5 rounded-full bg-white/20" />
              <span className="size-1.5 rounded-full bg-white/20" />
              <span className="ms-2 font-mono text-[0.625rem] tracking-wider text-white/40 uppercase">
                {t("label")}
              </span>
            </div>

            <dl className="divide-y divide-white/6">
              {METRICS.map((metric) => (
                <div key={metric} className="flex items-baseline gap-4 px-4 py-4">
                  <dt className="flex-1 font-mono text-[0.625rem] tracking-wider text-white/45 uppercase">
                    {t(`metrics.${metric}.label`)}
                  </dt>
                  <dd className="font-display text-title-3 text-white tabular-nums">
                    {t(`metrics.${metric}.value`)}
                  </dd>
                </div>
              ))}
            </dl>

            <div className="border-t border-white/8 px-4 py-5">
              <svg
                viewBox="0 0 108 30"
                className="h-14 w-full text-accent"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.25"
                strokeLinecap="round"
                strokeLinejoin="round"
                preserveAspectRatio="none"
                aria-hidden="true"
                focusable="false"
              >
                <polyline points={TREND} />
              </svg>
              <p className="mt-3 flex items-center gap-2 font-mono text-[0.625rem] tracking-wider text-white/35 uppercase">
                <Glyph name="chart" className="size-3.5" />
                {t("gloss")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </SceneShell>
  );
}
