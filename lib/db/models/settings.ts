import mongoose, { Schema, type Model } from "mongoose";

/**
 * Site-wide settings. Stored as a single document with a fixed `key` so
 * upserts always target the same row. Future global toggles can be added
 * here without creating new collections.
 */
export type SettingsDoc = {
  _id: mongoose.Types.ObjectId;
  key: "site";
  maintenanceMode: boolean;
  maintenanceMessage?: {
    ar?: string;
    en?: string;
  };
  updatedBy?: mongoose.Types.ObjectId | null;
  createdAt: Date;
  updatedAt: Date;
};

const settingsSchema = new Schema(
  {
    key: { type: String, default: "site", unique: true, index: true },
    maintenanceMode: { type: Boolean, default: false },
    maintenanceMessage: {
      ar: { type: String, default: "" },
      en: { type: String, default: "" },
    },
    updatedBy: { type: Schema.Types.ObjectId, ref: "User", default: null },
  },
  { timestamps: true, minimize: false },
);

export const SettingsModel: Model<SettingsDoc> =
  (mongoose.models.Settings as Model<SettingsDoc>) ||
  mongoose.model<SettingsDoc>("Settings", settingsSchema);
