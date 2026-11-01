import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { LegalPolicy } from "@/components/legal/LegalPolicy";
import type { Locale } from "@/i18n/routing";
import { getLegalPage } from "@/lib/content";
import { buildPageMetadata } from "@/lib/seo";

interface PageProps {
  params: Promise<{ locale: Locale }>;
}

const LEGAL_KEY = "privacy";

/**
 * The date this policy last changed.
 *
 * Hard-coded rather than derived from the build: a policy that claims to have
 * been updated every time the site is deployed is telling the reader nothing.
 * Change it when the text changes.
 */
const LAST_UPDATED = "2026-08-31";

const SECTIONS = [
  "collect",
  "use",
  "retention",
  "processors",
  "cookies",
  "rights",
  "contact",
] as const;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const [t, page] = await Promise.all([
    getTranslations({ locale, namespace: "privacy" }),
    getLegalPage(locale, LEGAL_KEY),
  ]);

  return buildPageMetadata({
    locale,
    path: "/privacy",
    title: page?.title ?? t("title"),
    description: page?.summary ?? t("description"),
    seo: page?.seo,
  });
}

export default async function PrivacyPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <LegalPolicy
      locale={locale}
      namespace="privacy"
      legalKey={LEGAL_KEY}
      sections={SECTIONS}
      lastUpdated={LAST_UPDATED}
    />
  );
}
