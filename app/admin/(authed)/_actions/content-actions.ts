"use server";

import { revalidatePath } from "next/cache";
import { requireSession } from "@/lib/auth/guard";
import { saveContent, saveAllStyles } from "@/lib/content/service";
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
