import { connectToDatabase } from "@/lib/db/mongoose";
import { SettingsModel, type SettingsDoc } from "@/lib/db/models/settings";

export type SiteSettings = {
  maintenanceMode: boolean;
  maintenanceMessage: {
    ar: string;
    en: string;
  };
};

const DEFAULTS: SiteSettings = {
  maintenanceMode: false,
  maintenanceMessage: {
    ar: "نعمل على تحسينات الموقع، يرجى العودة قريباً.",
    en: "We're polishing things up. We'll be back shortly.",
  },
};

function normalize(doc: SettingsDoc | null | undefined): SiteSettings {
  if (!doc) return DEFAULTS;
  return {
    maintenanceMode: !!doc.maintenanceMode,
    maintenanceMessage: {
      ar: doc.maintenanceMessage?.ar?.trim() || DEFAULTS.maintenanceMessage.ar,
      en: doc.maintenanceMessage?.en?.trim() || DEFAULTS.maintenanceMessage.en,
    },
  };
}

/**
 * Fetches the site settings. Returns sane defaults if the DB is unreachable
 * or the document doesn't exist yet — never throws.
 */
export async function getSiteSettings(): Promise<SiteSettings> {
  try {
    await connectToDatabase();
    const doc = await SettingsModel.findOne({ key: "site" }).lean();
    return normalize(doc as SettingsDoc | null);
  } catch (err) {
    console.error("[settings] failed to load, returning defaults:", err);
    return DEFAULTS;
  }
}

/**
 * Lightweight maintenance-only check. Equivalent to getSiteSettings().maintenanceMode
 * but kept separate so future call-sites can be optimised independently.
 */
export async function isMaintenanceMode(): Promise<boolean> {
  try {
    await connectToDatabase();
    const doc = await SettingsModel.findOne(
      { key: "site" },
      { maintenanceMode: 1 },
    ).lean();
    return !!doc?.maintenanceMode;
  } catch {
    return false;
  }
}

export async function updateSiteSettings(
  updates: Partial<SiteSettings>,
  updatedBy?: string,
): Promise<SiteSettings> {
  await connectToDatabase();
  const set: Record<string, unknown> = { updatedBy: updatedBy ?? null };
  if (updates.maintenanceMode !== undefined) {
    set.maintenanceMode = !!updates.maintenanceMode;
  }
  if (updates.maintenanceMessage) {
    if (updates.maintenanceMessage.ar !== undefined) {
      set["maintenanceMessage.ar"] = updates.maintenanceMessage.ar;
    }
    if (updates.maintenanceMessage.en !== undefined) {
      set["maintenanceMessage.en"] = updates.maintenanceMessage.en;
    }
  }
  const doc = await SettingsModel.findOneAndUpdate(
    { key: "site" },
    { $set: set, $setOnInsert: { key: "site" } },
    { upsert: true, new: true },
  ).lean();
  return normalize(doc as SettingsDoc | null);
}
