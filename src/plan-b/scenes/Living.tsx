import { useTranslations } from "next-intl";

import { cn } from "@/lib/utils";

import { accent } from "../copy";
import { Glyph } from "../Glyph";
import { SceneShell } from "../SceneShell";
import styles from "../scene.module.css";

/**
 * 07 — Living Systems.
 *
 * The core settles into a beat and the panels answer it. Four readings from an
 * ordinary day: a count, a verification, a place, a dispatch. Between them they
 * say the one thing a software company has to prove — that the thing is running
 * right now, with people in it.
 */
export function Living() {
  const t = useTranslations("planB.living");

  return (
    <SceneShell id="living" number="07" label={t("label")} gloss={t("gloss")}>
      <div className="max-w-[30ch]">
        <h2 data-reveal className="font-display text-title-2 font-bold text-white">
          {accent(t("headline"))}
        </h2>
        <p data-reveal className="mt-6 text-caption text-muted">
          {t("lead")}
        </p>
      </div>

      <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Panel label={t("panels.registrations.label")}>
          <p className="font-display text-title-2 text-white tabular-nums">
            {t("panels.registrations.value")}
          </p>
          {/* A number on its own is a claim about the past. The bar is the part
              that says the number is still moving. */}
          <span className="mt-4 block h-px w-full bg-white/10">
            <span className={cn(styles.meter, "block h-px bg-accent")} />
          </span>
        </Panel>

        <Panel label={t("panels.checkin.label")}>
          <p className="flex items-center gap-2 font-display text-title-3 text-white">
            <Glyph name="badge" className="size-5 text-accent" />
            {t("panels.checkin.value")}
          </p>
          <p className="mt-4 font-mono text-[0.625rem] tracking-wider text-white/40 uppercase">
            {t("panels.checkin.note")}
          </p>
        </Panel>

        <Panel label={t("panels.coverage.label")}>
          <p className="flex items-center gap-2 font-display text-title-3 text-white">
            <Glyph name="globe" className="size-5 text-accent" />
            {t("panels.coverage.value")}
          </p>
          {/* A scale, not a barcode: any tighter and the ticks merge into one
              grey block. */}
          <span aria-hidden="true" className="mt-4 flex items-end gap-2">
            {Array.from({ length: 11 }, (_, index) => (
              <span
                key={index}
                className={cn("w-px", index % 4 === 1 ? "h-4 bg-accent/80" : "h-2.5 bg-white/20")}
              />
            ))}
          </span>
        </Panel>

        <Panel label={t("panels.dispatch.label")}>
          <p className="flex items-center gap-2 font-display text-title-2 text-white tabular-nums">
            <Glyph name="bell" className="size-5 text-accent" />
            {t("panels.dispatch.value")}
          </p>
        </Panel>
      </div>
    </SceneShell>
  );
}

function Panel({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div data-reveal className="rounded-sm border border-white/10 bg-black/60 p-5 backdrop-blur-sm">
      <p className="font-mono text-[0.625rem] tracking-wider text-white/40 uppercase">{label}</p>
      <div className="mt-5">{children}</div>
    </div>
  );
}
