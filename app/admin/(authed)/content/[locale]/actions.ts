"use server";

import { revalidatePath } from "next/cache";
import { getSessionFromCookies } from "@/lib/auth/session";
import { isValidLocale, type Locale } from "@/lib/i18n/config";
import { saveContent } from "@/lib/content/service";

export type SaveContentResult = { ok: true } | { ok: false; error: string };

export async function saveContentAction(
  locale: string,
  payload: string,
): Promise<SaveContentResult> {
  const session = await getSessionFromCookies();
  if (!session) return { ok: false, error: "UNAUTHORIZED" };
  if (!isValidLocale(locale)) return { ok: false, error: "INVALID_LOCALE" };

  let data: unknown;
  try {
    data = JSON.parse(payload);
  } catch {
    return { ok: false, error: "INVALID_JSON" };
  }
  if (!data || typeof data !== "object" || Array.isArray(data)) {
    return { ok: false, error: "INVALID_DATA" };
  }

  await saveContent(locale as Locale, data as never, session.sub);

  // Revalidate every public route that depends on this content.
  revalidatePath(`/${locale}`);
  revalidatePath(`/${locale}/services`);
  revalidatePath(`/${locale}/about`);
  revalidatePath(`/${locale}/contact`);
  revalidatePath("/");

  return { ok: true };
}
