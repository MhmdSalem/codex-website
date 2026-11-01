import type { SanityCta, SanityLink, SanityNavItem } from "@cms/types";
import { routes, type RouteKey } from "@/i18n/routes";

export interface ResolvedLink {
  label: string;
  href: string;
  /** True when the destination leaves the site and must bypass locale routing. */
  external: boolean;
  newTab: boolean;
}

export interface ResolvedNavItem extends ResolvedLink {
  children: ResolvedLink[];
}

/**
 * Turns a CMS link into something renderable.
 *
 * Internal routes stay relative so the locale-aware `Link` can prefix them;
 * everything else is normalised into a complete `mailto:`, `tel:` or `https:`
 * URL. Returns `null` when a link has no usable destination, which is how a
 * half-finished CMS entry disappears instead of rendering a dead link.
 */
export function resolveLink(link: SanityLink | null | undefined): ResolvedLink | null {
  if (!link?.label) return null;

  const label = link.label;
  const newTab = link.newTab ?? false;

  switch (link.kind) {
    case "external": {
      if (!link.href) return null;
      return { label, href: link.href, external: true, newTab: true };
    }
    case "email": {
      if (!link.href) return null;
      return { label, href: `mailto:${link.href}`, external: true, newTab: false };
    }
    case "phone": {
      if (!link.href) return null;
      return {
        label,
        href: `tel:${link.href.replace(/[^\d+]/g, "")}`,
        external: true,
        newTab: false,
      };
    }
    case "route":
    default: {
      const base = link.route ?? link.href;
      if (!base) return null;
      const anchor = link.anchor ? `#${link.anchor}` : "";
      return { label, href: `${base}${anchor}`, external: false, newTab };
    }
  }
}

export function resolveNavItem(item: SanityNavItem | null | undefined): ResolvedNavItem | null {
  const base = resolveLink(item);
  if (!base || !item) return null;

  const children = (item.children ?? [])
    .map(resolveLink)
    .filter((child): child is ResolvedLink => child !== null);

  return { ...base, children };
}

export interface ResolvedCta extends ResolvedLink {
  variant: NonNullable<SanityCta["variant"]>;
}

export function resolveCta(cta: SanityCta | null | undefined): ResolvedCta | null {
  const base = resolveLink(cta);
  if (!base) return null;
  return { ...base, variant: cta?.variant ?? "primary" };
}

/** Fallback navigation built from the routes the app actually implements. */
export function navigationFromRoutes(
  keys: readonly RouteKey[],
  translate: (key: RouteKey) => string,
): ResolvedNavItem[] {
  return keys.map((key) => ({
    label: translate(key),
    href: routes[key],
    external: false,
    newTab: false,
    children: [],
  }));
}

/** Builds a wa.me link from a raw WhatsApp number. */
export function whatsappHref(number: string): string {
  return `https://wa.me/${number.replace(/[^\d]/g, "")}`;
}
