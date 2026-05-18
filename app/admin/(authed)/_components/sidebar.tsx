"use client";

import Link from "next/link";
import Image from "next/image";
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
  ChevronLeft,
} from "lucide-react";
import clsx from "clsx";

type NavItem = {
  href: string;
  label: string;
  icon: React.ElementType;
  superAdminOnly?: boolean;
  badge?: string;
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
      {
        href: "/admin/users",
        label: "المستخدمون",
        icon: Users,
        superAdminOnly: true,
      },
    ],
  },
];

export function Sidebar({ role }: { role: "admin" | "super_admin" }) {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex fixed inset-y-0 right-0 w-64 admin-sidebar flex-col">
      {/* Brand */}
      <div className="px-5 pt-5 pb-4 border-b border-admin-border/60">
        <Link href="/admin" className="flex items-center gap-3 group">
          <div className="relative shrink-0">
            <div className="absolute -inset-1 rounded-2xl bg-admin-accent/30 blur-md opacity-60 group-hover:opacity-100 transition-opacity" />
            <Image
              src="/codex-icon.png"
              alt="Codex"
              width={42}
              height={42}
              priority
              className="relative w-10 h-10 rounded-xl shadow-lg"
            />
          </div>
          <div className="min-w-0 leading-tight">
            <div className="font-bold text-admin-text text-base truncate flex items-center gap-1.5">
              Codex
              <span className="inline-block w-1 h-1 rounded-full bg-admin-accent animate-pulse" />
            </div>
            <div className="text-[10px] text-admin-subtle uppercase tracking-wider mt-0.5">
              لوحة التحكم
            </div>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto admin-scrollbar">
        {groups.map((group, idx) => {
          const visible = group.items.filter(
            (it) => !it.superAdminOnly || role === "super_admin",
          );
          if (visible.length === 0) return null;
          return (
            <div key={idx} className={idx === 0 ? "mb-3" : "mt-5 mb-3"}>
              {group.label && (
                <div className="px-3 mb-2 flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-admin-subtle">
                    {group.label}
                  </span>
                  <span className="flex-1 h-px bg-gradient-to-l from-admin-border/40 to-transparent" />
                </div>
              )}
              <div className="space-y-0.5">
                {visible.map((item) => {
                  const Icon = item.icon;
                  const active =
                    pathname === item.href ||
                    (item.href !== "/admin" &&
                      pathname.startsWith(item.href));
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={clsx(
                        "group relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all",
                        active
                          ? "bg-admin-accent-soft text-admin-text shadow-sm"
                          : "text-admin-muted hover:bg-admin-surface-2/60 hover:text-admin-text",
                      )}
                    >
                      {/* Active indicator (right side, RTL) */}
                      {active && (
                        <span className="absolute right-0 inset-y-2 w-1 rounded-l-full bg-admin-accent" />
                      )}

                      <span
                        className={clsx(
                          "grid place-items-center w-8 h-8 rounded-lg transition-colors shrink-0",
                          active
                            ? "bg-admin-accent text-white shadow-md shadow-admin-accent/30"
                            : "bg-admin-surface-2/40 text-admin-muted group-hover:bg-admin-accent-soft group-hover:text-admin-accent",
                        )}
                      >
                        <Icon className="w-4 h-4" />
                      </span>
                      <span className="truncate flex-1">{item.label}</span>
                      {item.badge && (
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-admin-accent text-white">
                          {item.badge}
                        </span>
                      )}
                      {active && (
                        <ChevronLeft className="w-3.5 h-3.5 text-admin-accent shrink-0" />
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-3 py-3 border-t border-admin-border/60 space-y-2">
        <a
          href="/"
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-admin-muted hover:bg-admin-surface-2/60 hover:text-admin-text transition-colors"
        >
          <span className="grid place-items-center w-8 h-8 rounded-lg bg-admin-surface-2/40">
            <Globe className="w-4 h-4" />
          </span>
          <span className="flex-1">عرض الموقع</span>
          <ChevronLeft className="w-3.5 h-3.5 opacity-50" />
        </a>

        <div className="px-3 py-2 text-center">
          <p className="text-[10px] text-admin-subtle">
            Codex Admin v1.0
          </p>
        </div>
      </div>
    </aside>
  );
}
