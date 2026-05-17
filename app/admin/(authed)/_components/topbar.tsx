"use client";

import { LogOut, User as UserIcon } from "lucide-react";
import { logoutAction } from "../actions";

type TopbarProps = {
  user: { name: string; email: string; role: "admin" | "super_admin" };
};

export function Topbar({ user }: TopbarProps) {
  return (
    <header className="sticky top-0 z-30 h-16 bg-admin-bg/80 backdrop-blur border-b border-admin-border px-4 sm:px-6 lg:px-8 flex items-center justify-between">
      <div className="lg:hidden font-bold">Codex Admin</div>
      <div className="flex-1" />
      <div className="flex items-center gap-3">
        <div className="hidden sm:flex items-center gap-3 px-3 py-1.5 rounded-lg bg-admin-surface border border-admin-border">
          <div className="w-7 h-7 rounded-full bg-admin-accent-soft grid place-items-center">
            <UserIcon className="w-4 h-4 text-admin-accent" />
          </div>
          <div className="text-sm">
            <div className="font-medium text-admin-text leading-tight">{user.name}</div>
            <div className="text-xs text-admin-muted leading-tight">
              {user.role === "super_admin" ? "مدير عام" : "مدير"}
            </div>
          </div>
        </div>
        <form action={logoutAction}>
          <button type="submit" className="admin-btn-ghost" aria-label="تسجيل الخروج">
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">خروج</span>
          </button>
        </form>
      </div>
    </header>
  );
}
