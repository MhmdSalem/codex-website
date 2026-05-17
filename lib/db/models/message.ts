import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

const messageSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    phone: { type: String, default: "", trim: true },
    company: { type: String, default: "", trim: true },
    service: { type: String, default: "", trim: true },
    message: { type: String, required: true },
    locale: { type: String, enum: ["ar", "en"], default: "ar" },
    read: { type: Boolean, default: false, index: true },
    archived: { type: Boolean, default: false },
  },
  { timestamps: true },
);

export type MessageDoc = InferSchemaType<typeof messageSchema> & { _id: mongoose.Types.ObjectId };

export const MessageModel: Model<MessageDoc> =
  (mongoose.models.Message as Model<MessageDoc>) ||
  mongoose.model<MessageDoc>("Message", messageSchema);
