"use server";

import { revalidatePath } from "next/cache";
import { getSessionFromCookies } from "@/lib/auth/session";
import { connectToDatabase } from "@/lib/db/mongoose";
import { MediaModel } from "@/lib/db/models/media";
import { deleteFile } from "@/lib/media/storage";

export async function deleteMediaAction(formData: FormData) {
  const session = await getSessionFromCookies();
  if (!session) throw new Error("UNAUTHORIZED");

  const id = String(formData.get("id") ?? "");
  if (!id) throw new Error("NO_ID");

  await connectToDatabase();
  const doc = await MediaModel.findById(id);
  if (!doc) return;

  await deleteFile(doc.filename);
  await doc.deleteOne();

  revalidatePath("/admin/media");
}

export async function updateMediaAltAction(formData: FormData) {
  const session = await getSessionFromCookies();
  if (!session) throw new Error("UNAUTHORIZED");

  const id = String(formData.get("id") ?? "");
  const alt = String(formData.get("alt") ?? "").slice(0, 200);
  if (!id) return;

  await connectToDatabase();
  await MediaModel.updateOne({ _id: id }, { $set: { alt } });
  revalidatePath("/admin/media");
}
