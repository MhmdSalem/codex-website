import { getTranslations } from "next-intl/server";

import { Arrow } from "@/components/ui/Arrow";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { routes } from "@/i18n/routes";

const PRINCIPLES = ["products", "engineering", "bilingual", "after"] as const;

/**
 * Who is behind the products, in two paragraphs.
 *
 * The principles are labels rather than sentences here — the page has already
 * spent its reading budget by this point, and the about page is where each one
 * is explained.
 */
export async function AboutPreview() {
  const t = await getTranslations("home.company");

  return (
    <Section id="aboutPreview" spacing="default" label={t("eyebrow")}>
      <Container>
        <SectionHeading eyebrow={t("eyebrow")} headline={t("headline")}>
          <div className="mt-8 flex max-w-[58ch] flex-col gap-5">
            <p data-reveal className="text-body text-muted">
              {t("bodyOne")}
            </p>
            <p data-reveal className="text-body text-muted">
              {t("bodyTwo")}
            </p>
          </div>

          <ul className="mt-12 grid gap-x-8 gap-y-4 sm:grid-cols-2">
            {PRINCIPLES.map((id) => (
              <li
                key={id}
                data-reveal
                className="flex items-baseline gap-3 border-t border-hairline pt-4 font-mono text-micro tracking-wider uppercase"
              >
                <span aria-hidden className="size-1 shrink-0 translate-y-[-2px] bg-accent" />
                {t(`principles.${id}`)}
              </li>
            ))}
          </ul>

          <div data-reveal className="mt-12">
            <Button href={routes.about} variant="outline" size="sm" className="px-6 py-3">
              {t("cta")}
              <Arrow className="size-3.5" />
            </Button>
          </div>
        </SectionHeading>
      </Container>
    </Section>
  );
}
