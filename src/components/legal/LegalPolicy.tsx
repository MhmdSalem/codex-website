import { getFormatter, getTranslations } from "next-intl/server";

import type policyMessages from "../../../messages/en.json";

import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/ui/PageHeader";
import { Section } from "@/components/ui/Section";
import { resolveEmail } from "@/content/contact";
import type { Locale } from "@/i18n/routing";
import { getLegalPage, getSiteSettings } from "@/lib/content";
import { Reveal } from "@/motion/Reveal";

type PolicyMessages = typeof policyMessages;

/**
 * Every section key the three policies define.
 *
 * Read off the English catalogue rather than widened to `string`, so a page
 * cannot list a heading that has no copy behind it — the same reason the
 * service and product ids are literal tuples.
 */
type PolicySectionKey =
  | keyof PolicyMessages["privacy"]["sections"]
  | keyof PolicyMessages["delivery"]["sections"]
  | keyof PolicyMessages["refunds"]["sections"];

interface LegalPolicyProps {
  locale: Locale;
  namespace: "privacy" | "delivery" | "refunds";
  legalKey: string;
  sections: readonly PolicySectionKey[];
  lastUpdated: string;
}

/**
 * A keyed legal document.
 *
 * Copy lives in `messages/*.json`. Sanity can override the title, summary and
 * date when a matching legal page is published; the sections stay in the
 * message files so a half-finished CMS entry cannot blank the policy.
 */
export async function LegalPolicy({
  locale,
  namespace,
  legalKey,
  sections,
  lastUpdated,
}: LegalPolicyProps) {
  const [t, format, page, settings] = await Promise.all([
    getTranslations(namespace),
    getFormatter(),
    getLegalPage(locale, legalKey),
    getSiteSettings(locale),
  ]);
  const updated = format.dateTime(new Date(page?.lastUpdated ?? lastUpdated), {
    dateStyle: "long",
  });
  const email = resolveEmail(settings);

  return (
    <>
      <PageHeader
        eyebrow={t("eyebrow")}
        headline={page?.title ?? t("headline")}
        description={page?.summary ?? t("intro")}
      />

      <Reveal>
        <Section spacing="default" className="border-t border-border" label={t("headline")}>
          <Container width="text">
            <p data-reveal className="font-mono text-micro tracking-wider text-subtle uppercase">
              {t("lastUpdated", { date: updated })}
            </p>

            <div className="mt-12 flex flex-col">
              {sections.map((key) => (
                <section key={key} data-reveal className="border-t border-hairline py-8">
                  <h2 className="font-display text-title-3">{t(`sections.${key}.title`)}</h2>
                  <p className="mt-4 text-body text-muted">{t(`sections.${key}.body`)}</p>

                  {key === "contact" && email ? (
                    <p className="mt-4 text-body">
                      <a
                        href={`mailto:${email}`}
                        className="underline-offset-4 transition-colors hover:text-accent-text hover:underline"
                      >
                        {email}
                      </a>
                    </p>
                  ) : null}
                </section>
              ))}
            </div>
          </Container>
        </Section>
      </Reveal>
    </>
  );
}
