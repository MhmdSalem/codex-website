import { languageIds } from "../locale/languages";

/**
 * Derives a slug source from a localized field, preferring the default
 * language and falling back to the first translation that has content.
 *
 * Slugs are deliberately shared across locales: /en/work/atlas and
 * /ar/work/atlas point at the same document, which keeps hreflang pairs,
 * analytics and shared links coherent.
 */
export function localizedSlugSource(fieldName: string) {
  return (doc: Record<string, unknown>): string => {
    const value = doc[fieldName];
    if (value && typeof value === "object") {
      const localized = value as Record<string, unknown>;
      for (const id of languageIds) {
        const candidate = localized[id];
        if (typeof candidate === "string" && candidate.trim().length > 0) {
          return candidate;
        }
      }
    }
    return "";
  };
}

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\u0600-\u06ff]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 96);
}
