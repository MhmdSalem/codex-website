"use server";

import { revalidatePath } from "next/cache";
import { requireSession } from "@/lib/auth/guard";
import { saveAllStyles } from "@/lib/content/service";
import type { Locale } from "@/lib/i18n/config";
import type { ContentStyles } from "@/lib/content/style-types";

export async function saveAllStylesAction(locale: Locale, styles: ContentStyles) {
  const session = await requireSession();
  await saveAllStyles(locale, styles, session.sub);
  revalidatePath(`/${locale}`);
  revalidatePath(`/${locale}/about`);
  revalidatePath(`/${locale}/services`);
  revalidatePath(`/${locale}/contact`);
  revalidatePath("/");
  return { ok: true } as const;
}
