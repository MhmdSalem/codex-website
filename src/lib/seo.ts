import type { Metadata } from "next";
import { urlForImage } from "@cms/lib/image";
import type { SanityImage, SanitySeo } from "@cms/types";
import {
  defaultLocale,
  locales,
  localeHrefLang,
  localeOpenGraph,
  type Locale,
} from "@/i18n/routing";
import { env } from "./env";

/** Path with its locale prefix, e.g. buildPath("ar", "/work") → "/ar/work". */
export function buildPath(locale: Locale, path: string): string {
  const normalized = path === "/" ? "" : path.startsWith("/") ? path : `/${path}`;
  return `/${locale}${normalized}`;
}

export function absoluteUrlFor(locale: Locale, path: string): string {
  return `${env.siteUrl}${buildPath(locale, path)}`;
}

/**
 * hreflang map for a locale-less path.
 *
 * `x-default` points at the default locale, which is what search engines use
 * when they cannot infer a language preference.
 */
export function languageAlternates(path: string): Record<string, string> {
  const alternates: Record<string, string> = {};
  for (const locale of locales) {
    alternates[localeHrefLang[locale]] = absoluteUrlFor(locale, path);
  }
  alternates["x-default"] = absoluteUrlFor(defaultLocale, path);
  return alternates;
}

function ogImageUrl(image: SanityImage | null | undefined): string | null {
  if (!image?.asset?._ref) return null;
  return urlForImage(image).width(1200).height(630).fit("crop").url();
}

interface PageMetadataArgs {
  locale: Locale;
  /** Locale-less path, e.g. "/work/atlas". */
  path: string;
  title: string;
  description: string;
  /** CMS overrides; any populated field wins over the arguments above. */
  seo?: SanitySeo | null;
  /** Used when the page itself has no share image. */
  fallbackImage?: SanityImage | null;
  siteName?: string;
  type?: "website" | "article";
  /**
   * Keeps a page out of search results.
   *
   * For routes that exist but are not part of the published site yet — a page
   * with nothing real on it should not be the first thing a search engine finds
   * about the company. The CMS flag has the same effect, and either one wins.
   */
  noIndex?: boolean;
}

/**
 * Builds page metadata with canonical URL, hreflang alternates, Open Graph
 * and Twitter cards from a single call.
 *
 * Precedence is always: CMS SEO field → page value → translated default.
 */
export function buildPageMetadata({
  locale,
  path,
  title,
  description,
  seo,
  fallbackImage,
  siteName = "CODEX TECH",
  type = "website",
  noIndex = false,
}: PageMetadataArgs): Metadata {
  const resolvedTitle = seo?.title?.trim() || title;
  const resolvedDescription = seo?.description?.trim() || description;
  const url = absoluteUrlFor(locale, path);
  const image = ogImageUrl(seo?.ogImage) ?? ogImageUrl(fallbackImage);

  return {
    title: resolvedTitle,
    description: resolvedDescription,
    keywords: seo?.keywords ?? undefined,
    alternates: {
      canonical: url,
      languages: languageAlternates(path),
    },
    openGraph: {
      type,
      url,
      title: resolvedTitle,
      description: resolvedDescription,
      siteName,
      locale: localeOpenGraph[locale],
      ...(image ? { images: [{ url: image, width: 1200, height: 630, alt: resolvedTitle }] } : {}),
    },
    twitter: {
      card: image ? "summary_large_image" : "summary",
      title: resolvedTitle,
      description: resolvedDescription,
      ...(image ? { images: [image] } : {}),
    },
    ...(seo?.noIndex || noIndex
      ? { robots: { index: false, follow: false } }
      : { robots: { index: true, follow: true } }),
  };
}
