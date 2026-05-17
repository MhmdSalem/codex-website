import type { MetadataRoute } from "next";
import { locales } from "@/lib/i18n/config";

const BASE_URL = "https://codex-tech.com";
const PAGES = ["", "/services", "/about", "/contact"] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const entries: MetadataRoute.Sitemap = [];
  for (const locale of locales) {
    for (const page of PAGES) {
      entries.push({
        url: `${BASE_URL}/${locale}${page}`,
        lastModified: now,
        changeFrequency: page === "" ? "weekly" : "monthly",
        priority: page === "" ? 1 : 0.7,
        alternates: {
          languages: Object.fromEntries(
            locales.map((l) => [l, `${BASE_URL}/${l}${page}`]),
          ),
        },
      });
    }
  }
  return entries;
}
