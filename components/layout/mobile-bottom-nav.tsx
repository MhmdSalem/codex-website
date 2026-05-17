"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Briefcase, Info, MessageCircle, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/get-dictionary";

type Props = {
  locale: Locale;
  dict: Dictionary;
};

type Item = {
  href: string;
  label: string;
  icon: React.ElementType;
  match: (p: string) => boolean;
  cta?: boolean;
};

export function MobileBottomNav({ locale, dict }: Props) {
  const pathname = usePathname();

  const items: Item[] = [
    {
      href: `/${locale}`,
      label: dict.nav.home,
      icon: Home,
      match: (p) => p === `/${locale}` || p === `/${locale}/`,
    },
    {
      href: `/${locale}/services`,
      label: dict.nav.services,
      icon: Briefcase,
      match: (p) => p.startsWith(`/${locale}/services`),
    },
    {
      href: `/${locale}/contact`,
      label: dict.nav.cta,
      icon: Sparkles,
      match: () => false,
      cta: true,
    },
    {
      href: `/${locale}/about`,
      label: dict.nav.about,
      icon: Info,
      match: (p) => p.startsWith(`/${locale}/about`),
    },
    {
      href: `/${locale}/contact`,
      label: dict.nav.contact,
      icon: MessageCircle,
      match: (p) => p.startsWith(`/${locale}/contact`),
    },
  ];

  return (
    <>
      {/* Spacer so content isn't hidden under the bar */}
      <div aria-hidden="true" className="md:hidden h-28" />

      <motion.nav
        initial={{ y: 60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
        aria-label={locale === "ar" ? "القائمة السفلية" : "Bottom navigation"}
        // Fixed height + bottom anchored just above iPhone home indicator
        // (no padding-bottom that depends on safe-area, so bar size stays constant)
        style={{
          bottom: "max(0.75rem, env(safe-area-inset-bottom, 0px))",
          height: "68px",
        }}
        className={cn(
          "md:hidden fixed inset-x-3 z-40 flex items-center",
          "rounded-full border border-white/10 backdrop-blur-2xl",
          "bg-background/40 shadow-[0_8px_32px_rgba(0,0,0,0.6)]",
          "px-1.5",
        )}
      >
        <div className="grid grid-cols-5 items-center w-full">
          {items.map((item) => (
            <NavItem
              key={item.label + item.href}
              item={item}
              active={item.match(pathname)}
            />
          ))}
        </div>
      </motion.nav>
    </>
  );
}

function NavItem({ item, active }: { item: Item; active: boolean }) {
  const Icon = item.icon;
  const isCta = item.cta;

  return (
    <Link
      href={item.href}
      aria-label={item.label}
      className="flex flex-col items-center gap-0.5 py-1 transition-colors"
    >
      <span
        className={cn(
          "relative grid place-items-center w-10 h-10 rounded-full transition-all duration-300",
          isCta
            ? "bg-gradient-to-br from-gold via-gold-300 to-gold-500 text-background shadow-[0_0_20px_rgba(217,119,87,0.45)]"
            : active
              ? "bg-white/10 text-gold"
              : "text-foreground-muted",
        )}
      >
        <Icon className="w-[18px] h-[18px]" strokeWidth={isCta ? 2.5 : 2} />
      </span>
      <span
        className={cn(
          "text-[9px] font-medium leading-none truncate max-w-[60px]",
          isCta ? "text-gold" : active ? "text-gold" : "text-foreground-muted",
        )}
      >
        {item.label}
      </span>
    </Link>
  );
}
