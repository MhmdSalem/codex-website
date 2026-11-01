import type { ModuleId } from "@/experience/hero/scene";

/**
 * What the company sells, as data.
 *
 * The strings live in `messages/*.json` under `catalog.*`; this file holds only
 * the ids and their order, so the homepage sections and the detail pages are
 * guaranteed to describe the same six services and the same two products.
 *
 * Ids are literal (`as const`) because next-intl checks message keys at compile
 * time — a widened `string` would make `t(`services.${id}.name`)` unverifiable.
 */

/** Service ids double as glyph ids, so the hero and the pages share one icon set. */
export const SERVICE_IDS = [
  "webPlatforms",
  "aiSolutions",
  "mobileApps",
  "dataAnalytics",
  "automation",
  "integrations",
] as const satisfies readonly ModuleId[];

export type ServiceId = (typeof SERVICE_IDS)[number];

/** Every service carries exactly four include lines. */
export const INCLUDE_KEYS = ["a", "b", "c", "d"] as const;

export const PRODUCT_IDS = ["accreditation", "daawa"] as const;
export type ProductId = (typeof PRODUCT_IDS)[number];

/** Every product carries exactly five feature lines. */
export const FEATURE_KEYS = ["a", "b", "c", "d", "e"] as const;

export const PROCESS_IDS = ["discover", "design", "develop", "launch"] as const;
export type ProcessId = (typeof PROCESS_IDS)[number];
