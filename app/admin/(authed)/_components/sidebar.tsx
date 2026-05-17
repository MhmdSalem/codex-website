"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  Image as ImageIcon,
  MessagesSquare,
  Users,
  ExternalLink,
} from "lucide-react";
import clsx from "clsx";

type NavItem = {
  href: string;
  label: string;
  icon: React.ElementType;
  superAdminOnly?: boolean;
};

const items: NavItem[] = [
  { href: "/admin", label: "نظرة عامة", icon: LayoutDashboard },
  { href: "/admin/content", label: "إدارة المحتوى", icon: FileText },
  { href: "/admin/media", label: "مكتبة الوسائط", icon: ImageIcon },
  { href: "/admin/messages", label: "الرسائل الواردة", icon: MessagesSquare },
  { href: "/admin/users", label: "المستخدمون", icon: Users, superAdminOnly: true },
];

export function Sidebar({ role }: { role: "admin" | "super_admin" }) {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex fixed inset-y-0 right-0 w-64 bg-admin-surface border-l border-admin-border flex-col">
      <div className="p-6 border-b border-admin-border">
        <Link href="/admin" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-admin-accent-soft grid place-items-center">
            <span className="text-lg font-bold text-admin-accent">C</span>
          </div>
          <div>
            <div className="font-bold text-admin-text">Codex</div>
            <div className="text-xs text-admin-muted">لوحة التحكم</div>
          </div>
        </Link>
      </div>
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {items
          .filter((it) => !it.superAdminOnly || role === "super_admin")
          .map((item) => {
            const Icon = item.icon;
            const active =
              pathname === item.href ||
              (item.href !== "/admin" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={clsx(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                  active
                    ? "bg-admin-accent-soft text-admin-accent"
                    : "text-admin-muted hover:bg-admin-surface-2 hover:text-admin-text",
                )}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.label}</span>
              </Link>
            );
          })}
      </nav>
      <div className="p-3 border-t border-admin-border">
        <a
          href="/"
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-admin-muted hover:bg-admin-surface-2 hover:text-admin-text transition-colors"
        >
          <ExternalLink className="w-4 h-4" />
          <span>عرض الموقع</span>
        </a>
      </div>
    </aside>
  );
}
