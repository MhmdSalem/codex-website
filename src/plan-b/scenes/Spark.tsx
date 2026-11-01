import { useTranslations } from "next-intl";

import { accent } from "../copy";
import { SceneShell } from "../SceneShell";

/**
 * 02 — The Spark.
 *
 * The first claim, and the first time the core does something: bands begin to
 * turn around it. The copy takes the leading half of the frame and the core sits
 * in the trailing half, which is the composition the rest of the story keeps
 * returning to.
 */
export function Spark() {
  const t = useTranslations("planB.spark");

  return (
    <SceneShell id="spark" number="02" label={t("label")} gloss={t("gloss")}>
      <div className="lg:max-w-[46%]">
        <h2 data-reveal className="max-w-[13ch] font-display text-title-1 font-bold text-white">
          {accent(t("headline"))}
        </h2>
        <p data-reveal className="mt-7 max-w-[30ch] text-lead text-muted">
          {t("lead")}
        </p>
      </div>
    </SceneShell>
  );
}
