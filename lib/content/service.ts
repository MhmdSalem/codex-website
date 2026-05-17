import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/get-dictionary";
import { connectToDatabase } from "@/lib/db/mongoose";
import { ContentModel } from "@/lib/db/models/content";
import { ar } from "@/lib/i18n/dictionaries/ar";
import { en } from "@/lib/i18n/dictionaries/en";
import type { ContentStyles, StyleOverride } from "@/lib/content/style-types";

const fallback: Record<Locale, Dictionary> = { ar, en };

/**
 * Fetches the (live) dictionary for a locale from MongoDB.
 * Falls back to the static dictionary if the DB has no document yet.
 */
export async function getContent(locale: Locale): Promise<Dictionary> {
  try {
    await connectToDatabase();
    const doc = await ContentModel.findOne({ locale }).lean();
    if (doc?.data) {
      return doc.data as Dictionary;
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
        data: doc.data as Dictionary,
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
