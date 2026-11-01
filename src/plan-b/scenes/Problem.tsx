import { useTranslations } from "next-intl";
import type { CSSProperties } from "react";

import { cn } from "@/lib/utils";

import { accent } from "../copy";
import { Glyph, type GlyphName } from "../Glyph";
import { SceneShell } from "../SceneShell";
import styles from "../scene.module.css";

/**
 * The tools a business already has, arranged the way it actually has them.
 *
 * The coordinates are hand-set and deliberately unbalanced: an even distribution
 * of six plates is a grid, and a grid is the thing this scene is arguing against.
 * Each plate drifts on its own period so the group never lines up.
 */
const SHARDS = [
  {
    id: "spreadsheets",
    glyph: "sheet",
    x: "24%",
    y: "16%",
    tilt: "-7deg",
    period: "15s",
    delay: "0s",
  },
  { id: "chat", glyph: "chat", x: "63%", y: "9%", tilt: "5deg", period: "13s", delay: "-4s" },
  { id: "files", glyph: "file", x: "82%", y: "40%", tilt: "-4deg", period: "17s", delay: "-2s" },
  { id: "entry", glyph: "keyboard", x: "14%", y: "56%", tilt: "6deg", period: "14s", delay: "-6s" },
  { id: "data", glyph: "database", x: "48%", y: "74%", tilt: "-5deg", period: "16s", delay: "-1s" },
  { id: "time", glyph: "clock", x: "76%", y: "88%", tilt: "8deg", period: "12s", delay: "-8s" },
] as const satisfies readonly {
  id: string;
  glyph: GlyphName;
  x: string;
  y: string;
  tilt: string;
  period: string;
  delay: string;
}[];

/**
 * 03 — The Problem.
 *
 * The core loses its centre. The same points that were orbiting in scene 2 are
 * still on screen, cold and unlinked, and six plates name what they are. This is
 * the only scene in the story with no connections drawn anywhere in it.
 */
export function Problem() {
  const t = useTranslations("planB.problem");

  return (
    <SceneShell id="problem" number="03" label={t("label")} gloss={t("gloss")}>
      <div className="grid gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,20rem)] lg:items-center lg:gap-16">
        {/*
          Absolute only from `md`. On a phone the same six plates are a wrapped
          list: scattering them across 340px puts half of them off the edge, and
          a plate rotated 8 degrees at that width is just crooked.
        */}
        <ul className="flex flex-wrap gap-3 md:relative md:block md:h-[26rem] lg:h-[30rem]">
          {SHARDS.map((shard) => (
            <li
              key={shard.id}
              className={styles.shard}
              style={
                {
                  "--x": shard.x,
                  "--y": shard.y,
                  "--tilt": shard.tilt,
                } as CSSProperties
              }
            >
              <span
                data-reveal
                className={cn(
                  styles.drift,
                  "flex items-center gap-2.5 rounded-xs border border-white/10 bg-black/70 px-3 py-2.5",
                  "backdrop-blur-[2px]",
                )}
                style={{ "--period": shard.period, "--delay": shard.delay } as CSSProperties}
              >
                <Glyph name={shard.glyph} className="text-white/40" />
                <span className="font-mono text-[0.625rem] tracking-wider whitespace-nowrap text-white/55 uppercase">
                  {t(`fragments.${shard.id}`)}
                </span>
              </span>
            </li>
          ))}
        </ul>

        <div>
          <h2 data-reveal className="font-display text-title-2 font-bold text-white">
            {accent(t("headline"))}
          </h2>
          <p data-reveal className="mt-6 text-caption text-muted">
            {t("lead")}
          </p>
        </div>
      </div>
    </SceneShell>
  );
}
