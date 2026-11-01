/**
 * Small helpers for "the dashboard first, the message catalogue second".
 *
 * Every page reads its copy from the CMS when an editor has filled it in and
 * falls back to `messages/*.json` otherwise, field by field — so a document
 * that is half filled never leaves a hole on the page.
 */

/** The CMS value if it carries content, otherwise the fallback. */
export function pick<T extends string | readonly unknown[]>(
  cms: T | null | undefined,
  fallback: T,
): T {
  if (cms === null || cms === undefined) return fallback;
  if (typeof cms === "string") return cms.trim().length > 0 ? cms : fallback;
  return cms.length > 0 ? cms : fallback;
}

/** The first document whose `key` matches, if any. */
export function byKey<T extends { key: string | null }>(
  items: readonly T[] | null | undefined,
  key: string,
): T | undefined {
  return items?.find((item) => item.key === key);
}

/** One item of a CMS list by position, when the list is long enough. */
export function at<T>(items: readonly T[] | null | undefined, index: number): T | undefined {
  return items?.[index];
}
