"use client";

import { motion } from "framer-motion";
import {
  ArrowUpRight,
  QrCode,
  CalendarCheck,
  FileText,
  Megaphone,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SectionLabel } from "@/components/ui/section-label";
import { Reveal } from "@/components/effects/reveal";
import { cn } from "@/lib/utils";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/get-dictionary";

type ServicesPreviewProps = {
  locale: Locale;
  dict: Dictionary;
};

export function ServicesPreview({ locale, dict }: ServicesPreviewProps) {
  const t = dict.servicesPreview;
  const items = t.items;

  const ICONS = [QrCode, CalendarCheck, FileText, Megaphone];
  const arrowFlip = locale === "ar" ? "-scale-x-100" : "";

  return (
    <section className="relative py-24 sm:py-36 overflow-hidden">
      <span className="section-number top-0 -right-10 sm:-right-20" aria-hidden="true">02</span>

      <div className="container-wide relative">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14">
          <div className="max-w-2xl">
            <SectionLabel>{t.sectionLabel}</SectionLabel>
            <Reveal>
              <h2 className="mt-4 font-display text-display-lg text-balance leading-[1.05]">
                <span className="text-foreground">{t.title.split(" ").slice(0, -2).join(" ")} </span>
                <span className="text-gradient-gold italic">
                  {t.title.split(" ").slice(-2).join(" ")}
                </span>
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mt-5 text-base sm:text-lg text-foreground-muted leading-relaxed max-w-xl">
                {t.subtitle}
              </p>
            </Reveal>
          </div>
          <Reveal delay={0.2}>
            <Button href={`/${locale}/services`} variant="outline" size="md">
              {t.viewAll}
              <ArrowUpRight className={`w-4 h-4 ${arrowFlip}`} aria-hidden="true" />
            </Button>
          </Reveal>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 auto-rows-fr">
          <BentoCard
            className="md:col-span-3 lg:col-span-4 md:row-span-2 min-h-[420px]"
            featured
            item={items[0]}
            icon={ICONS[0]}
            locale={locale}
            dict={dict}
            delay={0}
            isSoon={false}
          />
          <BentoCard
            className="md:col-span-3 lg:col-span-2"
            item={items[1]}
            icon={ICONS[1]}
            locale={locale}
            dict={dict}
            delay={0.1}
            isSoon={false}
          />
          <BentoCard
            className="md:col-span-3 lg:col-span-2"
            item={items[2]}
            icon={ICONS[2]}
            locale={locale}
            dict={dict}
            delay={0.2}
            isSoon={false}
          />
          <BentoCard
            className="md:col-span-3 lg:col-span-6"
            item={items[3]}
            icon={ICONS[3]}
            locale={locale}
            dict={dict}
            delay={0.3}
            isSoon
            wide
          />
        </div>
      </div>
    </section>
  );
}

function BentoCard({
  item,
  icon: Icon,
  locale,
  dict,
  delay,
  isSoon,
  featured,
  wide,
  className,
}: {
  item: Dictionary["servicesPreview"]["items"][number];
  icon: typeof QrCode;
  locale: Locale;
  dict: Dictionary;
  delay: number;
  isSoon: boolean;
  featured?: boolean;
  wide?: boolean;
  className?: string;
}) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        "group card-premium overflow-hidden cursor-pointer",
        featured && "bg-gradient-to-br from-background-surface via-background-elevated to-background-surface",
        wide && "min-h-[200px]",
        className,
      )}
    >
      {/* Hover glow */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
        <div className="absolute -top-32 -right-32 w-64 h-64 rounded-full bg-gold/20 blur-3xl" />
      </div>

      {/* Grid pattern for featured */}
      {featured && (
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-grid-pattern bg-[size:32px_32px] opacity-20 [mask-image:radial-gradient(ellipse_at_top_right,black_30%,transparent_70%)]"
        />
      )}

      <div className={cn(
        "relative h-full p-6 sm:p-8 flex flex-col",
        featured ? "justify-between" : "",
      )}>
        <div className="flex items-start justify-between mb-6">
          <div className={cn(
            "inline-grid place-items-center rounded-2xl border transition-all duration-500 group-hover:scale-110",
            featured
              ? "w-16 h-16 bg-gold/15 border-gold/30 text-gold"
              : "w-12 h-12 bg-gold/10 border-gold/20 text-gold",
          )}>
            <Icon className={featured ? "w-7 h-7" : "w-5 h-5"} aria-hidden="true" />
          </div>
          <div className="flex items-center gap-2">
            <span
              className={cn(
                "text-[10px] font-medium uppercase tracking-[0.2em] px-3 py-1 rounded-full",
                isSoon
                  ? "bg-foreground-muted/10 text-foreground-muted border border-border"
                  : "bg-gold/10 text-gold border border-gold/20",
              )}
            >
              {item.badge}
            </span>
            <ArrowUpRight className={cn(
              "w-5 h-5 text-foreground-muted group-hover:text-gold transition-all duration-300",
              "group-hover:translate-x-1 group-hover:-translate-y-1",
              locale === "ar" && "-scale-x-100 group-hover:-translate-x-1",
            )} />
          </div>
        </div>

        <div className={cn("flex-1 flex flex-col", wide ? "sm:flex-row sm:items-end sm:justify-between gap-6" : "")}>
          <div className={cn(wide ? "flex-1" : "")}>
            <h3 className={cn(
              "font-display font-bold leading-tight mb-3 text-foreground group-hover:text-gradient-gold transition-all duration-300",
              featured ? "text-3xl sm:text-4xl" : "text-xl sm:text-2xl",
            )}>
              {item.title}
            </h3>
            <p className={cn(
              "text-foreground-muted leading-relaxed",
              featured ? "text-base max-w-md" : "text-sm",
            )}>
              {item.description}
            </p>
          </div>

          {featured && (
            <div className="mt-6 pt-6 border-t border-border flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs text-foreground-muted">
                <Sparkles className="w-3.5 h-3.5 text-gold" />
                {dict.common.available}
              </div>
              <Link
                href={`/${locale}/services`}
                className="text-sm font-semibold text-gold hover:text-gold-300 transition-colors"
              >
                {dict.common.learnMore} →
              </Link>
            </div>
          )}
        </div>
      </div>
    </motion.article>
  );
}
