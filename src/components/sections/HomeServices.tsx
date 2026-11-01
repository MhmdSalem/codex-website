import { getTranslations } from "next-intl/server";

import { Arrow } from "@/components/ui/Arrow";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SERVICE_IDS } from "@/content/catalog";
import { ModuleGlyph } from "@/experience/hero/ModuleGlyph";
import { routes } from "@/i18n/routes";
import { ordinal } from "@/lib/utils";

/**
 * The six capabilities, listed once.
 *
 * The glyphs are the hero's glyphs — the same six ids drive the plates orbiting
 * the mark at the top of the page and the rows here, so the opening scene turns
 * out to have been a table of contents.
 */
export async function HomeServices() {
  const [t, tCatalog] = await Promise.all([
    getTranslations("home.servicesSection"),
    getTranslations("catalog.services"),
  ]);

  return (
    <Section id="capabilities" spacing="default" label={t("eyebrow")}>
      <Container>
        <SectionHeading eyebrow={t("eyebrow")} headline={t("headline")} lead={t("lead")}>
          <div data-reveal className="mt-8">
            <Button href={routes.services} variant="text">
              {t("cta")}
              <Arrow className="size-3.5" />
            </Button>
          </div>
        </SectionHeading>

        <ul className="mt-16 border-t border-border md:mt-20">
          {SERVICE_IDS.map((id, index) => (
            <li
              key={id}
              data-reveal
              className="grid gap-x-8 gap-y-3 border-b border-hairline py-7 md:grid-cols-12 md:py-8"
            >
              <span className="font-mono text-micro text-subtle md:col-span-1">
                {ordinal(index)}
              </span>
              <h3 className="flex items-center gap-3 font-display text-title-3 md:col-span-5">
                <ModuleGlyph id={id} className="size-5 shrink-0 text-accent" />
                {tCatalog(`${id}.name`)}
              </h3>
              <p className="text-body text-muted md:col-span-6">{tCatalog(`${id}.summary`)}</p>
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}
