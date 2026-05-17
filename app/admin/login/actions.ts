"use server";

import { redirect } from "next/navigation";
import { connectToDatabase } from "@/lib/db/mongoose";
import { UserModel } from "@/lib/db/models/user";
import { verifyPassword } from "@/lib/auth/password";
import { createSessionToken, setSessionCookie } from "@/lib/auth/session";

export type LoginState = { error?: string };

export async function loginAction(
  _prev: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const redirectTo = String(formData.get("from") ?? "/admin");

  if (!email || !password) {
    return { error: "البريد الإلكتروني وكلمة المرور مطلوبان." };
  }

  await connectToDatabase();
  const user = await UserModel.findOne({ email });

  if (!user) {
    return { error: "بيانات الدخول غير صحيحة." };
  }
  const ok = await verifyPassword(password, user.passwordHash);
  if (!ok) {
    return { error: "بيانات الدخول غير صحيحة." };
  }

  const token = await createSessionToken({
    sub: user._id.toString(),
    email: user.email,
    role: user.role,
    name: user.name,
  });
  await setSessionCookie(token);

  user.lastLoginAt = new Date();
  await user.save();

  redirect(redirectTo.startsWith("/admin") ? redirectTo : "/admin");
}
