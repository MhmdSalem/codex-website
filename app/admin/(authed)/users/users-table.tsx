"use client";

import { useState, useTransition } from "react";
import { Trash2, KeyRound, X } from "lucide-react";
import { changePasswordAction, deleteUserAction } from "./actions";

type Row = {
  id: string;
  name: string;
  email: string;
  role: "admin" | "super_admin";
  lastLoginAt: string | null;
  createdAt: string;
};

export function UsersTable({
  users,
  currentUserId,
}: {
  users: Row[];
  currentUserId: string;
}) {
  const [pwTarget, setPwTarget] = useState<Row | null>(null);
  const [, startTransition] = useTransition();

  function onDelete(u: Row) {
    if (u.id === currentUserId) {
      alert("مينفعش تحذف حسابك الحالي.");
      return;
    }
    if (!confirm(`هتحذف ${u.name}؟ مينفعش الرجوع.`)) return;
    startTransition(async () => {
      const fd = new FormData();
      fd.append("id", u.id);
      await deleteUserAction(fd);
    });
  }

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-admin-surface-2 text-admin-muted text-xs uppercase">
            <tr>
              <th className="text-right p-3">الاسم</th>
              <th className="text-right p-3">البريد</th>
              <th className="text-right p-3">الدور</th>
              <th className="text-right p-3">آخر دخول</th>
              <th className="text-right p-3">إجراءات</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-t border-admin-border">
                <td className="p-3 text-admin-text">
                  {u.name}{" "}
                  {u.id === currentUserId && (
                    <span className="text-[10px] uppercase px-1.5 py-0.5 rounded bg-admin-accent-soft text-admin-accent">
                      أنت
                    </span>
                  )}
                </td>
                <td className="p-3 text-admin-muted" dir="ltr">
                  {u.email}
                </td>
                <td className="p-3">
                  <span
                    className={`text-xs px-2 py-1 rounded-md ${
                      u.role === "super_admin"
                        ? "bg-admin-accent text-white"
                        : "bg-admin-surface-2 text-admin-muted border border-admin-border"
                    }`}
                  >
                    {u.role === "super_admin" ? "مدير عام" : "مدير"}
                  </span>
                </td>
                <td className="p-3 text-admin-subtle text-xs">
                  {u.lastLoginAt
                    ? new Date(u.lastLoginAt).toLocaleString("ar-EG")
                    : "—"}
                </td>
                <td className="p-3">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setPwTarget(u)}
                      className="admin-btn-ghost"
                      title="تغيير كلمة المرور"
                    >
                      <KeyRound className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onDelete(u)}
                      className="admin-btn-ghost text-red-400"
                      title="حذف"
                      disabled={u.id === currentUserId}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {pwTarget && (
        <PasswordModal user={pwTarget} onClose={() => setPwTarget(null)} />
      )}
    </>
  );
}

function PasswordModal({ user, onClose }: { user: Row; onClose: () => void }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    setSuccess(null);
    const fd = new FormData(e.currentTarget);
    fd.set("id", user.id);
    const res = await changePasswordAction({}, fd);
    if (res.error) setError(res.error);
    else if (res.success) {
      setSuccess(res.success);
      setTimeout(onClose, 1200);
    }
    setBusy(false);
  }

  return (
    <div
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm grid place-items-center p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="admin-card max-w-sm w-full p-5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-admin-text">
            تغيير كلمة مرور {user.name}
          </h3>
          <button type="button" onClick={onClose} className="admin-btn-ghost">
            <X className="w-4 h-4" />
          </button>
        </div>
        <form onSubmit={onSubmit} className="space-y-3">
          <input
            type="password"
            name="password"
            dir="ltr"
            required
            minLength={8}
            placeholder="كلمة مرور جديدة"
            className="admin-input"
          />
          {error && <p className="text-sm text-red-400">{error}</p>}
          {success && <p className="text-sm text-green-400">{success}</p>}
          <button type="submit" disabled={busy} className="admin-btn-primary w-full">
            {busy ? "جارٍ الحفظ..." : "تحديث"}
          </button>
        </form>
      </div>
    </div>
  );
}
