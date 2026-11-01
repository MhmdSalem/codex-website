import type { Metadata } from "next";
import { getFormatter, getTranslations, setRequestLocale } from "next-intl/server";

import { PageCta } from "@/components/sections/PageCta";
import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/ui/PageHeader";
import { Section } from "@/components/ui/Section";
import { SERVICE_IDS } from "@/content/catalog";
import { resolveEmail } from "@/content/contact";
import { CURRENCY, ENGAGEMENTS, SERVICE_FROM } from "@/content/pricing";
import styles from "@/experience/build/build.module.css";
import { Window } from "@/experience/build/Window";
import type { Locale } from "@/i18n/routing";
import { getSiteSettings } from "@/lib/content";
import { buildPageMetadata } from "@/lib/seo";
import { cn } from "@/lib/utils";
import { Reveal } from "@/motion/Reveal";

const FACTORS = ["a", "b", "c", "d"] as const;

interface PageProps {
  params: Promise<{ locale: Locale }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "pricing" });

  return buildPageMetadata({
    locale,
    path: "/pricing",
    title: t("title"),
    description: t("description"),
  });
}

/**
 * Pricing — a quote, printed.
 *
 * The starting points as the lines of a draft quote in a window, every figure
 * a floor; the three ways of working as the plans beside it; and what moves
 * the number as the additions a real scope would make. Nothing presented as
 * final, because the number that is true for one visitor is wrong for the next.
 */
export default async function PricingPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const [t, tCatalog, format, settings] = await Promise.all([
    getTranslations("pricing"),
    getTranslations("catalog"),
    getFormatter(),
    getSiteSettings(locale),
  ]);

  /** Whole pounds. Piastres on a six-figure floor would be a false precision. */
  const money = (amount: number) =>
    format.number(amount, {
      style: "currency",
      currency: CURRENCY,
      maximumFractionDigits: 0,
    });

  return (
    <>
      <PageHeader eyebrow={t("eyebrow")} headline={t("headline")} description={t("lead")} />

      <Reveal>
        <Section spacing="flush" label={t("servicesLabel")}>
          <Container>
            <div className={styles.module}>
              <div>
                <div data-reveal className={styles.cmd}>
                  {t("eyebrow")}
                </div>
                <h2 data-reveal className={styles.h2}>
                  {t("servicesLabel")}
                </h2>
                <p data-reveal className={styles.lead}>
                  {t("servicesNote")}
                </p>
              </div>

              <div data-reveal>
                <Window title={t("quoteTitle")} status={CURRENCY}>
                  <div className={styles.quote}>
                    <div className={styles.quoteHead}>
                      <b>{t("servicesLabel")}</b>
                      <span className={styles.meta} style={{ direction: "inherit" }}>
                        {t("quoteNote")}
                      </span>
                    </div>
                    <div className={styles.priceTable}>
                      {SERVICE_IDS.map((id) => (
                        <div key={id} data-reveal className={styles.priceRow}>
                          <b>{tCatalog(`services.${id}.name`)}</b>
                          <span className={styles.priceVal}>
                            {t("from", { price: money(SERVICE_FROM[id]) })}
                          </span>
                        </div>
                      ))}
                    </div>
                    <div className={styles.quoteFoot}>
                      <span>{t("eyebrow")}</span>
                      <span className={styles.meta}>codex-tech.ai</span>
                    </div>
                  </div>
                </Window>
              </div>
            </div>
          </Container>
        </Section>

        <Section spacing="default" label={t("modelsLabel")}>
          <Container>
            <div data-reveal className={styles.cmd}>
              {t("eyebrow")}
            </div>
            <h2 data-reveal className={cn(styles.h2, "mb-10")}>
              {t("modelsLabel")}
            </h2>
            <ul className={styles.cards}>
              {ENGAGEMENTS.map((engagement, index) => (
                <li key={engagement.id} data-reveal className={cn(styles.glass, styles.cardTile)}>
                  <span className={styles.meta} style={{ direction: "inherit" }}>
                    {t("planLabel")} {String(index + 1).padStart(2, "0")}
                  </span>
                  <h3 className={styles.h3}>{t(`models.${engagement.id}.name`)}</h3>
                  <p className={styles.big}>
                    {engagement.from === undefined
                      ? t("byAgreement")
                      : engagement.monthly
                        ? t("fromMonthly", { price: money(engagement.from) })
                        : t("from", { price: money(engagement.from) })}
                  </p>
                  <p className="text-body">{t(`models.${engagement.id}.suits`)}</p>
                  <p className="text-caption text-muted">{t(`models.${engagement.id}.note`)}</p>
                </li>
              ))}
            </ul>
          </Container>
        </Section>

        <Section spacing="default" label={t("factorsLabel")}>
          <Container>
            <div data-reveal className={styles.cmd}>
              {t("eyebrow")}
            </div>
            <h2 data-reveal className={cn(styles.h2, "mb-10")}>
              {t("factorsLabel")}
            </h2>
            <ul className={styles.factors}>
              {FACTORS.map((key) => (
                <li key={key} data-reveal className={styles.glass}>
                  {t(`factors.${key}`)}
                </li>
              ))}
            </ul>
            <p data-reveal className={styles.body}>
              {t("note")}
            </p>
          </Container>
        </Section>

        <PageCta
          headline={t("cta.headline")}
          body={t("cta.body")}
          label={t("cta.button")}
          email={resolveEmail(settings)}
        />
      </Reveal>
    </>
  );
}
