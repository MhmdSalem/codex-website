"use client";

import { motion } from "framer-motion";
import { SectionLabel } from "@/components/ui/section-label";
import { Counter } from "@/components/effects/counter";
import { Reveal } from "@/components/effects/reveal";
import { cp } from "@/lib/content/cp";
import { htmlProps } from "@/components/content/rich-text";
import { cn } from "@/lib/utils";
import type { Dictionary } from "@/lib/i18n/get-dictionary";

export function BigStats({ dict }: { dict: Dictionary }) {
  const t = dict.bigStats;

  return (
    <section className="relative py-24 sm:py-36 overflow-hidden bg-background-surface/40">
      <span className="section-number top-10 -left-10 sm:-left-20" aria-hidden="true">
        03
      </span>

      <div
        aria-hidden="true"
        className="absolute inset-0 bg-grid-pattern-gold bg-[size:80px_80px] opacity-30 [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_70%)] pointer-events-none"
      />

      <div className="container-wide relative">
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <SectionLabel className={cp("bigStats.sectionLabel")}>{t.sectionLabel}</SectionLabel>
          <Reveal>
            <h2 className={cn("mt-4 font-display text-display-lg text-balance leading-[1.05]", cp("bigStats.title"))}>
              <span className="text-foreground">{t.title.split(" ").slice(0, -1).join(" ")} </span>
              <span className="text-gradient-gold italic">
                {t.title.split(" ").slice(-1)[0]}
              </span>
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p
              className={cn("rich-text mt-4 text-base sm:text-lg text-foreground-muted leading-relaxed", cp("bigStats.subtitle"))}
              {...htmlProps(t.subtitle)}
            />
          </Reveal>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-y lg:divide-y-0 divide-border rtl:divide-x-reverse border border-border rounded-3xl overflow-hidden bg-background-surface/30 backdrop-blur-sm">
          {t.items.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="group relative p-8 sm:p-10 lg:p-12 text-center transition-all duration-500 hover:bg-gold/5"
            >
              <div className={cn("font-display font-bold text-5xl sm:text-6xl lg:text-7xl text-gradient-gold-static leading-none mb-3 flex items-baseline justify-center", cp(`bigStats.items.${i}.value`))}>
                <Counter value={item.value} suffix={item.suffix} duration={2000} />
              </div>
              <div className={cn("text-xs sm:text-sm uppercase tracking-[0.2em] text-foreground-muted", cp(`bigStats.items.${i}.label`))}>
                {item.label}
              </div>

              <div className="absolute inset-x-8 bottom-0 h-px bg-gradient-to-r from-transparent via-gold/0 group-hover:via-gold/40 to-transparent transition-all duration-700" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
