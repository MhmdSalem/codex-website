import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/get-dictionary";
import { connectToDatabase } from "@/lib/db/mongoose";
import { ContentModel } from "@/lib/db/models/content";
import { ar } from "@/lib/i18n/dictionaries/ar";
import { en } from "@/lib/i18n/dictionaries/en";
import type { ContentStyles, StyleOverride } from "@/lib/content/style-types";

const fallback: Record<Locale, Dictionary> = { ar, en };

/**
 * Deep-merges the static fallback with the value stored in the DB.
 * DB values always win for keys they define; missing keys (e.g. newly added
 * fields in the dictionary) are filled in from the static fallback so the
 * site never breaks when we add new content paths.
 */
function isPlainObject(value: unknown): value is Record<string, unknown> {
  return (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value) &&
    Object.getPrototypeOf(value) === Object.prototype
  );
}

function deepMerge<T>(base: T, override: unknown): T {
  if (!isPlainObject(base) || !isPlainObject(override)) {
    return (override === undefined ? base : (override as T));
  }
  const result: Record<string, unknown> = { ...base };
  for (const key of Object.keys(override)) {
    const baseVal = (base as Record<string, unknown>)[key];
    const overrideVal = (override as Record<string, unknown>)[key];
    if (isPlainObject(baseVal) && isPlainObject(overrideVal)) {
      result[key] = deepMerge(baseVal, overrideVal);
    } else {
      result[key] = overrideVal;
    }
  }
  return result as T;
}

/**
 * Fetches the (live) dictionary for a locale from MongoDB.
 * Falls back to the static dictionary if the DB has no document yet.
 * New keys added to the static dictionary always appear, even when the DB
 * document was saved before those keys existed.
 */
export async function getContent(locale: Locale): Promise<Dictionary> {
  try {
    await connectToDatabase();
    const doc = await ContentModel.findOne({ locale }).lean();
    if (doc?.data) {
      return deepMerge(fallback[locale], doc.data);
    }
  } catch (err) {
    console.error("[content] failed to fetch from DB, using fallback:", err);
  }
  return fallback[locale];
}

/**
 * Fetches both data and style overrides for a locale.
 */
export async function getContentBundle(
  locale: Locale,
): Promise<{ data: Dictionary; styles: ContentStyles }> {
  try {
    await connectToDatabase();
    const doc = await ContentModel.findOne({ locale }).lean();
    if (doc?.data) {
      return {
        data: deepMerge(fallback[locale], doc.data),
        styles: (doc.styles as ContentStyles) ?? {},
      };
    }
  } catch (err) {
    console.error("[content] failed to fetch bundle from DB, using fallback:", err);
  }
  return { data: fallback[locale], styles: {} };
}

/**
 * Fetches just the style overrides for a locale.
 */
export async function getContentStyles(locale: Locale): Promise<ContentStyles> {
  try {
    await connectToDatabase();
    const doc = await ContentModel.findOne({ locale }, { styles: 1 }).lean();
    return ((doc?.styles as ContentStyles) ?? {}) as ContentStyles;
  } catch {
    return {};
  }
}

/**
 * Replaces the entire dictionary for a locale.
 */
export async function saveContent(
  locale: Locale,
  data: Dictionary,
  updatedBy?: string,
) {
  await connectToDatabase();
  await ContentModel.findOneAndUpdate(
    { locale },
    { $set: { data, updatedBy: updatedBy ?? null } },
    { upsert: true, new: true },
  );
}

/**
 * Saves a single style override for a path inside a locale.
 * Pass an empty object or null to clear.
 */
export async function saveStyleOverride(
  locale: Locale,
  path: string,
  style: StyleOverride | null,
  updatedBy?: string,
) {
  await connectToDatabase();
  if (!style || Object.keys(style).length === 0) {
    await ContentModel.findOneAndUpdate(
      { locale },
      {
        $unset: { [`styles.${path}`]: "" },
        $set: { updatedBy: updatedBy ?? null },
      },
      { upsert: true },
    );
    return;
  }

  await ContentModel.findOneAndUpdate(
    { locale },
    {
      $set: {
        [`styles.${path}`]: style,
        updatedBy: updatedBy ?? null,
      },
    },
    { upsert: true, new: true },
  );
}

/**
 * Replaces the entire styles map for a locale.
 */
export async function saveAllStyles(
  locale: Locale,
  styles: ContentStyles,
  updatedBy?: string,
) {
  await connectToDatabase();
  await ContentModel.findOneAndUpdate(
    { locale },
    { $set: { styles, updatedBy: updatedBy ?? null } },
    { upsert: true, new: true },
  );
}

/**
 * Updates just one nested field at the given dot-path.
 */
export async function setContentField(
  locale: Locale,
  path: string,
  value: unknown,
  updatedBy?: string,
) {
  await connectToDatabase();
  await ContentModel.findOneAndUpdate(
    { locale },
    {
      $set: {
        [`data.${path}`]: value,
        updatedBy: updatedBy ?? null,
      },
    },
    { upsert: true, new: true },
  );
}

/**
 * Wipes any DB customizations for a locale so the static dictionary
 * (lib/i18n/dictionaries/<locale>.ts) becomes the source of truth again.
 * Useful when the EN doc ends up with Arabic data (or vice-versa) and
 * the operator just wants a clean slate.
 */
export async function resetLocaleContent(locale: Locale, updatedBy?: string) {
  await connectToDatabase();
  await ContentModel.findOneAndUpdate(
    { locale },
    {
      $set: {
        data: fallback[locale],
        styles: {},
        updatedBy: updatedBy ?? null,
      },
    },
    { upsert: true, new: true },
  );
}
