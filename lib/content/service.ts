import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/get-dictionary";
import { connectToDatabase } from "@/lib/db/mongoose";
import { ContentModel } from "@/lib/db/models/content";
import { ar } from "@/lib/i18n/dictionaries/ar";
import { en } from "@/lib/i18n/dictionaries/en";

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
    {
      $set: { data, updatedBy: updatedBy ?? null },
    },
    { upsert: true, new: true },
  );
}
