import { getTranslations } from "next-intl/server";

import { withAccent } from "@/components/ui/Accent";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Section } from "@/components/ui/Section";

/**
 * The claim, stated in four sentences.
 *
 * The only section on the page with no list, no grid of cards and no numbers —
 * it exists to be read once, slowly, and to establish that this company thinks
 * of software as a sequence that ends in a working business rather than in a
 * delivery. Set at `title-3`: large enough to hold the page, small enough that
 * four sentences are still a paragraph and not a poster.
 */
export async function IntroStatement() {
  const t = await getTranslations("home.intro");

  const lines = [t("lineOne"), t("lineTwo"), t("lineThree"), t("lineFour")];

  return (
    <Section id="intro" spacing="default" label={t("eyebrow")}>
      <Container>
        <Eyebrow data-reveal>{t("eyebrow")}</Eyebrow>

        <div className="mt-10 grid gap-x-8 gap-y-12 md:mt-14 md:grid-cols-12">
          {/*
            A single hairline on the leading edge instead of a border on all
            four sides. It marks the passage as quoted without turning it into a
            card, and it is the one place on the page where the accent is used
            as structure rather than as emphasis.
          */}
          <div className="md:col-span-8">
            <p
              data-reveal
              className="border-s-2 border-accent ps-6 font-display text-title-3 md:ps-8"
            >
              {lines.map((line, index) => (
                <span key={index} className="block">
                  {withAccent(line)}
                </span>
              ))}
            </p>
          </div>

          <div className="md:col-span-4">
            <p data-reveal className="text-body text-muted">
              {t("support")}
            </p>
          </div>
        </div>
      </Container>
    </Section>
  );
}
