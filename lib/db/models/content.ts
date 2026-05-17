import mongoose, { Schema, type Model } from "mongoose";
import type { Dictionary } from "@/lib/i18n/get-dictionary";
import type { Locale } from "@/lib/i18n/config";

export type ContentDoc = {
  _id: mongoose.Types.ObjectId;
  locale: Locale;
  data: Dictionary;
  updatedBy?: mongoose.Types.ObjectId | null;
  createdAt: Date;
  updatedAt: Date;
};

const contentSchema = new Schema(
  {
    locale: {
      type: String,
      enum: ["ar", "en"],
      required: true,
      unique: true,
      index: true,
    },
    data: { type: Schema.Types.Mixed, required: true },
    updatedBy: { type: Schema.Types.ObjectId, ref: "User", default: null },
  },
  { timestamps: true, minimize: false },
);

export const ContentModel: Model<ContentDoc> =
  (mongoose.models.Content as Model<ContentDoc>) ||
  mongoose.model<ContentDoc>("Content", contentSchema);
