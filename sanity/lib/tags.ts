/**
 * Cache tags used for on-demand revalidation.
 *
 * The webhook at /api/revalidate receives the document `_type` and `slug`
 * and invalidates only the tags that actually changed.
 */
export const cacheTags = {
  siteSettings: "siteSettings",
  homepage: "homepage",
  aboutPage: "aboutPage",
  contactPage: "contactPage",
  products: "products",
  projects: "projects",
  services: "services",
  legalPages: "legalPages",
  product: (slug: string) => `product:${slug}`,
  project: (slug: string) => `project:${slug}`,
  service: (slug: string) => `service:${slug}`,
  legalPage: (key: string) => `legalPage:${key}`,
} as const;

/** Every tag affected by a change to a document of the given type. */
export function tagsForDocumentType(type: string, slug?: string): string[] {
  switch (type) {
    case "siteSettings":
      // Site settings appear in the header and footer of every page.
      return [
        cacheTags.siteSettings,
        cacheTags.homepage,
        cacheTags.products,
        cacheTags.projects,
        cacheTags.services,
        cacheTags.aboutPage,
        cacheTags.contactPage,
        cacheTags.legalPages,
      ];
    case "homepage":
      return [cacheTags.homepage];
    case "aboutPage":
      return [cacheTags.aboutPage];
    case "contactPage":
      return [cacheTags.contactPage];
    case "product":
      return slug
        ? [cacheTags.products, cacheTags.homepage, cacheTags.product(slug)]
        : [cacheTags.products, cacheTags.homepage];
    case "project":
      return slug
        ? [cacheTags.projects, cacheTags.homepage, cacheTags.project(slug)]
        : [cacheTags.projects, cacheTags.homepage];
    case "service":
      return slug
        ? [cacheTags.services, cacheTags.homepage, cacheTags.service(slug)]
        : [cacheTags.services, cacheTags.homepage];
    case "legalPage":
      return slug ? [cacheTags.legalPages, cacheTags.legalPage(slug)] : [cacheTags.legalPages];
    default:
      return [];
  }
}

/** Fallback ISR window when no webhook has fired. One hour. */
export const DEFAULT_REVALIDATE_SECONDS = 3600;
