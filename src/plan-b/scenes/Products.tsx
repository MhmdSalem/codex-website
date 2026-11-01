import { useTranslations } from "next-intl";

import { accent } from "../copy";
import { SceneShell } from "../SceneShell";

/**
 * Line drawings, not screenshots.
 *
 * A screenshot of a product dates the day it was taken and promises a screen the
 * reader may not get. An outline of the object — a phone holding an invitation, a
 * pass on a lanyard — says what the product *is* and stays true through every
 * redesign of what it looks like.
 */
function Invitation() {
  return (
    <svg
      viewBox="0 0 96 132"
      className="h-32 w-auto text-white/25"
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      strokeLinecap="round"
      aria-hidden="true"
      focusable="false"
    >
      <rect x="18" y="4" width="60" height="124" rx="8" />
      <path d="M40 10h16" />
      <rect
        x="27"
        y="26"
        width="42"
        height="58"
        rx="3"
        className="text-accent"
        stroke="currentColor"
      />
      <path d="M36 40h24M36 50h24M36 60h14" />
      <path d="M33 96h30M33 106h20" />
    </svg>
  );
}

function Pass() {
  return (
    <svg
      viewBox="0 0 96 132"
      className="h-32 w-auto text-white/25"
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      strokeLinecap="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M40 4l8 20M56 4l-8 20" />
      <rect x="20" y="24" width="56" height="80" rx="5" />
      <path d="M43 24h10" />
      <rect
        x="30"
        y="38"
        width="20"
        height="20"
        rx="2"
        className="text-accent"
        stroke="currentColor"
      />
      <path d="M56 42h12M56 50h8" />
      <path d="M30 70h36M30 80h24" />
      <path d="M30 92h14" className="text-accent" stroke="currentColor" />
    </svg>
  );
}

const PRODUCTS = [
  { id: "daawa", art: <Invitation /> },
  { id: "accreditation", art: <Pass /> },
] as const;

/**
 * 05 — Our Products.
 *
 * The core steps back into a wide halo and the products stand in front of it.
 * This is the one scene where the core is not the subject, which is the point:
 * the proof of a software company is the software, and the argument can afford to
 * hand the frame over for one chapter.
 */
export function Products() {
  const t = useTranslations("planB.products");

  return (
    <SceneShell id="products" number="05" label={t("label")} gloss={t("gloss")}>
      <div className="max-w-[34ch]">
        <h2 data-reveal className="font-display text-title-2 font-bold text-white">
          {accent(t("headline"))}
        </h2>
        <p data-reveal className="mt-6 text-caption text-muted">
          {t("lead")}
        </p>
      </div>

      <div className="mt-14 grid gap-5 md:grid-cols-2">
        {PRODUCTS.map(({ id, art }) => (
          <article
            key={id}
            data-reveal
            className="group flex items-start justify-between gap-6 rounded-sm border border-white/10 bg-black/60 p-6 backdrop-blur-sm transition-colors duration-[var(--duration-base)] hover:border-white/20"
          >
            <div>
              <p className="font-mono text-[0.625rem] tracking-wider text-accent uppercase">
                {t(`${id}.tag`)}
              </p>
              <h3 className="mt-4 font-display text-title-3 text-white">{t(`${id}.name`)}</h3>
              <p className="mt-3 max-w-[24ch] text-caption text-muted">{t(`${id}.headline`)}</p>
              <p className="mt-6 font-mono text-[0.625rem] tracking-wider text-white/40 uppercase">
                {t(`${id}.lead`)}
              </p>
            </div>
            {art}
          </article>
        ))}
      </div>
    </SceneShell>
  );
}
