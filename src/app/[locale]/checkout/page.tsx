import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { CheckoutForm, type CheckoutOffer } from "@/components/forms/CheckoutForm";
import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/ui/PageHeader";
import { Section } from "@/components/ui/Section";
import { PRODUCT_IDS, type ProductId } from "@/content/catalog";
import { resolveEmail } from "@/content/contact";
import { PRODUCT_FROM } from "@/content/pricing";
import type { Locale } from "@/i18n/routing";
import { getSiteSettings } from "@/lib/content";
import { buildPageMetadata } from "@/lib/seo";

interface PageProps {
  params: Promise<{ locale: Locale }>;
  searchParams: Promise<{ product?: string | string[] }>;
}

function listed(value: string | string[] | undefined): string[] {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
}

function isProductId(value: string): value is ProductId {
  return PRODUCT_IDS.some((id) => id === value);
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "checkout" });

  return buildPageMetadata({
    locale,
    path: "/checkout",
    title: t("title"),
    description: t("description"),
    // Payment does not run yet. Keep the form reachable, not indexed.
    noIndex: true,
  });
}

export default async function CheckoutPage({ params, searchParams }: PageProps) {
  const { locale } = await params;
  const query = await searchParams;
  setRequestLocale(locale);

  const [t, tProducts, settings] = await Promise.all([
    getTranslations("checkout"),
    getTranslations("catalog.products"),
    getSiteSettings(locale),
  ]);

  const offers: CheckoutOffer[] = PRODUCT_IDS.map((id) => ({
    id,
    group: "product" as const,
    name: tProducts(`${id}.name`),
    summary: tProducts(`${id}.summary`),
    amount: PRODUCT_FROM[id],
  }));

  const initialIds = listed(query.product).filter(isProductId);

  return (
    <>
      <PageHeader eyebrow={t("eyebrow")} headline={t("headline")} description={t("lead")} />

      <Section spacing="default" label={t("title")} className="border-t border-border">
        <Container>
          <div className="max-w-[44rem]">
            <CheckoutForm
              locale={locale}
              offers={offers}
              initialIds={initialIds}
              email={resolveEmail(settings)}
            />
          </div>
        </Container>
      </Section>
    </>
  );
}
