"use server";

import { revalidatePath } from "next/cache";
import { getSessionFromCookies } from "@/lib/auth/session";
import { connectToDatabase } from "@/lib/db/mongoose";
import { UserModel } from "@/lib/db/models/user";
import { hashPassword } from "@/lib/auth/password";

export type UserActionState = { error?: string; success?: string };

function isEmail(s: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
}

export async function createUserAction(
  _prev: UserActionState,
  formData: FormData,
): Promise<UserActionState> {
  const session = await getSessionFromCookies();
  if (!session) return { error: "غير مصرح." };
  if (session.role !== "super_admin")
    return { error: "هذه العملية متاحة للمدير العام فقط." };

  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const role = String(formData.get("role") ?? "admin");

  if (!name || !email || !password)
    return { error: "كل الحقول مطلوبة." };
  if (!isEmail(email)) return { error: "البريد الإلكتروني غير صحيح." };
  if (password.length < 8)
    return { error: "كلمة المرور لازم تكون 8 حروف على الأقل." };
  if (!["admin", "super_admin"].includes(role))
    return { error: "الدور غير صحيح." };

  await connectToDatabase();
  const exists = await UserModel.findOne({ email });
  if (exists) return { error: "البريد الإلكتروني مُسجَّل بالفعل." };

  const passwordHash = await hashPassword(password);
  await UserModel.create({
    name,
    email,
    passwordHash,
    role: role as "admin" | "super_admin",
  });

  revalidatePath("/admin/users");
  return { success: "تم إنشاء المستخدم." };
}

export async function deleteUserAction(formData: FormData) {
  const session = await getSessionFromCookies();
  if (!session) throw new Error("UNAUTHORIZED");
  if (session.role !== "super_admin") throw new Error("FORBIDDEN");

  const id = String(formData.get("id") ?? "");
  if (id === session.sub) throw new Error("CANNOT_DELETE_SELF");

  await connectToDatabase();
  await UserModel.deleteOne({ _id: id });
  revalidatePath("/admin/users");
}

export async function changePasswordAction(
  _prev: UserActionState,
  formData: FormData,
): Promise<UserActionState> {
  const session = await getSessionFromCookies();
  if (!session) return { error: "غير مصرح." };

  const id = String(formData.get("id") ?? "");
  const password = String(formData.get("password") ?? "");

  if (!id || !password) return { error: "بيانات ناقصة." };
  if (password.length < 8) return { error: "كلمة المرور لازم تكون 8 حروف على الأقل." };

  // Only super_admin can change others' passwords; users can change their own.
  if (id !== session.sub && session.role !== "super_admin") {
    return { error: "غير مصرح." };
  }

  await connectToDatabase();
  const passwordHash = await hashPassword(password);
  await UserModel.updateOne({ _id: id }, { $set: { passwordHash } });
  revalidatePath("/admin/users");
  return { success: "تم تحديث كلمة المرور." };
}
