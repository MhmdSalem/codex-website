"use server";

import { revalidatePath } from "next/cache";
import { requireSession } from "@/lib/auth/guard";
import { saveContent, saveAllStyles } from "@/lib/content/service";
import { ar } from "@/lib/i18n/dictionaries/ar";
import { en } from "@/lib/i18n/dictionaries/en";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/get-dictionary";
import type { ContentStyles } from "@/lib/content/style-types";

const PUBLIC_PATHS_TO_REVALIDATE = (locale: Locale) => [
  `/${locale}`,
  `/${locale}/about`,
  `/${locale}/services`,
  `/${locale}/contact`,
  "/",
];

const FALLBACK_DICTIONARIES: Record<Locale, Dictionary> = { ar, en };

export type SavePayload = {
  locale: Locale;
  data: Dictionary;
  styles: ContentStyles;
};

export async function saveContentAndStyles(payload: SavePayload) {
  const session = await requireSession();

  await saveContent(payload.locale, payload.data, session.sub);
  await saveAllStyles(payload.locale, payload.styles, session.sub);

  for (const path of PUBLIC_PATHS_TO_REVALIDATE(payload.locale)) {
    revalidatePath(path);
  }

  return { ok: true } as const;
}

/**
 * Restores a locale's content to the original built-in dictionary
 * (lib/i18n/dictionaries/{locale}.ts). Used when the DB content for a
 * locale has been corrupted/overwritten with wrong-language text and
 * the user wants to start over from the bundled defaults.
 *
 * Style overrides are cleared too so the page is fully reset visually.
 */
export async function resetLocaleToDefaults(locale: Locale) {
  const session = await requireSession();
  if (session.role !== "super_admin" && session.role !== "admin") {
    throw new Error("forbidden");
  }

  const defaults = FALLBACK_DICTIONARIES[locale];
  await saveContent(locale, defaults, session.sub);
  await saveAllStyles(locale, {}, session.sub);

  for (const path of PUBLIC_PATHS_TO_REVALIDATE(locale)) {
    revalidatePath(path);
  }

  return { ok: true } as const;
}
