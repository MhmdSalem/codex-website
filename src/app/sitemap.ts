import type { MetadataRoute } from "next";
import { legalNavigation, primaryNavigation, routes, type RouteKey } from "@/i18n/routes";
import { locales, localeHrefLang } from "@/i18n/routing";
import { getProjectSlugs } from "@/lib/content";
import { absoluteUrlFor } from "@/lib/seo";

/**
 * Every page in every language, with hreflang alternates on each entry so
 * search engines pair the translations rather than treating them as
 * duplicates.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Deduplicated: `home` is both the root and a navigation entry, and listing a
  // URL twice in a sitemap is a validation error rather than a hint.
  const staticKeys: RouteKey[] = [
    ...new Set<RouteKey>(["home", ...primaryNavigation, ...legalNavigation]),
  ];
  const projectSlugs = await getProjectSlugs();

  const paths = [
    ...staticKeys.map((key) => ({ path: routes[key], priority: key === "home" ? 1 : 0.8 })),
    ...projectSlugs.map((slug) => ({ path: `/work/${slug}`, priority: 0.7 })),
  ];

  const lastModified = new Date();

  return paths.flatMap(({ path, priority }) =>
    locales.map((locale) => ({
      url: absoluteUrlFor(locale, path),
      lastModified,
      changeFrequency: "monthly" as const,
      priority,
      alternates: {
        languages: Object.fromEntries(
          locales.map((alternate) => [localeHrefLang[alternate], absoluteUrlFor(alternate, path)]),
        ),
      },
    })),
  );
}
