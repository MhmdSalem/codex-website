"use client";

import { usePathname, useRouter } from "next/navigation";
import { Languages } from "lucide-react";
import { locales, type Locale } from "@/lib/i18n/config";
import { cn } from "@/lib/utils";

type LanguageSwitcherProps = {
  currentLocale: Locale;
  className?: string;
};

export function LanguageSwitcher({
  currentLocale,
  className,
}: LanguageSwitcherProps) {
  const pathname = usePathname();
  const router = useRouter();

  const switchTo = (locale: Locale) => {
    if (locale === currentLocale) return;
    const segments = pathname.split("/").filter(Boolean);
    if (segments.length > 0 && (locales as readonly string[]).includes(segments[0])) {
      segments[0] = locale;
    } else {
      segments.unshift(locale);
    }
    const newPath = "/" + segments.join("/");
    document.cookie = `NEXT_LOCALE=${locale}; path=/; max-age=${60 * 60 * 24 * 365}`;
    router.push(newPath);
    router.refresh();
  };

  const next: Locale = currentLocale === "ar" ? "en" : "ar";
  const label = next === "ar" ? "العربية" : "EN";

  return (
    <button
      type="button"
      onClick={() => switchTo(next)}
      className={cn(
        "inline-flex items-center gap-2 h-9 px-3 rounded-full text-sm font-medium",
        "text-foreground-muted hover:text-foreground",
        "border border-border hover:border-gold/40",
        "bg-background-surface/50 hover:bg-background-elevated",
        "transition-all duration-200",
        className,
      )}
      aria-label={`Switch to ${next === "ar" ? "Arabic" : "English"}`}
    >
      <Languages className="w-4 h-4" aria-hidden="true" />
      <span>{label}</span>
    </button>
  );
}
