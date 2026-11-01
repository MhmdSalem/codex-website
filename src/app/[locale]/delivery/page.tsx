import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { LegalPolicy } from "@/components/legal/LegalPolicy";
import type { Locale } from "@/i18n/routing";
import { getLegalPage } from "@/lib/content";
import { buildPageMetadata } from "@/lib/seo";

interface PageProps {
  params: Promise<{ locale: Locale }>;
}

const LEGAL_KEY = "delivery";
const LAST_UPDATED = "2026-09-14";
/*
  `nature` is not listed. It says what the page header already says, and the
  same sentence twice in a row reads as a copy-paste rather than a policy. The
  statement is kept in `intro`, which is what the header renders.
*/
const SECTIONS = ["method", "digital", "custom", "confirmation", "contact"] as const;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const [t, page] = await Promise.all([
    getTranslations({ locale, namespace: "delivery" }),
    getLegalPage(locale, LEGAL_KEY),
  ]);

  return buildPageMetadata({
    locale,
    path: "/delivery",
    title: page?.title ?? t("title"),
    description: page?.summary ?? t("description"),
    seo: page?.seo,
  });
}

export default async function DeliveryPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <LegalPolicy
      locale={locale}
      namespace="delivery"
      legalKey={LEGAL_KEY}
      sections={SECTIONS}
      lastUpdated={LAST_UPDATED}
    />
  );
}
