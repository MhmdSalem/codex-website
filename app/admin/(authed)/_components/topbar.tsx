"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import {
  LogOut,
  User as UserIcon,
  Bell,
  Search,
  Settings,
  ExternalLink,
  ChevronDown,
} from "lucide-react";
import Link from "next/link";
import { logoutAction } from "../actions";

type TopbarProps = {
  user: { name: string; email: string; role: "admin" | "super_admin" };
};

const PATH_LABELS: Record<string, string> = {
  admin: "لوحة التحكم",
  pages: "صفحات الموقع",
  home: "الصفحة الرئيسية",
  about: "من نحن",
  services: "الخدمات",
  contact: "تواصل معنا",
  global: "محتوى عام",
  navbar: "القائمة العلوية",
  footer: "الفوتر",
  meta: "SEO و Meta",
  styles: "الألوان والخطوط",
  media: "مكتبة الوسائط",
  messages: "الرسائل الواردة",
  users: "المستخدمون",
  content: "المحتوى",
  settings: "الإعدادات",
};

export function Topbar({ user }: TopbarProps) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const segments = pathname.split("/").filter(Boolean);
  const crumbs = segments.map((seg, i) => ({
    label: PATH_LABELS[seg] ?? seg,
    href: "/" + segments.slice(0, i + 1).join("/"),
    isLast: i === segments.length - 1,
  }));

  return (
    <header className="sticky top-0 z-30 h-16 bg-admin-bg/85 backdrop-blur-md border-b border-admin-border/60 px-4 sm:px-6 lg:px-8 flex items-center gap-4">
      {/* Mobile brand */}
      <div className="lg:hidden font-bold text-admin-text">Codex</div>

      {/* Breadcrumbs */}
      <nav
        aria-label="breadcrumb"
        className="hidden md:flex items-center gap-1.5 text-sm text-admin-muted min-w-0"
      >
        {crumbs.map((c) => (
          <span key={c.href} className="flex items-center gap-1.5 min-w-0">
            <span className="text-admin-subtle">/</span>
            {c.isLast ? (
              <span className="text-admin-text font-medium truncate">
                {c.label}
              </span>
            ) : (
              <Link
                href={c.href}
                className="hover:text-admin-text transition-colors truncate"
              >
                {c.label}
              </Link>
            )}
          </span>
        ))}
      </nav>

      <div className="flex-1" />

      {/* Search bar (placeholder) */}
      <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-admin-surface/60 border border-admin-border/60 text-admin-subtle text-sm w-56 cursor-not-allowed">
        <Search className="w-3.5 h-3.5" />
        <span className="text-xs">بحث... (قريباً)</span>
        <kbd className="ms-auto text-[9px] font-mono px-1.5 py-0.5 rounded bg-admin-surface-2 border border-admin-border/60">
          ⌘K
        </kbd>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        {/* View Site shortcut */}
        <a
          href="/"
          target="_blank"
          rel="noreferrer"
          className="hidden sm:inline-flex items-center gap-1.5 text-admin-muted hover:text-admin-accent transition-colors px-2 py-1.5 text-xs font-medium rounded-lg hover:bg-admin-surface-2/60"
          title="عرض الموقع في نافذة جديدة"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          <span className="hidden lg:inline">الموقع</span>
        </a>

        {/* Notifications */}
        <button
          type="button"
          className="relative w-9 h-9 grid place-items-center rounded-lg bg-admin-surface/60 border border-admin-border/60 text-admin-muted hover:text-admin-accent hover:border-admin-accent/30 transition-all"
          aria-label="الإشعارات"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-admin-accent" />
        </button>

        {/* User menu */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            className="flex items-center gap-2.5 px-2 py-1.5 rounded-lg bg-admin-surface/60 border border-admin-border/60 hover:border-admin-accent/30 transition-all"
          >
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-admin-accent to-admin-accent/60 grid place-items-center text-white text-xs font-bold shadow-sm">
              {(user.name || "?").trim().charAt(0).toUpperCase()}
            </div>
            <div className="hidden sm:block text-start min-w-0 max-w-[140px]">
              <div className="text-xs font-semibold text-admin-text leading-tight truncate">
                {user.name}
              </div>
              <div className="text-[10px] text-admin-subtle leading-tight">
                {user.role === "super_admin" ? "مدير عام" : "مدير"}
              </div>
            </div>
            <ChevronDown
              className={`w-3.5 h-3.5 text-admin-muted transition-transform ${menuOpen ? "rotate-180" : ""}`}
            />
          </button>

          {menuOpen && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setMenuOpen(false)}
              />
              <div className="absolute end-0 mt-2 w-60 rounded-xl bg-admin-surface border border-admin-border shadow-2xl z-50 overflow-hidden">
                <div className="p-3 border-b border-admin-border bg-admin-surface-2/40">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-admin-accent to-admin-accent/60 grid place-items-center text-white text-sm font-bold">
                      {(user.name || "?").trim().charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-semibold text-admin-text truncate">
                        {user.name}
                      </div>
                      <div className="text-[11px] text-admin-muted truncate" dir="ltr">
                        {user.email}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="p-1">
                  <Link
                    href="/admin/users"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-admin-muted hover:bg-admin-surface-2 hover:text-admin-text transition-colors"
                  >
                    <UserIcon className="w-4 h-4" />
                    <span>الملف الشخصي</span>
                  </Link>
                  <Link
                    href="/admin/styles"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-admin-muted hover:bg-admin-surface-2 hover:text-admin-text transition-colors"
                  >
                    <Settings className="w-4 h-4" />
                    <span>إعدادات التصميم</span>
                  </Link>
                  <Link
                    href="/admin/settings"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-admin-muted hover:bg-admin-surface-2 hover:text-admin-text transition-colors"
                  >
                    <Settings className="w-4 h-4" />
                    <span>إعدادات الموقع</span>
                  </Link>
                  <div className="my-1 mx-2 h-px bg-admin-border/60" />
                  <form action={logoutAction}>
                    <button
                      type="submit"
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-red-400 hover:bg-red-500/10 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>تسجيل الخروج</span>
                    </button>
                  </form>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
