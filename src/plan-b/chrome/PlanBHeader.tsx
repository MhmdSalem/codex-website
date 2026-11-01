import Link from "next/link";
import { useTranslations } from "next-intl";

import { Arrow } from "@/components/ui/Arrow";
import { Button } from "@/components/ui/Button";
import { Logo } from "@/components/ui/Logo";
import { routes } from "@/i18n/routes";
import { locales, localeShortLabel, type Locale } from "@/i18n/routing";
import { cn } from "@/lib/utils";

/**
 * Plan B's chrome: the mark, the two languages, one call to action.
 *
 * No navigation, because there is nothing to navigate to — the concept is a
 * single scroll, and a menu offering seven destinations would contradict the
 * argument the page is making. The only way through it is forward.
 *
 * Every link is written out with its locale prefix by hand. This route lives
 * outside the `[locale]` tree, so the locale-aware `Link` has no segment to read.
 */
export function PlanBHeader({ locale }: { locale: Locale }) {
  const t = useTranslations("planB");

  return (
    <header className="fixed inset-x-0 top-0 z-[var(--z-header)]">
      {/*
        A veil rather than a filled bar. The opening frame is a black field with
        one ring in it; a solid header would cut a hard edge across the top of the
        composition, and this keeps the chrome legible without drawing a line.
      */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/85 via-black/45 to-transparent"
      />

      <div className="relative mx-auto flex h-header max-w-wide items-center justify-between px-gutter">
        <Link
          href={`/plan-b/${locale}`}
          aria-label={t("title")}
          className="inline-flex items-center rounded-xs focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-focus"
        >
          <Logo className="h-6 sm:h-7" />
        </Link>

        <div className="flex items-center gap-2 sm:gap-5">
          <div className="flex items-center gap-1">
            {locales.map((option) => (
              <Link
                key={option}
                href={`/plan-b/${option}`}
                lang={option}
                aria-current={option === locale ? "true" : undefined}
                className={cn(
                  "rounded-full px-2 py-1 font-mono text-micro tracking-wider uppercase",
                  "transition-colors duration-[var(--duration-fast)]",
                  option === locale ? "text-foreground" : "text-subtle hover:text-foreground",
                )}
              >
                {localeShortLabel[option]}
              </Link>
            ))}
          </div>

          <Button
            href={`/${locale}${routes.contact}`}
            external
            variant="accent"
            size="sm"
            // A two-word label in a pill has to stay on one line: wrapped, the
            // pill grows taller than the header's other elements and the whole
            // row loses its baseline.
            className="px-4 py-2 whitespace-nowrap sm:px-5"
          >
            {t("cta")}
            <Arrow className="size-3.5" />
          </Button>
        </div>
      </div>
    </header>
  );
}
