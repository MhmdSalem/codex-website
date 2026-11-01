import { defineRouting } from "next-intl/routing";

export const locales = ["en", "ar"] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "ar";

export type Direction = "ltr" | "rtl";

export const localeDirection: Record<Locale, Direction> = {
  en: "ltr",
  ar: "rtl",
};

/** Native label, used in the language switcher. */
export const localeLabel: Record<Locale, string> = {
  en: "English",
  ar: "العربية",
};

/** Short label for compact UI. */
export const localeShortLabel: Record<Locale, string> = {
  en: "EN",
  ar: "ع",
};

/** BCP-47 tags for hreflang and OG locale metadata. */
export const localeHrefLang: Record<Locale, string> = {
  en: "en",
  ar: "ar",
};

export const localeOpenGraph: Record<Locale, string> = {
  en: "en_US",
  ar: "ar_AE",
};

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

export function directionOf(locale: Locale): Direction {
  return localeDirection[locale];
}

export const routing = defineRouting({
  locales,
  defaultLocale,
  /** Both languages are always visible in the URL: /en/... and /ar/... */
  localePrefix: "always",
  // The published site is Arabic. English routes still exist, but the browser
  // language must not send a visitor there — there is no switcher to come back.
  localeDetection: false,
});
