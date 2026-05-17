"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { ArrowRight, Sparkles, ArrowDown, Code2, QrCode, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Marquee } from "@/components/effects/marquee";
import { cp } from "@/lib/content/cp";
import { cn } from "@/lib/utils";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/get-dictionary";

type HeroProps = {
  locale: Locale;
  dict: Dictionary;
};

export function Hero({ locale, dict }: HeroProps) {
  const t = dict.hero;
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.95]);

  return (
    <section
      ref={ref}
      className="relative min-h-[100svh] flex flex-col justify-center overflow-hidden pt-20"
    >
      <div aria-hidden="true" className="absolute inset-0 bg-aurora pointer-events-none" />

      <div
        aria-hidden="true"
        className="absolute inset-0 bg-grid-pattern bg-[size:60px_60px] opacity-30 [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_70%)] pointer-events-none"
      />

      <div aria-hidden="true" className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] rounded-full bg-gold/15 blur-[150px] animate-spotlight" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] rounded-full bg-gold/10 blur-[120px] animate-float-slow" />
      </div>

      <FloatingCards locale={locale} dict={dict} />

      <motion.div
        style={{ y, opacity, scale }}
        className="container-wide relative z-10 flex flex-col items-center text-center"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-gold/30 bg-gold/5 backdrop-blur-md mb-8"
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-gold opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-gold" />
          </span>
          <span className={cn("text-xs font-medium text-gold uppercase tracking-wider", cp("hero.eyebrow"))}>
            {t.eyebrow}
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="font-display text-display-2xl text-balance leading-[0.95] max-w-6xl"
        >
          <motion.span
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className={cn("block text-gradient-fade", cp("hero.titleStart"))}
          >
            {t.titleStart}
          </motion.span>
          <motion.span
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className={cn("block text-gradient-gold italic py-2", cp("hero.titleHighlight"))}
          >
            {t.titleHighlight}
          </motion.span>
          <motion.span
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className={cn("block text-gradient-fade", cp("hero.titleEnd"))}
          >
            {t.titleEnd}
          </motion.span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className={cn("mt-10 text-base sm:text-lg text-foreground-muted leading-relaxed max-w-2xl text-balance", cp("hero.subtitle"))}
        >
          {t.subtitle}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="mt-10 flex flex-col sm:flex-row items-center gap-3"
        >
          <Button href={`/${locale}/services`} size="lg" className="btn-shine">
            {t.ctaPrimary}
            <ArrowRight
              className={`w-4 h-4 ${locale === "ar" ? "rotate-180" : ""}`}
              aria-hidden="true"
            />
          </Button>
          <Button href={`/${locale}/contact`} size="lg" variant="secondary">
            {t.ctaSecondary}
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.4 }}
          className="absolute bottom-6 left-1/2 -translate-x-1/2 hidden sm:flex flex-col items-center gap-2 text-foreground-subtle"
        >
          <span className={cn("text-[10px] uppercase tracking-[0.3em]", cp("hero.scrollHint"))}>
            {t.scrollHint}
          </span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="w-px h-12 bg-gradient-to-b from-gold/60 to-transparent"
          />
        </motion.div>
      </motion.div>

      <div className="absolute bottom-0 inset-x-0 z-0">
        <Marquee items={[...t.marquee]} size="lg" />
      </div>
    </section>
  );
}

/* === Floating product mockup cards on hero === */
function FloatingCards({ locale, dict }: HeroProps) {
  const isRtl = locale === "ar";
  const cards = [
    {
      title: dict.servicesPreview.items[0].title,
      icon: QrCode,
      stat: "QR",
      position: isRtl
        ? "top-32 right-4 sm:right-12 -rotate-6"
        : "top-32 left-4 sm:left-12 -rotate-6",
      delay: 1.6,
    },
    {
      title: dict.servicesPreview.items[1].title,
      icon: BarChart3,
      stat: "+98%",
      position: isRtl
        ? "top-44 left-4 sm:left-12 rotate-6"
        : "top-44 right-4 sm:right-12 rotate-6",
      delay: 1.8,
    },
    {
      title: dict.servicesPreview.items[2].title,
      icon: Code2,
      stat: "API",
      position: isRtl
        ? "bottom-40 right-4 sm:right-20 rotate-3"
        : "bottom-40 left-4 sm:left-20 rotate-3",
      delay: 2,
    },
  ];

  return (
    <div aria-hidden="true" className="absolute inset-0 pointer-events-none hidden lg:block">
      {cards.map((card, i) => {
        const Icon = card.icon;
        return (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.5, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1, delay: card.delay, ease: [0.16, 1, 0.3, 1] }}
            className={`absolute ${card.position} animate-float`}
            style={{ animationDelay: `${i * 1.5}s` }}
          >
            <div className="glass-gold w-52 rounded-2xl p-4 shadow-premium">
              <div className="flex items-center justify-between mb-3">
                <span className="inline-grid place-items-center w-9 h-9 rounded-lg bg-gold/15 text-gold">
                  <Icon className="w-4 h-4" />
                </span>
                <span className="text-xs font-bold text-gradient-gold-static" dir="ltr">
                  {card.stat}
                </span>
              </div>
              <div className="space-y-2">
                <div className="h-2 rounded-full bg-gold/30 w-full" />
                <div className="h-2 rounded-full bg-foreground-muted/20 w-3/4" />
                <div className="h-2 rounded-full bg-foreground-muted/20 w-1/2" />
              </div>
              <p className="mt-3 text-[11px] text-foreground-muted line-clamp-1">
                {card.title}
              </p>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
