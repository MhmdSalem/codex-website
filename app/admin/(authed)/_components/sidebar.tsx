"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Image as ImageIcon,
  MessagesSquare,
  Users,
  Home,
  Info,
  Briefcase,
  Mail,
  Navigation,
  Footprints,
  Search,
  Palette,
  Globe,
} from "lucide-react";
import clsx from "clsx";

type NavItem = {
  href: string;
  label: string;
  icon: React.ElementType;
  superAdminOnly?: boolean;
};

type NavGroup = {
  label?: string;
  items: NavItem[];
};

const groups: NavGroup[] = [
  {
    items: [{ href: "/admin", label: "نظرة عامة", icon: LayoutDashboard }],
  },
  {
    label: "صفحات الموقع",
    items: [
      { href: "/admin/pages/home", label: "الصفحة الرئيسية", icon: Home },
      { href: "/admin/pages/about", label: "من نحن", icon: Info },
      { href: "/admin/pages/services", label: "الخدمات", icon: Briefcase },
      { href: "/admin/pages/contact", label: "تواصل معنا", icon: Mail },
    ],
  },
  {
    label: "محتوى عام",
    items: [
      { href: "/admin/global/navbar", label: "القائمة العلوية", icon: Navigation },
      { href: "/admin/global/footer", label: "الفوتر", icon: Footprints },
      { href: "/admin/global/meta", label: "SEO و Meta", icon: Search },
    ],
  },
  {
    label: "التصميم",
    items: [{ href: "/admin/styles", label: "الألوان والخطوط", icon: Palette }],
  },
  {
    label: "الإدارة",
    items: [
      { href: "/admin/media", label: "مكتبة الوسائط", icon: ImageIcon },
      { href: "/admin/messages", label: "الرسائل الواردة", icon: MessagesSquare },
      { href: "/admin/users", label: "المستخدمون", icon: Users, superAdminOnly: true },
    ],
  },
];

export function Sidebar({ role }: { role: "admin" | "super_admin" }) {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex fixed inset-y-0 right-0 w-64 bg-admin-surface border-l border-admin-border flex-col">
      <div className="p-4 border-b border-admin-border">
        <Link href="/admin" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-admin-accent to-orange-600 grid place-items-center shrink-0 shadow-lg">
            <span className="text-base font-bold text-white">C</span>
          </div>
          <div className="min-w-0">
            <div className="font-bold text-admin-text truncate">Codex</div>
            <div className="text-[10px] text-admin-muted">لوحة التحكم</div>
          </div>
        </Link>
      </div>

      <nav className="flex-1 p-2 space-y-4 overflow-y-auto">
        {groups.map((group, idx) => {
          const visible = group.items.filter(
            (it) => !it.superAdminOnly || role === "super_admin",
          );
          if (visible.length === 0) return null;
          return (
            <div key={idx}>
              {group.label && (
                <div className="px-3 mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-admin-subtle">
                  {group.label}
                </div>
              )}
              <div className="space-y-0.5">
                {visible.map((item) => {
                  const Icon = item.icon;
                  const active =
                    pathname === item.href ||
                    (item.href !== "/admin" && pathname.startsWith(item.href));
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={clsx(
                        "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all",
                        active
                          ? "bg-admin-accent text-white shadow-sm"
                          : "text-admin-muted hover:bg-admin-surface-2 hover:text-admin-text",
                      )}
                    >
                      <Icon className="w-4 h-4 shrink-0" />
                      <span className="truncate">{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          );
        })}
      </nav>

      <div className="p-2 border-t border-admin-border">
        <a
          href="/"
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-admin-muted hover:bg-admin-surface-2 hover:text-admin-text transition-colors"
        >
          <Globe className="w-4 h-4" />
          <span>عرض الموقع</span>
        </a>
      </div>
    </aside>
  );
}
