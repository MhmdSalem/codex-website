import type { ProductId, ServiceId } from "@/content/catalog";

/**
 * Starting prices, as data.
 *
 * One source for both languages: the amounts live here and are formatted per
 * locale, so an Arabic figure can never drift from its English twin the way two
 * hand-written strings in the message files would.
 *
 * Every number is a floor, not a price — the smallest serious version of that
 * service. They sit at the established-agency tier of the Egyptian market
 * (2026), deliberately above the template-shop band: a custom platform is
 * quoted there from about EGP 120k, a cross-platform app MVP from about 150k.
 * Raise them the day the floor moves; the copy says "from" and nothing else in
 * the page hard-codes a figure.
 */
export const CURRENCY = "EGP";

/**
 * Starting price of each product, for the order summary.
 *
 * Same rule as the service floors: a starting figure, not a closed invoice.
 * The checkout says so, and the payment button does not collect anything.
 */
export const PRODUCT_FROM: Record<ProductId, number> = {
  accreditation: 85_000,
  daawa: 65_000,
};

export const SERVICE_FROM: Record<ServiceId, number> = {
  webPlatforms: 120_000,
  aiSolutions: 180_000,
  mobileApps: 150_000,
  dataAnalytics: 90_000,
  automation: 60_000,
  integrations: 50_000,
};

export type EngagementId = "project" | "retainer" | "partnership";

export interface Engagement {
  id: EngagementId;
  /** Omitted where a number would be a guess rather than a floor. */
  from?: number;
  /** A retainer is a monthly figure; a project is not. */
  monthly?: boolean;
}

/**
 * The three ways of working, in the order they are shown.
 *
 * A product partnership carries no figure on purpose: it is equity, revenue or
 * a shared build, and a starting number would misdescribe it.
 */
export const ENGAGEMENTS: readonly Engagement[] = [
  { id: "project", from: 120_000 },
  { id: "retainer", from: 35_000, monthly: true },
  { id: "partnership" },
] as const;
