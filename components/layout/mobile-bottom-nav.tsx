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

export function MobileBottomNav({ locale, dict }: Props) {
  const pathname = usePathname();

  const items = [
    {
      href: `/${locale}`,
      label: dict.nav.home,
      icon: Home,
      match: (p: string) => p === `/${locale}` || p === `/${locale}/`,
    },
    {
      href: `/${locale}/services`,
      label: dict.nav.services,
      icon: Briefcase,
      match: (p: string) => p.startsWith(`/${locale}/services`),
    },
    {
      href: `/${locale}/about`,
      label: dict.nav.about,
      icon: Info,
      match: (p: string) => p.startsWith(`/${locale}/about`),
    },
  ];

  const isCtaActive = pathname.startsWith(`/${locale}/contact`);

  return (
    <>
      {/* Spacer at the bottom of pages so content isn't hidden under the bar */}
      <div aria-hidden="true" className="md:hidden h-24" />

      <motion.nav
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
        aria-label={locale === "ar" ? "القائمة السفلية" : "Bottom navigation"}
        style={{
          paddingBottom: "calc(0.75rem + env(safe-area-inset-bottom))",
          bottom: "calc(0.75rem)",
        }}
        className={cn(
          "md:hidden fixed inset-x-3 z-40",
          "rounded-3xl border border-border/60 backdrop-blur-2xl bg-background/85 shadow-premium",
          "px-2 pt-2",
        )}
      >
        <div className="grid grid-cols-5 items-end gap-1">
          {/* First two items */}
          {items.slice(0, 2).map((item) => (
            <NavItem key={item.href} item={item} active={item.match(pathname)} />
          ))}

          {/* Centered CTA button */}
          <Link
            href={`/${locale}/contact`}
            aria-label={dict.nav.cta}
            className={cn(
              "relative -mt-8 mx-auto flex flex-col items-center gap-1.5",
              "group",
            )}
          >
            <div
              className={cn(
                "relative w-14 h-14 rounded-full grid place-items-center transition-all duration-500",
                "bg-gradient-to-br from-gold via-gold-300 to-gold-500 shadow-gold-glow",
                "group-active:scale-95",
                isCtaActive && "ring-2 ring-gold/40 ring-offset-2 ring-offset-background",
              )}
            >
              <Sparkles className="w-6 h-6 text-background" strokeWidth={2.5} />
              {/* Subtle pulse glow */}
              <span
                aria-hidden="true"
                className="absolute inset-0 rounded-full bg-gold/40 blur-xl animate-pulse-gold pointer-events-none"
              />
            </div>
            <span className="text-[10px] font-medium text-gold whitespace-nowrap">
              {dict.nav.cta}
            </span>
          </Link>

          {/* Last item */}
          {items.slice(2, 3).map((item) => (
            <NavItem key={item.href} item={item} active={item.match(pathname)} />
          ))}

          {/* Contact (mirror of CTA but a normal item) */}
          <NavItem
            item={{
              href: `/${locale}/contact`,
              label: dict.nav.contact,
              icon: MessageCircle,
              match: () => false,
            }}
            active={false}
          />
        </div>
      </motion.nav>
    </>
  );
}

type Item = {
  href: string;
  label: string;
  icon: React.ElementType;
  match: (p: string) => boolean;
};

function NavItem({ item, active }: { item: Item; active: boolean }) {
  const Icon = item.icon;
  return (
    <Link
      href={item.href}
      className={cn(
        "flex flex-col items-center justify-center gap-1 py-2 rounded-2xl transition-colors",
        active
          ? "text-gold"
          : "text-foreground-muted hover:text-foreground",
      )}
      aria-label={item.label}
    >
      <span
        className={cn(
          "grid place-items-center w-9 h-9 rounded-xl transition-all",
          active && "bg-gold/10",
        )}
      >
        <Icon className="w-[18px] h-[18px]" />
      </span>
      <span className="text-[10px] font-medium leading-none truncate max-w-[60px]">
        {item.label}
      </span>
    </Link>
  );
}
