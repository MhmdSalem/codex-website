import { redirect } from "next/navigation";
import { getSessionFromCookies } from "@/lib/auth/session";
import { connectToDatabase } from "@/lib/db/mongoose";
import { UserModel } from "@/lib/db/models/user";
import { CreateUserForm } from "./create-user-form";
import { UsersTable } from "./users-table";

export const dynamic = "force-dynamic";

export default async function UsersPage() {
  const session = await getSessionFromCookies();
  if (!session) redirect("/admin/login");
  if (session.role !== "super_admin") redirect("/admin");

  await connectToDatabase();
  const docs = await UserModel.find().sort({ createdAt: -1 }).lean();
  const users = docs.map((u) => ({
    id: String(u._id),
    name: u.name,
    email: u.email,
    role: u.role as "admin" | "super_admin",
    lastLoginAt: u.lastLoginAt ? (u.lastLoginAt as Date).toISOString() : null,
    createdAt: (u.createdAt as Date).toISOString(),
  }));

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-admin-text">
          المستخدمون
        </h1>
        <p className="text-admin-muted mt-1 text-sm">
          إدارة حسابات الإدارة. هذه الصفحة متاحة للمدير العام فقط.
        </p>
      </div>

      <div className="admin-card p-6">
        <h2 className="text-lg font-bold text-admin-text mb-4">إضافة مستخدم</h2>
        <CreateUserForm />
      </div>

      <div className="admin-card overflow-hidden">
        <UsersTable users={users} currentUserId={session.sub} />
      </div>
    </div>
  );
}
