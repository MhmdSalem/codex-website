"use client";

import { motion } from "framer-motion";
import { SectionLabel } from "@/components/ui/section-label";
import { Reveal } from "@/components/effects/reveal";
import { cp } from "@/lib/content/cp";
import { cn } from "@/lib/utils";
import type { Dictionary } from "@/lib/i18n/get-dictionary";

export function Process({ dict }: { dict: Dictionary }) {
  const t = dict.process;

  return (
    <section className="relative py-24 sm:py-36 overflow-hidden">
      <span className="section-number top-0 -right-10 sm:-right-20" aria-hidden="true">04</span>

      <div className="container-wide relative">
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <SectionLabel className={cp("process.sectionLabel")}>{t.sectionLabel}</SectionLabel>
          <Reveal>
            <h2 className={cn("mt-4 font-display text-display-lg text-balance leading-[1.05]", cp("process.title"))}>
              <span className="text-foreground">{t.title.split(" ").slice(0, -2).join(" ")} </span>
              <span className="text-gradient-gold italic">
                {t.title.split(" ").slice(-2).join(" ")}
              </span>
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className={cn("mt-4 text-base sm:text-lg text-foreground-muted leading-relaxed", cp("process.subtitle"))}>
              {t.subtitle}
            </p>
          </Reveal>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 relative">
          <div className="hidden lg:block absolute top-12 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />

          {t.steps.map((step, i) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: i * 0.15, ease: [0.16, 1, 0.3, 1] }}
              className="relative"
            >
              <div className="relative z-10 flex justify-center mb-6">
                <div className="relative">
                  <div className="absolute inset-0 rounded-full bg-gold/20 blur-xl animate-pulse-gold" />
                  <div className="relative w-24 h-24 rounded-full bg-background-surface border border-gold/30 grid place-items-center">
                    <span className="font-display text-3xl font-bold text-gradient-gold-static">
                      {step.number}
                    </span>
                  </div>
                </div>
              </div>

              <div className="card-premium p-6 text-center">
                <h3 className={cn("font-display text-xl sm:text-2xl font-bold mb-3 text-foreground", cp(`process.steps.${i}.title`))}>
                  {step.title}
                </h3>
                <p className={cn("text-sm text-foreground-muted leading-relaxed", cp(`process.steps.${i}.description`))}>
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
