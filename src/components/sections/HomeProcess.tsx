import { getTranslations } from "next-intl/server";

import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { PROCESS_IDS } from "@/content/catalog";
import { ordinal } from "@/lib/utils";

/**
 * Four steps on one line.
 *
 * A single hairline runs across the top of the row and each step hangs a marker
 * off it, so the four read as positions on a timeline rather than as four cards
 * that happen to be adjacent.
 */
export async function HomeProcess() {
  const [t, tCatalog] = await Promise.all([
    getTranslations("home.processSection"),
    getTranslations("catalog.process"),
  ]);

  return (
    <Section id="process" spacing="default" label={t("eyebrow")}>
      <Container>
        <SectionHeading eyebrow={t("eyebrow")} headline={t("headline")} lead={t("lead")} />

        <ol className="mt-16 grid gap-y-10 border-t border-border md:mt-20 md:grid-cols-2 md:gap-x-8 lg:grid-cols-4">
          {PROCESS_IDS.map((id, index) => (
            <li key={id} data-reveal className="relative pt-8">
              {/* The marker sits on the rule above, not beside the number. */}
              <span aria-hidden className="absolute start-0 -top-px h-px w-10 bg-accent lg:w-16" />
              <span className="font-mono text-micro text-subtle">{ordinal(index)}</span>
              <h3 className="mt-4 font-display text-title-3">{tCatalog(`${id}.title`)}</h3>
              <p className="mt-3 max-w-[38ch] text-caption text-muted">{tCatalog(`${id}.body`)}</p>
            </li>
          ))}
        </ol>
      </Container>
    </Section>
  );
}
