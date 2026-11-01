import { getTranslations } from "next-intl/server";

import { Arrow } from "@/components/ui/Arrow";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { FEATURE_KEYS, PRODUCT_IDS } from "@/content/catalog";
import { routes } from "@/i18n/routes";
import { ordinal } from "@/lib/utils";

/**
 * The two products, as the first thing the page says after the claim.
 *
 * Deliberately above the services: a company that owns products and a company
 * that takes briefs are two different propositions, and the order of the page is
 * the argument for which one this is. Three of the five feature lines are shown
 * here; the rest are on the products page, which is what the link is for.
 */
export async function HomeProducts() {
  const [t, tCatalog, tProducts] = await Promise.all([
    getTranslations("home.productsSection"),
    getTranslations("catalog.products"),
    getTranslations("products"),
  ]);

  const shown = FEATURE_KEYS.slice(0, 3);

  return (
    <Section id="products" spacing="default" label={t("eyebrow")}>
      <Container>
        <SectionHeading eyebrow={t("eyebrow")} headline={t("headline")} lead={t("lead")}>
          <div data-reveal className="mt-8">
            <Button href={routes.products} variant="text">
              {t("cta")}
              <Arrow className="size-3.5" />
            </Button>
          </div>
        </SectionHeading>

        <ul className="mt-16 grid gap-6 md:mt-20 lg:grid-cols-2">
          {PRODUCT_IDS.map((id, index) => (
            <li key={id} data-reveal className="flex">
              <article className="flex w-full flex-col border border-hairline bg-surface/40 p-6 md:p-10">
                <div className="flex items-start justify-between gap-6">
                  <Eyebrow className="text-accent-text">{tCatalog(`${id}.tag`)}</Eyebrow>
                  <span className="font-mono text-micro text-subtle">{ordinal(index)}</span>
                </div>

                <h3 className="mt-10 font-display text-title-3">{tCatalog(`${id}.name`)}</h3>
                <p className="mt-4 text-body text-muted">{tCatalog(`${id}.summary`)}</p>

                {/*
                  `mt-auto` on the list, not on the link: the two cards hold
                  different amounts of prose, and pinning the feature list to the
                  bottom is what keeps their hairlines and links on one line
                  across the pair.
                */}
                <ul className="mt-auto flex flex-col gap-3 border-t border-hairline pt-8">
                  {shown.map((key) => (
                    <li key={key} className="flex items-baseline gap-3 text-caption">
                      <span aria-hidden className="size-1 shrink-0 translate-y-[-2px] bg-accent" />
                      {tCatalog(`${id}.features.${key}`)}
                    </li>
                  ))}
                </ul>

                <div className="mt-8">
                  <Button href={`${routes.checkout}?product=${id}`} size="sm">
                    {tProducts("orderNow")}
                    <Arrow className="size-3.5" />
                  </Button>
                </div>
              </article>
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}
