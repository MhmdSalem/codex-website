import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { PageCta } from "@/components/sections/PageCta";
import { Arrow } from "@/components/ui/Arrow";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/ui/PageHeader";
import { Section } from "@/components/ui/Section";
import { PRODUCT_IDS } from "@/content/catalog";
import { resolveEmail } from "@/content/contact";
import styles from "@/experience/build/build.module.css";
import { Window } from "@/experience/build/Window";
import { routes } from "@/i18n/routes";
import type { Locale } from "@/i18n/routing";
import { at, byKey, pick } from "@/lib/cms";
import { getAboutPage, getProducts, getSiteSettings } from "@/lib/content";
import { buildPageMetadata } from "@/lib/seo";
import { cn } from "@/lib/utils";
import { Reveal } from "@/motion/Reveal";

const PRINCIPLES = ["products", "engineering", "bilingual", "after"] as const;

interface PageProps {
  params: Promise<{ locale: Locale }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const [t, about] = await Promise.all([
    getTranslations({ locale, namespace: "about" }),
    getAboutPage(locale),
  ]);

  return buildPageMetadata({
    locale,
    path: "/about",
    title: about?.headline ?? t("title"),
    description: t("description"),
    seo: about?.seo,
  });
}

/**
 * About — the company's story.
 *
 * Three paragraphs beside a timeline of milestones, then the principles as
 * numbered cards: the things every piece of work here has to satisfy. The
 * dashboard's About page fills any of it; the catalogue fills the rest.
 */
export default async function AboutPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const [t, tProducts, tNav, about, settings, products] = await Promise.all([
    getTranslations("about"),
    getTranslations("catalog.products"),
    getTranslations("nav"),
    getAboutPage(locale),
    getSiteSettings(locale),
    getProducts(locale),
  ]);

  const story = pick(about?.storyParagraphs, [t("story.one"), t("story.two"), t("story.three")]);
  const milestones = pick(
    about?.milestones,
    (t.raw("log.items") as { msg: string }[]).map((item) => item.msg),
  );
  const principlesLabel = pick(about?.principlesLabel, t("principlesLabel"));

  return (
    <>
      <PageHeader
        eyebrow={pick(about?.eyebrow, t("eyebrow"))}
        headline={pick(about?.headline, t("headline"))}
        description={pick(about?.lead, t("lead"))}
      />

      <Reveal>
        <Section spacing="flush" label={t("eyebrow")}>
          <Container>
            <div className={styles.module}>
              <div className="flex flex-col gap-6">
                {story.map((paragraph, index) => (
                  <p
                    key={index}
                    data-reveal
                    className={index === 0 ? styles.lead : styles.body}
                    style={{ marginTop: 0 }}
                  >
                    {paragraph}
                  </p>
                ))}
                <ul className="mt-2 flex flex-wrap gap-3">
                  {PRODUCT_IDS.map((id) => (
                    <li key={id} data-reveal className={cn(styles.glass, "rounded-xl px-4 py-3")}>
                      <p className="font-display text-body font-semibold">
                        {pick(byKey(products, id)?.name, tProducts(`${id}.name`))}
                      </p>
                      <p className={cn(styles.meta, "mt-1")} style={{ direction: "inherit" }}>
                        {pick(byKey(products, id)?.category, tProducts(`${id}.tag`))}
                      </p>
                    </li>
                  ))}
                </ul>
                <div data-reveal>
                  <Button href={routes.products} variant="outline" size="sm">
                    {tNav("products")}
                    <Arrow className="size-3.5" />
                  </Button>
                </div>
              </div>

              <div data-reveal>
                <Window title={t("log.label")}>
                  <div className={styles.winBody}>
                    <ol className={styles.log}>
                      {milestones.map((milestone, index) => (
                        <li key={index} data-reveal className={styles.commit}>
                          <i />
                          <span className={styles.hash}>{String(index + 1).padStart(2, "0")}</span>
                          <span className={styles.msg}>{milestone}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                </Window>
              </div>
            </div>
          </Container>
        </Section>

        <Section spacing="default" label={principlesLabel}>
          <Container>
            <div data-reveal className={styles.cmd}>
              {principlesLabel}
            </div>
            <h2 data-reveal className={cn(styles.h2, "mb-10")}>
              {principlesLabel}
            </h2>
            <ul className={styles.rules}>
              {PRINCIPLES.map((id, index) => {
                const value = at(about?.values, index);
                return (
                  <li key={id} data-reveal className={cn(styles.glass, styles.rule)}>
                    <span className={styles.meta} style={{ direction: "inherit" }}>
                      {t("ruleLabel")} {String(index + 1).padStart(2, "0")}
                    </span>
                    <h3 className={styles.h3}>{pick(value?.title, t(`principles.${id}.title`))}</h3>
                    <p className={styles.body} style={{ marginTop: 0 }}>
                      {pick(value?.description, t(`principles.${id}.body`))}
                    </p>
                  </li>
                );
              })}
            </ul>
          </Container>
        </Section>

        <PageCta
          headline={pick(about?.closingStatement, t("cta.headline"))}
          body={t("cta.body")}
          label={pick(about?.closingCta?.label, t("cta.button"))}
          email={resolveEmail(settings)}
        />
      </Reveal>
    </>
  );
}
