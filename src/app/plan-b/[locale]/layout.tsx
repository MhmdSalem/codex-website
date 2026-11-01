import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";
import type { ReactNode } from "react";

import "../../globals.css";

import { SmoothScrollProvider } from "@/components/providers/SmoothScrollProvider";
import { directionOf, routing, type Locale } from "@/i18n/routing";
import { fontVariables } from "@/lib/fonts";
import { PlanBHeader } from "@/plan-b/chrome/PlanBHeader";

interface PlanBLayoutProps {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}

/**
 * Root layout for the second concept.
 *
 * This route sits outside `[locale]` deliberately, next to the design reference:
 * it is a concept, not a page of the site, and it needs its own chrome. Nesting
 * it under the site's layout would put the seven-item navigation and the footer
 * around an argument that is supposed to be a single uninterrupted scroll.
 *
 * It carries the design tokens, the fonts, the smooth scroll and the
 * translations. It carries nothing else from the site, and the site carries
 * nothing from it.
 */
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: Omit<PlanBLayoutProps, "children">): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) return {};

  const t = await getTranslations({ locale, namespace: "planB" });

  return {
    title: `CODEX TECH — ${t("title")}`,
    description: t("description"),
    // Internal. Absent from the sitemap and the navigation for the same reason.
    robots: { index: false, follow: false },
  };
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default async function PlanBLayout({ children, params }: PlanBLayoutProps) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  // Required before any translation call, and what keeps this route on the
  // static rendering path.
  setRequestLocale(locale);
  const typedLocale = locale as Locale;
  const messages = await getMessages({ locale });

  return (
    <html lang={typedLocale} dir={directionOf(typedLocale)} className={fontVariables}>
      <body className="bg-background text-foreground antialiased">
        <NextIntlClientProvider locale={typedLocale} messages={messages}>
          <SmoothScrollProvider>
            <PlanBHeader locale={typedLocale} />
            <main id="main">{children}</main>
          </SmoothScrollProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
