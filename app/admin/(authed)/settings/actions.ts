"use server";

import { revalidatePath } from "next/cache";
import { requireSession } from "@/lib/auth/guard";
import { updateSiteSettings, type SiteSettings } from "@/lib/settings/service";

export async function updateSiteSettingsAction(
  updates: Partial<SiteSettings>,
) {
  const session = await requireSession();
  const next = await updateSiteSettings(updates, session.sub);

  revalidatePath("/", "layout");
  revalidatePath("/ar", "layout");
  revalidatePath("/en", "layout");
  revalidatePath("/admin/settings");

  return next;
}
