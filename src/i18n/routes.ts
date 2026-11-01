/**
 * The site's route map.
 *
 * Paths are identical across locales (only the /en | /ar prefix changes), and
 * the navigation labels live in `messages/*.json` under `nav.*`. Site Settings
 * in the CMS can override the visible label and order of these entries.
 */
export const routes = {
  home: "/",
  about: "/about",
  services: "/services",
  products: "/products",
  work: "/work",
  pricing: "/pricing",
  checkout: "/checkout",
  contact: "/contact",
  privacy: "/privacy",
  delivery: "/delivery",
  refunds: "/refunds",
} as const;

export type RouteKey = keyof typeof routes;
export type RoutePath = (typeof routes)[RouteKey];

/**
 * Order used by the header and footer when the CMS has no navigation set.
 *
 * `home` is listed explicitly. A mark that links home is a convention rather
 * than a label, and the header marks the current page — which means the index
 * needs an entry that can be marked.
 */
export const primaryNavigation: readonly RouteKey[] = [
  "home",
  "about",
  "services",
  "products",
  "pricing",
  "contact",
] as const;

/*
  `work` is deliberately not in the navigation.

  It exists and renders whatever the CMS holds, but there are no published case
  studies yet — and a menu entry that leads to "nothing here" costs more trust
  than a missing entry does. It is excluded from the sitemap too, which is built
  from the list above. Add it back the day it has something to show.

  Pricing used to sit here for the same reason and no longer does: the page now
  names a starting figure for every service, which makes it a destination rather
  than a conversation.

  Checkout is reached from "اطلب الآن" on a product, not from the menu. A payment
  step in the header reads as a shop, and this one does not take payment yet.
*/

/** Paths that must not appear in chrome even if the CMS still lists them. */
export const retiredPaths = new Set<string>([routes.work]);

export function isRetiredPath(href: string): boolean {
  const path = href.split("#")[0] ?? href;
  return [...retiredPaths].some((retired) => path === retired || path.startsWith(`${retired}/`));
}

export const legalNavigation: readonly RouteKey[] = ["privacy", "delivery", "refunds"] as const;

export function projectPath(slug: string): string {
  return `${routes.work}/${slug}`;
}
