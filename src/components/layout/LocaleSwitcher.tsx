"use client";

import { useTransition } from "react";
import { useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { locales, localeLabel, localeShortLabel, type Locale } from "@/i18n/routing";
import { cn } from "@/lib/utils";

/**
 * Language switcher.
 *
 * Swaps the locale while keeping the current path and dynamic segments, so a
 * visitor reading a project in English lands on the same project in Arabic.
 */
export function LocaleSwitcher({ current }: { current: Locale }) {
  const t = useTranslations("nav");
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  function switchTo(locale: Locale) {
    if (locale === current) return;
    startTransition(() => {
      // `pathname` already contains the resolved dynamic segments, so a visitor
      // reading a project in English lands on the same project in Arabic.
      router.replace(pathname, { locale });
    });
  }

  return (
    <div
      className="flex items-center gap-1"
      role="group"
      aria-label={t("languageLabel")}
      data-pending={isPending || undefined}
    >
      {locales.map((locale) => {
        const isActive = locale === current;
        return (
          <button
            key={locale}
            type="button"
            lang={locale}
            onClick={() => switchTo(locale)}
            aria-current={isActive ? "true" : undefined}
            aria-label={isActive ? undefined : t("switchTo", { language: localeLabel[locale] })}
            className={cn(
              "rounded-full px-2 py-1 font-mono text-micro tracking-wider uppercase",
              "transition-colors duration-[var(--duration-fast)]",
              isActive ? "text-foreground" : "text-subtle hover:text-foreground",
            )}
          >
            {localeShortLabel[locale]}
          </button>
        );
      })}
    </div>
  );
}
