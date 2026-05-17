import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

const mediaSchema = new Schema(
  {
    filename: { type: String, required: true, unique: true },
    originalName: { type: String, required: true },
    mimeType: { type: String, required: true },
    size: { type: Number, required: true },
    url: { type: String, required: true },
    type: {
      type: String,
      enum: ["image", "video", "other"],
      required: true,
    },
    width: { type: Number, default: null },
    height: { type: Number, default: null },
    alt: { type: String, default: "" },
    uploadedBy: { type: Schema.Types.ObjectId, ref: "User", default: null },
  },
  { timestamps: true },
);

export type MediaDoc = InferSchemaType<typeof mediaSchema> & { _id: mongoose.Types.ObjectId };

export const MediaModel: Model<MediaDoc> =
  (mongoose.models.Media as Model<MediaDoc>) ||
  mongoose.model<MediaDoc>("Media", mediaSchema);
