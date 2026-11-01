import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { PageCta } from "@/components/sections/PageCta";
import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/ui/PageHeader";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { INCLUDE_KEYS, SERVICE_IDS } from "@/content/catalog";
import { resolveEmail } from "@/content/contact";
import styles from "@/experience/build/build.module.css";
import { Terminal } from "@/experience/build/Window";
import { ModuleGlyph } from "@/experience/hero/ModuleGlyph";
import type { Locale } from "@/i18n/routing";
import { getSiteSettings } from "@/lib/content";
import { buildPageMetadata } from "@/lib/seo";
import { Reveal } from "@/motion/Reveal";

interface PageProps {
  params: Promise<{ locale: Locale }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "services" });

  return buildPageMetadata({
    locale,
    path: "/services",
    title: t("title"),
    description: t("description"),
  });
}

/**
 * Services — installing the modules.
 *
 * Each capability is a module added to the client's system: on one side what
 * it is and what it does, on the other a window listing what it includes, each
 * line confirmed.
 */
export default async function ServicesPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const [t, tCatalog, settings] = await Promise.all([
    getTranslations("services"),
    getTranslations("catalog.services"),
    getSiteSettings(locale),
  ]);

  return (
    <>
      <PageHeader eyebrow={t("eyebrow")} headline={t("headline")} description={t("lead")} />

      <Reveal>
        <Section spacing="flush" label={t("eyebrow")}>
          <Container>
            <ol>
              {SERVICE_IDS.map((id, index) => (
                <li key={id} id={id} className={styles.module}>
                  <div>
                    <div data-reveal className={styles.moduleGlyph}>
                      <ModuleGlyph id={id} />
                    </div>
                    <span data-reveal className={styles.meta}>
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <h2 data-reveal className={`${styles.h3} mt-3`}>
                      {tCatalog(`${id}.name`)}
                    </h2>
                    <p data-reveal className={`${styles.lead} mt-4`}>
                      {tCatalog(`${id}.summary`)}
                    </p>
                    <p data-reveal className={styles.body}>
                      {tCatalog(`${id}.detail`)}
                    </p>
                  </div>

                  <div data-reveal>
                    <Terminal
                      title={tCatalog(`${id}.name`)}

                      lines={[
                        { kind: "dim", text: t("includesLabel") },
                        ...INCLUDE_KEYS.map((key) => ({
                          kind: "ok" as const,
                          text: tCatalog(`${id}.includes.${key}`),
                        })),
                      ]}
                    />
                  </div>
                </li>
              ))}
            </ol>
          </Container>
        </Section>

        <Section spacing="default" label={t("engagement.eyebrow")}>
          <Container>
            <SectionHeading
              eyebrow={t("engagement.eyebrow")}
              headline={t("engagement.headline")}
              lead={t("engagement.body")}
            />
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
