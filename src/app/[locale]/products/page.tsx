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
import { byKey, pick } from "@/lib/cms";
import { getProducts, getSiteSettings } from "@/lib/content";
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
 * Each product is shown as its interface, live, beside the facts: what it
 * does, who it is for. The text of each product comes from its document in
 * the dashboard when one exists, and from the catalogue otherwise.
 */
export default async function ProductsPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const [t, tCatalog, tBuild, settings, products] = await Promise.all([
    getTranslations("products"),
    getTranslations("catalog.products"),
    getTranslations("build"),
    getSiteSettings(locale),
    getProducts(locale),
  ]);

  return (
    <>
      <PageHeader eyebrow={t("eyebrow")} headline={t("headline")} description={t("lead")} />

      <Reveal>
        <Section spacing="flush" label={t("eyebrow")}>
          <Container>
            {PRODUCT_IDS.map((id) => {
              const doc = byKey(products, id);
              const name = pick(doc?.name, tCatalog(`${id}.name`));
              const tag = pick(doc?.category, tCatalog(`${id}.tag`));
              const features = pick(
                doc?.capabilities,
                FEATURE_KEYS.map((key) => tCatalog(`${id}.features.${key}`)),
              );

              return (
                <article key={id} id={id} className={styles.product}>
                  <div>
                    <div data-reveal className={styles.footerStatus}>
                      <span>{tag}</span>
                      <b>{t("live")}</b>
                    </div>
                    <h2 data-reveal className={`${styles.h2} mt-6`}>
                      {name}
                    </h2>
                    <p data-reveal className={styles.lead}>
                      {pick(doc?.tagline, tCatalog(`${id}.summary`))}
                    </p>
                    <p data-reveal className={styles.body}>
                      {pick(doc?.description, tCatalog(`${id}.detail`))}
                    </p>

                    <ul className={styles.features}>
                      {features.map((feature) => (
                        <li key={feature} data-reveal>
                          {feature}
                        </li>
                      ))}
                    </ul>

                    <p
                      data-reveal
                      className={`${styles.meta} mt-8`}
                      style={{ direction: "inherit" }}
                    >
                      <span className="sr-only">{t("audienceLabel")}: </span>
                      {pick(doc?.audience, tCatalog(`${id}.audience`))}
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
                      <Button
                        href={routes.contact}
                        variant="outline"
                        size="sm"
                        className="px-6 py-3"
                      >
                        {t("enquire")}
                        <Arrow className="size-3.5" />
                      </Button>
                    </div>
                  </div>

                  {id === "accreditation" ? (
                    <AccreditationMock
                      name={name}
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
                      name={name}
                      tag={tag}
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
              );
            })}
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
