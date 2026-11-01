import { getTranslations } from "next-intl/server";

import { withAccent } from "@/components/ui/Accent";
import { Arrow } from "@/components/ui/Arrow";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Section } from "@/components/ui/Section";
import { routes } from "@/i18n/routes";

/**
 * The last thing on the page.
 *
 * Set at `title-1` and given the page's only large measure of empty space, so
 * the end of the scroll is an invitation rather than a footer approaching. The
 * email link appears only when an address is configured — a `mailto:` nobody
 * reads is worse than no second option.
 */
export async function ClosingCta({ email }: { email?: string }) {
  const t = await getTranslations("home.closing");

  return (
    <Section
      id="closingCta"
      spacing="large"
      label={t("eyebrow")}
      className="border-t border-border"
    >
      <Container>
        <Eyebrow data-reveal>{t("eyebrow")}</Eyebrow>

        <h2
          data-reveal
          className="mt-8 max-w-[18ch] font-display text-title-1 font-bold text-balance"
        >
          {withAccent(t("headline"))}
        </h2>

        <p data-reveal className="mt-8 max-w-[52ch] text-lead text-muted">
          {t("body")}
        </p>

        <div data-reveal className="mt-12 flex flex-wrap items-center gap-x-8 gap-y-4">
          <Button href={routes.contact} variant="primary" size="md" className="px-7">
            {t("cta")}
            <Arrow />
          </Button>

          {email ? (
            <span className="text-caption text-subtle">
              {t("or")}{" "}
              <a
                href={`mailto:${email}`}
                className="text-foreground underline-offset-4 transition-colors hover:text-accent-text hover:underline"
              >
                {email}
              </a>
            </span>
          ) : null}
        </div>
      </Container>
    </Section>
  );
}
