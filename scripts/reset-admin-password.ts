/**
 * Reset password for an existing admin by email.
 * Uses SEED_ADMIN_EMAIL and SEED_ADMIN_PASSWORD from .env.local
 *
 * Usage: npm run reset-admin-password
 */
import { config } from "dotenv";
import { resolve } from "path";
import mongoose from "mongoose";
import { hashPassword } from "../lib/auth/password";
import { UserModel } from "../lib/db/models/user";

config({ path: resolve(process.cwd(), ".env.local") });

const ADMIN_EMAIL = process.env.SEED_ADMIN_EMAIL?.trim().toLowerCase();
const ADMIN_PASSWORD = process.env.SEED_ADMIN_PASSWORD;

async function main() {
  if (!process.env.MONGODB_URI) {
    console.error("MONGODB_URI is not set in .env.local");
    process.exit(1);
  }
  if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
    console.error("Set SEED_ADMIN_EMAIL and SEED_ADMIN_PASSWORD in .env.local");
    process.exit(1);
  }

  await mongoose.connect(process.env.MONGODB_URI, {
    dbName: process.env.MONGODB_DB || "codex_website",
  });

  const user = await UserModel.findOne({ email: ADMIN_EMAIL });
  if (!user) {
    console.error("User not found:", ADMIN_EMAIL);
    process.exit(1);
  }

  const passwordHash = await hashPassword(ADMIN_PASSWORD);
  await UserModel.updateOne({ _id: user._id }, { $set: { passwordHash } });

  console.log("✓ password updated for", ADMIN_EMAIL);
  await mongoose.disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
