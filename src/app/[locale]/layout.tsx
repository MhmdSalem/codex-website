import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { CSSProperties, ReactNode } from "react";

import "../globals.css";

import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { SkipLink } from "@/components/layout/SkipLink";
import { SmoothScrollProvider } from "@/components/providers/SmoothScrollProvider";
import { Backdrop } from "@/experience/build/Backdrop";
import { Caret } from "@/experience/caret/Caret";
import { Opening } from "@/experience/opening/Opening";
import { isRetiredPath, primaryNavigation, routes } from "@/i18n/routes";
import { directionOf, routing, type Locale } from "@/i18n/routing";
import { getSiteSettings } from "@/lib/content";
import { env } from "@/lib/env";
import { fontVariables } from "@/lib/fonts";
import { navigationFromRoutes, resolveCta, resolveNavItem, type ResolvedLink } from "@/lib/links";
import { languageAlternates } from "@/lib/seo";

interface LocaleLayoutProps {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#000000",
};

/** Both locales are prerendered at build time. */
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: Omit<LocaleLayoutProps, "children">): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) return {};

  const [t, settings] = await Promise.all([
    getTranslations({ locale, namespace: "meta" }),
    getSiteSettings(locale),
  ]);

  const siteName = settings?.siteName ?? t("siteName");
  const title = settings?.defaultSeoTitle ?? t("defaultTitle");
  const description = settings?.defaultSeoDescription ?? t("defaultDescription");

  return {
    metadataBase: new URL(env.siteUrl),
    title: {
      default: title,
      template: t("titleTemplate", { title: "%s" }),
    },
    description,
    applicationName: siteName,
    alternates: {
      canonical: `/${locale}`,
      languages: languageAlternates("/"),
    },
    formatDetection: { telephone: false },
  };
}

export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  // Required before any translation call, and what keeps descendant routes
  // on the static rendering path.
  setRequestLocale(locale);

  const typedLocale = locale as Locale;
  const [settings, tNav, tMeta] = await Promise.all([
    getSiteSettings(typedLocale),
    getTranslations("nav"),
    getTranslations("meta"),
  ]);

  const navigation = (
    settings?.primaryNavigation
      ?.map(resolveNavItem)
      .filter((item): item is NonNullable<typeof item> => item !== null) ??
    navigationFromRoutes(primaryNavigation, (key) => tNav(key))
  ).filter((item) => !isRetiredPath(item.href));

  const headerCta: ResolvedLink = resolveCta(settings?.headerCta) ?? {
    label: tNav("cta"),
    href: routes.contact,
    external: false,
    newTab: false,
  };

  // Only the fill role is overridable; the text variant stays the house colour
  // so an editor cannot accidentally push a link below its contrast floor.
  const accent = settings?.theme?.accentColor;
  const themeStyle = accent ? ({ "--color-accent-project": accent } as CSSProperties) : undefined;

  return (
    <html
      lang={typedLocale}
      dir={directionOf(typedLocale)}
      className={fontVariables}
      style={themeStyle}
      suppressHydrationWarning
    >
      <body className="bg-background text-foreground antialiased">
        <NextIntlClientProvider>
          <SkipLink />
          <SmoothScrollProvider enabled={settings?.theme?.enableSmoothScroll ?? true}>
            {/*
              Every full load opens with the mark being typed, and every page sits
              on the same backdrop: glow, living network, and the core drifting
              with the scroll. Client navigation keeps both mounted, so moving
              between pages neither replays the opening nor restarts the scene.
            */}
            <Opening />
            <Backdrop />
            <Header
              siteName={settings?.siteName ?? tMeta("siteName")}
              navigation={navigation}
              cta={headerCta}
            />
            <main id="main" data-prologue-inert className="min-h-svh pt-header pb-20 lg:pb-0">
              {children}
            </main>
            <Footer locale={typedLocale} />
            {/*
              The caret: the logo's bar, loose on the page. Mounted once here so
              it survives navigation and the opening can hand its bar to it.
            */}
            <Caret />
          </SmoothScrollProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
