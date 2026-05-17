"use server";

import { revalidatePath } from "next/cache";
import { getSessionFromCookies } from "@/lib/auth/session";
import { connectToDatabase } from "@/lib/db/mongoose";
import { MessageModel } from "@/lib/db/models/message";

async function ensureSession() {
  const s = await getSessionFromCookies();
  if (!s) throw new Error("UNAUTHORIZED");
}

export async function toggleReadAction(formData: FormData) {
  await ensureSession();
  const id = String(formData.get("id") ?? "");
  const read = formData.get("read") === "1";
  if (!id) return;
  await connectToDatabase();
  await MessageModel.updateOne({ _id: id }, { $set: { read } });
  revalidatePath("/admin/messages");
  revalidatePath("/admin");
}

export async function archiveAction(formData: FormData) {
  await ensureSession();
  const id = String(formData.get("id") ?? "");
  if (!id) return;
  await connectToDatabase();
  await MessageModel.updateOne({ _id: id }, { $set: { archived: true } });
  revalidatePath("/admin/messages");
  revalidatePath("/admin");
}

export async function deleteMessageAction(formData: FormData) {
  await ensureSession();
  const id = String(formData.get("id") ?? "");
  if (!id) return;
  await connectToDatabase();
  await MessageModel.deleteOne({ _id: id });
  revalidatePath("/admin/messages");
  revalidatePath("/admin");
}
