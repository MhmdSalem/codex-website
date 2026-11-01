import { hasLocale } from "next-intl";
import { notFound } from "next/navigation";

import { routing } from "@/i18n/routing";
import { PlanB } from "@/plan-b/PlanB";

export default async function PlanBPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  return <PlanB locale={locale} />;
}
