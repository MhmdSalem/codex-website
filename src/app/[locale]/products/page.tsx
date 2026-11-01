import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { PageCta } from "@/components/sections/PageCta";
import { Arrow } from "@/components/ui/Arrow";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/ui/PageHeader";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { FEATURE_KEYS, PRODUCT_IDS } from "@/content/catalog";
import { resolveEmail } from "@/content/contact";
import styles from "@/experience/build/build.module.css";
import { AccreditationMock, DaawaMock } from "@/experience/build/ProductMocks";
import { routes } from "@/i18n/routes";
import type { Locale } from "@/i18n/routing";
import { getSiteSettings } from "@/lib/content";
import { buildPageMetadata } from "@/lib/seo";
import { Reveal } from "@/motion/Reveal";

interface PageProps {
  params: Promise<{ locale: Locale }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "products" });

  return buildPageMetadata({
    locale,
    path: "/products",
    title: t("title"),
    description: t("description"),
  });
}

/**
 * Products — software that is running.
 *
 * Each product is shown as its interface, live: a gate open, a list moving,
 * a count where it stands. Beside it the facts — what it does, who it is for —
 * and the one status a running system carries: live.
 */
export default async function ProductsPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const [t, tCatalog, tBuild, settings] = await Promise.all([
    getTranslations("products"),
    getTranslations("catalog.products"),
    getTranslations("build"),
    getSiteSettings(locale),
  ]);

  return (
    <>
      <PageHeader eyebrow={t("eyebrow")} headline={t("headline")} description={t("lead")} />

      <Reveal>
        <Section spacing="flush" label={t("eyebrow")}>
          <Container>
            {PRODUCT_IDS.map((id) => (
              <article key={id} id={id} className={styles.product}>
                <div>
                  <div data-reveal className={styles.footerStatus}>
                    <span>{tCatalog(`${id}.tag`)}</span>
                    <b>{t("live")}</b>
                  </div>
                  <h2 data-reveal className={`${styles.h2} mt-6`}>
                    {tCatalog(`${id}.name`)}
                  </h2>
                  <p data-reveal className={styles.lead}>
                    {tCatalog(`${id}.summary`)}
                  </p>
                  <p data-reveal className={styles.body}>
                    {tCatalog(`${id}.detail`)}
                  </p>

                  <ul className={styles.features}>
                    {FEATURE_KEYS.map((key) => (
                      <li key={key} data-reveal>
                        {tCatalog(`${id}.features.${key}`)}
                      </li>
                    ))}
                  </ul>

                  <p data-reveal className={`${styles.meta} mt-8`} style={{ direction: "inherit" }}>
                    <span className="sr-only">{t("audienceLabel")}: </span>
                    {tCatalog(`${id}.audience`)}
                  </p>

                  <div data-reveal className={styles.ctas}>
                    <Button
                      href={`${routes.checkout}?product=${id}`}
                      size="sm"
                      className="px-6 py-3"
                    >
                      {t("orderNow")}
                      <Arrow className="size-3.5" />
                    </Button>
                    <Button href={routes.contact} variant="outline" size="sm" className="px-6 py-3">
                      {t("enquire")}
                      <Arrow className="size-3.5" />
                    </Button>
                  </div>
                </div>

                {id === "accreditation" ? (
                  <AccreditationMock
                    name={tCatalog("accreditation.name")}
                    live={tBuild("stage.live")}
                    verified={tBuild("stage.verified")}
                    admit={tBuild("stage.admit")}
                    deny={tBuild("stage.deny")}
                    checkins={tBuild("stage.checkins")}
                    guests={{
                      a: tBuild("stage.guests.a"),
                      b: tBuild("stage.guests.b"),
                      c: tBuild("stage.guests.c"),
                      d: tBuild("stage.guests.d"),
                    }}
                  />
                ) : (
                  <DaawaMock
                    name={tCatalog("daawa.name")}
                    tag={tCatalog("daawa.tag")}
                    rows={[
                      {
                        label: t("daawaMock.rows.a"),
                        status: t("daawaMock.statuses.yes"),
                        accepted: true,
                      },
                      {
                        label: t("daawaMock.rows.b"),
                        status: t("daawaMock.statuses.no"),
                        accepted: false,
                      },
                      {
                        label: t("daawaMock.rows.c"),
                        status: t("daawaMock.statuses.yes"),
                        accepted: true,
                      },
                      {
                        label: t("daawaMock.rows.d"),
                        status: t("daawaMock.statuses.pending"),
                        accepted: true,
                      },
                    ]}
                    summary={t("daawaMock.summary")}
                  />
                )}
              </article>
            ))}
          </Container>
        </Section>

        <Section spacing="default" label={t("custom.eyebrow")}>
          <Container>
            <SectionHeading
              eyebrow={t("custom.eyebrow")}
              headline={t("custom.headline")}
              lead={t("custom.body")}
            >
              <div data-reveal className={styles.ctas}>
                <Button href={routes.services} variant="outline" size="sm">
                  {t("custom.cta")}
                  <Arrow className="size-3.5" />
                </Button>
              </div>
            </SectionHeading>
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
