import { useTranslations } from "next-intl";

import { Arrow } from "@/components/ui/Arrow";
import { Button } from "@/components/ui/Button";
import { routes } from "@/i18n/routes";

import { accent } from "../copy";
import { SceneShell } from "../SceneShell";

/**
 * 08 — The Convergence.
 *
 * Everything falls back into the core, the mark returns inside it, and the page
 * ends where it began. The copy sits in the lower half of the frame so the core
 * keeps the middle — the last thing the reader looks at is the same object as the
 * first, which is the whole argument of the concept in one frame.
 */
export function Convergence({ locale }: { locale: string }) {
  const t = useTranslations("planB.convergence");

  return (
    <SceneShell
      id="convergence"
      number="08"
      label={t("label")}
      gloss={t("gloss")}
      className="items-center justify-end pb-[16vh] text-center"
    >
      <h2
        data-reveal
        className="max-w-[20ch] font-display text-title-1 font-bold text-balance text-white"
      >
        {accent(t("headline"))}
      </h2>
      <p data-reveal className="mt-6 text-caption text-muted">
        {t("lead")}
      </p>
      <span data-reveal className="mt-10 inline-flex">
        {/*
          Absolute and locale-prefixed by hand. This concept lives outside the
          `[locale]` tree, so the locale-aware `Link` has no segment to read and
          would send the reader to an unprefixed path.
        */}
        <Button href={`/${locale}${routes.contact}`} external size="sm" className="px-6 py-3">
          {t("cta")}
          <Arrow />
        </Button>
      </span>
    </SceneShell>
  );
}
