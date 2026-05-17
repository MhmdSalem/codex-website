"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/get-dictionary";

type CtaBannerProps = {
  locale: Locale;
  dict: Dictionary;
};

export function CtaBanner({ locale, dict }: CtaBannerProps) {
  const t = dict.cta;

  return (
    <section className="relative py-24 sm:py-32 overflow-hidden">
      <div className="container-wide">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="relative overflow-hidden rounded-5xl border border-gold/20 bg-gradient-to-br from-background-elevated via-background-surface to-background-elevated"
        >
          <div aria-hidden="true" className="absolute inset-0 bg-aurora opacity-80 pointer-events-none" />
          <div aria-hidden="true" className="absolute inset-0 bg-grid-pattern-gold bg-[size:48px_48px] opacity-40 [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_70%)] pointer-events-none" />

          <div aria-hidden="true" className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-gold/20 blur-3xl animate-spotlight" />
          <div aria-hidden="true" className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full bg-gold/15 blur-3xl animate-float-slow" />

          <div className="relative px-6 py-16 sm:px-12 sm:py-24 lg:px-20 lg:py-28 flex flex-col items-center text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-gold/30 bg-gold/5 backdrop-blur-md mb-8"
            >
              <Sparkles className="w-3.5 h-3.5 text-gold" aria-hidden="true" />
              <span className="text-xs font-medium text-gold uppercase tracking-wider">
                {dict.common.getStarted}
              </span>
            </motion.div>

            <h2 className="font-display text-display-xl text-balance leading-[0.95] max-w-4xl">
              <span className="text-gradient-fade">{t.title}</span>
            </h2>
            <p className="mt-6 text-base sm:text-xl text-foreground-muted leading-relaxed max-w-2xl text-balance">
              {t.subtitle}
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center gap-3">
              <Button href={`/${locale}/contact`} size="lg" className="btn-shine">
                {t.primary}
                <ArrowUpRight
                  className={`w-4 h-4 ${locale === "ar" ? "-scale-x-100" : ""}`}
                  aria-hidden="true"
                />
              </Button>
              <Button href={`/${locale}/services`} size="lg" variant="secondary">
                {t.secondary}
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
