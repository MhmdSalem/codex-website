import type { Metadata } from "next";
import { Inter, IBM_Plex_Sans_Arabic, Playfair_Display } from "next/font/google";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { MobileBottomNav } from "@/components/layout/mobile-bottom-nav";
import { CursorGlow } from "@/components/effects/cursor-glow";
import { UnderConstruction } from "@/components/maintenance/under-construction";
import { isValidLocale, locales, localeDirections, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getContentStyles } from "@/lib/content/service";
import { getSiteSettings } from "@/lib/settings/service";
import { StylesInjector } from "@/components/content/styles-injector";

const SESSION_COOKIE = "codex_session";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const display = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-display",
  display: "swap",
});

const arabic = IBM_Plex_Sans_Arabic({
  subsets: ["arabic"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-arabic",
  display: "swap",
});

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  if (!isValidLocale(params.locale)) return {};
  const dict = await getDictionary(params.locale);
  return {
    title: dict.meta.title,
    description: dict.meta.description,
    keywords: dict.meta.keywords,
    alternates: {
      canonical: `/${params.locale}`,
      languages: {
        ar: "/ar",
        en: "/en",
      },
    },
    openGraph: {
      title: dict.meta.title,
      description: dict.meta.description,
      locale: params.locale === "ar" ? "ar_EG" : "en_US",
      alternateLocale: params.locale === "ar" ? "en_US" : "ar_EG",
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  if (!isValidLocale(params.locale)) notFound();

  const locale = params.locale as Locale;
  const direction = localeDirections[locale];
  const dict = await getDictionary(locale);
  const styles = await getContentStyles(locale);
  const settings = await getSiteSettings();

  // Admins (anyone holding the session cookie) bypass maintenance so they
  // can still preview the live site while it's hidden from the public.
  const hasAdminSession = cookies().get(SESSION_COOKIE)?.value;
  const showMaintenance = settings.maintenanceMode && !hasAdminSession;

  return (
    <html
      lang={locale}
      dir={direction}
      className={`${inter.variable} ${display.variable} ${arabic.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-screen flex flex-col bg-background relative">
        <StylesInjector styles={styles} />
        {showMaintenance ? (
          <UnderConstruction message={settings.maintenanceMessage} />
        ) : (
          <>
            <CursorGlow />
            <Navbar locale={locale} dict={dict} />
            <main className="flex-1 relative z-10">{children}</main>
            <Footer locale={locale} dict={dict} />
            <MobileBottomNav locale={locale} dict={dict} />
          </>
        )}
      </body>
    </html>
  );
}
