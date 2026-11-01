import { useTranslations } from "next-intl";

import { SceneShell } from "../SceneShell";
import { ScrollCue } from "../ScrollCue";

/**
 * 01 — Intro.
 *
 * The core is a closed ring with the mark inside it, and the scene's only job is
 * to stay out of its way: a line at the top, a line at the bottom, and the whole
 * middle of the frame left empty. The opening claim is the object, not the copy.
 */
export function Intro() {
  const t = useTranslations("planB.intro");
  const tRoot = useTranslations("planB");

  return (
    <SceneShell
      id="intro"
      number="01"
      label={t("label")}
      gloss={t("gloss")}
      className="justify-between gap-16"
    >
      <p
        data-reveal
        className="font-mono text-micro tracking-widest text-muted uppercase lg:pt-[8vh]"
      >
        {t("eyebrow")}
      </p>

      <div className="flex items-end justify-between gap-8">
        <p data-reveal className="max-w-[26ch] text-lead text-muted">
          {t("lead")}
        </p>
        <ScrollCue label={tRoot("scroll")} />
      </div>
    </SceneShell>
  );
}
