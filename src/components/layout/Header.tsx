"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";

import { Arrow } from "@/components/ui/Arrow";
import { Button } from "@/components/ui/Button";
import { Logo } from "@/components/ui/Logo";
import { TabIcon } from "@/components/layout/TabIcon";
import { Link, usePathname } from "@/i18n/navigation";
import { routes } from "@/i18n/routes";
import type { ResolvedLink, ResolvedNavItem } from "@/lib/links";
import { cn } from "@/lib/utils";

interface HeaderProps {
  siteName: string;
  navigation: ResolvedNavItem[];
  cta: ResolvedLink;
}

/**
 * Site header.
 *
 * Three zones on a `1fr auto 1fr` grid: the mark on the outside edge, the
 * navigation dead-centre, the call to action and the menu on the other edge.
 * The outer columns are equal by construction, which is what centres the
 * navigation against the viewport rather than against whatever space the mark
 * and the buttons happen to leave over.
 *
 * Below `lg` the links move to a tab bar along the bottom of the screen.
 */
export function Header({ siteName, navigation, cta }: HeaderProps) {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const [isScrolled, setScrolled] = useState(false);

  useEffect(() => {
    // Two thresholds, not one: a single boundary sits under the pointer at rest
    // and flickers the backdrop on and off with sub-pixel scrolls.
    const read = () =>
      setScrolled((current) => (current ? window.scrollY > 8 : window.scrollY > 32));

    read();
    // Native scroll events, which Lenis emits too — it scrolls the document
    // rather than transforming a wrapper, so there is nothing extra to wire up.
    window.addEventListener("scroll", read, { passive: true });
    return () => window.removeEventListener("scroll", read);
  }, []);

  const isCurrent = (href: string) =>
    href === routes.home ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header
      data-site-chrome
      data-prologue-inert
      data-scrolled={isScrolled || undefined}
      className="fixed inset-x-0 top-0 z-[var(--z-header)] h-[var(--header-height)]"
    >
      {/*
        The blur sits on its own layer rather than on the header, because
        `backdrop-filter` makes an element a containing block for fixed
        descendants — and the menu below is `fixed inset-0`. Put the filter on
        the header and the menu would size itself to the header instead of the
        viewport.

        No border under it. Separation is the blur and the tint alone; a rule
        across the top of the page reads as a toolbar.
      */}
      <div
        aria-hidden
        className={cn(
          "absolute inset-0 -z-10 bg-background/60 backdrop-blur-lg",
          "transition-opacity duration-[var(--duration-base)] ease-out-expo",
          isScrolled ? "opacity-100" : "opacity-0",
        )}
      />

      <div className="grid h-full grid-cols-[1fr_auto] items-center gap-4 px-gutter lg:grid-cols-[1fr_auto_1fr] lg:gap-8">
        <Link href={routes.home} aria-label={siteName} className="inline-flex w-fit items-center">
          <Logo className="h-6 lg:h-7" />
        </Link>

        {/*
          Hidden below `lg` rather than collapsed. Seven labels need about 490px
          and there is no width between a phone and a laptop where they fit
          without either wrapping or crowding the mark — at those sizes the menu
          button is the navigation.
        */}
        <nav aria-label={t("primaryLabel")} className="hidden items-center gap-6 lg:flex">
          {navigation.map((item) => {
            const current = isCurrent(item.href);

            const label = (
              <>
                {item.label}
                {/* The one accent in the chrome: a dot marks where you are. Out
                    of the text flow so it can never shift the label. */}
                {current ? (
                  <span
                    aria-hidden
                    className="absolute -bottom-2.5 left-1/2 size-1 -translate-x-1/2 rounded-full bg-accent"
                  />
                ) : null}
              </>
            );

            const className = cn(
              "relative text-caption whitespace-nowrap",
              "transition-colors duration-[var(--duration-fast)]",
              current ? "text-foreground" : "text-muted hover:text-foreground",
            );

            return item.external ? (
              <a
                key={item.href}
                href={item.href}
                className={className}
                {...(item.newTab ? { target: "_blank", rel: "noreferrer noopener" } : {})}
              >
                {label}
              </a>
            ) : (
              <Link
                key={item.href}
                href={item.href}
                aria-current={current ? "page" : undefined}
                className={className}
              >
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center justify-end gap-3">
          {/* The call to action rides in the bar at every width; the tab bar
              below carries the destinations. */}
          <Button
            href={cta.href}
            external={cta.external}
            newTab={cta.newTab}
            variant="accent"
            size="sm"
            className="px-4 py-2 xs:px-5"
          >
            {cta.label}
            <Arrow className="size-3.5" />
          </Button>
        </div>
      </div>

      {/*
        The tab bar. Below `lg` the navigation is a fixed row of destinations
        along the bottom edge, one glyph and one short label each, with the
        current page lit in the accent — a thumb's reach, and never a list to
        open and close.
      */}
      <nav
        aria-label={t("primaryLabel")}
        className={cn(
          "fixed inset-x-0 bottom-0 z-[var(--z-header)] lg:hidden",
          "border-t border-border bg-background/85 backdrop-blur-xl",
          "pb-[env(safe-area-inset-bottom,0px)]",
        )}
      >
        <ul className="grid auto-cols-fr grid-flow-col">
          {navigation.map((item) => {
            const current = isCurrent(item.href);
            const className = cn(
              "flex flex-col items-center gap-1 px-1 py-2.5 text-[0.625rem] font-medium",
              "transition-colors duration-[var(--duration-fast)]",
              current ? "text-accent-text" : "text-muted",
            );
            const content = (
              <>
                <TabIcon
                  href={item.href}
                  className={cn("size-5", current && "drop-shadow-[0_0_8px_var(--color-signal)]")}
                />
                <span className="max-w-full truncate">{item.label}</span>
              </>
            );
            return (
              <li key={item.href} className="min-w-0">
                {item.external ? (
                  <a href={item.href} className={className}>
                    {content}
                  </a>
                ) : (
                  <Link
                    href={item.href}
                    aria-current={current ? "page" : undefined}
                    className={className}
                  >
                    {content}
                  </Link>
                )}
              </li>
            );
          })}
        </ul>
      </nav>
    </header>
  );
}
