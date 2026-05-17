"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Menu, X, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/ui/logo";
import { LanguageSwitcher } from "@/components/ui/language-switcher";
import { cn } from "@/lib/utils";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/get-dictionary";

type NavbarProps = {
  locale: Locale;
  dict: Dictionary;
};

export function Navbar({ locale, dict }: NavbarProps) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const navItems = [
    { href: `/${locale}`, label: dict.nav.home },
    { href: `/${locale}/services`, label: dict.nav.services },
    { href: `/${locale}/about`, label: dict.nav.about },
    { href: `/${locale}/contact`, label: dict.nav.contact },
  ];

  const isActive = (href: string) => {
    if (href === `/${locale}`) return pathname === href;
    return pathname.startsWith(href);
  };

  return (
    <motion.header
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        "fixed top-0 inset-x-0 z-50 transition-all duration-500 ease-premium",
        scrolled ? "pt-3" : "pt-5",
      )}
    >
      <div className={cn(
        "mx-auto transition-all duration-500 ease-premium px-3",
        scrolled ? "max-w-5xl" : "max-w-7xl",
      )}>
        <div
          className={cn(
            "flex items-center justify-between gap-4 transition-all duration-500 ease-premium",
            scrolled
              ? "h-14 px-3 sm:px-4 rounded-full bg-background/85 backdrop-blur-2xl border border-border shadow-premium"
              : "h-16 px-4 sm:px-5 rounded-full bg-background-surface/40 backdrop-blur-xl border border-border/50",
          )}
        >
          <Logo locale={locale} />

          <nav className="hidden md:flex items-center gap-0.5">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "relative px-4 py-2 text-sm font-medium rounded-full transition-colors",
                  isActive(item.href)
                    ? "text-gold"
                    : "text-foreground-muted hover:text-foreground",
                )}
              >
                {isActive(item.href) && (
                  <motion.span
                    layoutId="active-pill"
                    className="absolute inset-0 rounded-full bg-gold/10 border border-gold/20"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <span className="relative z-10">{item.label}</span>
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <LanguageSwitcher currentLocale={locale} className="hidden sm:inline-flex" />
            <Button
              href={`/${locale}/contact`}
              size="sm"
              className="hidden md:inline-flex btn-shine"
            >
              {dict.nav.cta}
              <ArrowUpRight
                className={`w-3.5 h-3.5 ${locale === "ar" ? "-scale-x-100" : ""}`}
              />
            </Button>
            <button
              type="button"
              onClick={() => setMobileOpen((v) => !v)}
              className="md:hidden inline-flex items-center justify-center w-10 h-10 rounded-full border border-border text-foreground-muted hover:text-foreground hover:border-gold/40 transition-colors"
              aria-label="Menu"
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {mobileOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden mt-2 mx-3"
        >
          <div className="rounded-3xl bg-background/95 backdrop-blur-2xl border border-border shadow-premium p-2">
            <div className="flex flex-col">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "px-4 py-3 text-base font-medium rounded-2xl transition-colors",
                    isActive(item.href)
                      ? "text-gold bg-gold/10"
                      : "text-foreground-muted hover:text-foreground hover:bg-white/5",
                  )}
                >
                  {item.label}
                </Link>
              ))}
              <div className="mt-2 flex items-center justify-between gap-2 p-2 border-t border-border">
                <LanguageSwitcher currentLocale={locale} />
                <Button href={`/${locale}/contact`} size="sm" className="flex-1 ms-2">
                  {dict.nav.cta}
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </motion.header>
  );
}
