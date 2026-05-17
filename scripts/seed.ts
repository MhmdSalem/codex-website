/**
 * Seed script:
 *  - Connects to MongoDB using MONGODB_URI from .env.local
 *  - Inserts (or upserts) the AR / EN dictionaries into the Content collection
 *  - Creates an initial super admin from SEED_ADMIN_EMAIL / SEED_ADMIN_PASSWORD
 *
 * Usage:  npm run seed
 */
import "dotenv/config";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { ar } from "../lib/i18n/dictionaries/ar";
import { en } from "../lib/i18n/dictionaries/en";

const MONGODB_URI = process.env.MONGODB_URI;
const DB_NAME = process.env.MONGODB_DB || "codex_website";
const ADMIN_EMAIL = process.env.SEED_ADMIN_EMAIL || "admin@codex.local";
const ADMIN_PASSWORD = process.env.SEED_ADMIN_PASSWORD || "Codex@1234";
const ADMIN_NAME = process.env.SEED_ADMIN_NAME || "Codex Admin";

if (!MONGODB_URI) {
  console.error("MONGODB_URI is not set. Add it to .env.local first.");
  process.exit(1);
}

async function main() {
  await mongoose.connect(MONGODB_URI as string, { dbName: DB_NAME });
  console.log("✓ connected to MongoDB:", DB_NAME);

  // Define minimal schemas inline so this script is self-contained.
  const userSchema = new mongoose.Schema(
    {
      email: { type: String, required: true, unique: true, lowercase: true },
      name: String,
      passwordHash: String,
      role: { type: String, enum: ["admin", "super_admin"], default: "admin" },
      lastLoginAt: { type: Date, default: null },
    },
    { timestamps: true },
  );
  const contentSchema = new mongoose.Schema(
    {
      locale: { type: String, enum: ["ar", "en"], required: true, unique: true },
      data: { type: mongoose.Schema.Types.Mixed, required: true },
      updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    },
    { timestamps: true, minimize: false },
  );
  const User = mongoose.models.User || mongoose.model("User", userSchema);
  const Content = mongoose.models.Content || mongoose.model("Content", contentSchema);

  // ── seed content ──────────────────────────────────────────────────────
  await Content.findOneAndUpdate(
    { locale: "ar" },
    { $setOnInsert: { data: ar } },
    { upsert: true, new: true },
  );
  await Content.findOneAndUpdate(
    { locale: "en" },
    { $setOnInsert: { data: en } },
    { upsert: true, new: true },
  );
  console.log("✓ content seeded (ar, en) — existing docs preserved");

  // ── seed super admin ──────────────────────────────────────────────────
  const existing = await User.findOne({ email: ADMIN_EMAIL.toLowerCase() });
  if (existing) {
    console.log("✓ admin already exists:", ADMIN_EMAIL);
  } else {
    const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 10);
    await User.create({
      email: ADMIN_EMAIL.toLowerCase(),
      name: ADMIN_NAME,
      passwordHash,
      role: "super_admin",
    });
    console.log("✓ super admin created:");
    console.log("   email:    ", ADMIN_EMAIL);
    console.log("   password: ", ADMIN_PASSWORD);
    console.log("   ⚠ change this password after first login.");
  }

  await mongoose.disconnect();
  console.log("done.");
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
