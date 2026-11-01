import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { LegalPolicy } from "@/components/legal/LegalPolicy";
import type { Locale } from "@/i18n/routing";
import { getLegalPage } from "@/lib/content";
import { buildPageMetadata } from "@/lib/seo";

interface PageProps {
  params: Promise<{ locale: Locale }>;
}

const LEGAL_KEY = "refunds";
const LAST_UPDATED = "2026-09-14";
/* `commitment` is the header's own sentence — see the note on the delivery page. */
const SECTIONS = ["digital", "afterUse", "custom", "mistaken", "payout", "contact"] as const;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const [t, page] = await Promise.all([
    getTranslations({ locale, namespace: "refunds" }),
    getLegalPage(locale, LEGAL_KEY),
  ]);

  return buildPageMetadata({
    locale,
    path: "/refunds",
    title: page?.title ?? t("title"),
    description: page?.summary ?? t("description"),
    seo: page?.seo,
  });
}

export default async function RefundsPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <LegalPolicy
      locale={locale}
      namespace="refunds"
      legalKey={LEGAL_KEY}
      sections={SECTIONS}
      lastUpdated={LAST_UPDATED}
    />
  );
}
