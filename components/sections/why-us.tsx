"use client";

import { motion } from "framer-motion";
import {
  Rocket,
  Wallet,
  Headset,
  RefreshCw,
  ShieldCheck,
  Languages,
  type LucideIcon,
} from "lucide-react";
import { SectionLabel } from "@/components/ui/section-label";
import { Reveal } from "@/components/effects/reveal";
import { cp } from "@/lib/content/cp";
import { htmlProps } from "@/components/content/rich-text";
import { cn } from "@/lib/utils";
import type { Dictionary } from "@/lib/i18n/get-dictionary";

const ICONS: LucideIcon[] = [Rocket, Wallet, Headset, RefreshCw, ShieldCheck, Languages];

export function WhyUs({ dict }: { dict: Dictionary }) {
  const t = dict.whyUs;

  return (
    <section className="relative py-24 sm:py-36 overflow-hidden">
      <span className="section-number top-0 -left-10 sm:-left-20" aria-hidden="true">05</span>

      <div className="container-wide relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 mb-14">
          <div className="lg:col-span-5 lg:sticky lg:top-32 lg:self-start">
            <SectionLabel className={cp("whyUs.sectionLabel")}>{t.sectionLabel}</SectionLabel>
            <Reveal>
              <h2 className={cn("mt-4 font-display text-display-lg text-balance leading-[1.05]", cp("whyUs.title"))}>
                <span className="text-foreground">
                  {t.title.split(" ").slice(0, -2).join(" ")}{" "}
                </span>
                <span className="text-gradient-gold italic">
                  {t.title.split(" ").slice(-2).join(" ")}
                </span>
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p
                className={cn("rich-text mt-5 text-base sm:text-lg text-foreground-muted leading-relaxed", cp("whyUs.subtitle"))}
                {...htmlProps(t.subtitle)}
              />
            </Reveal>
          </div>

          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {t.items.map((item, i) => {
              const Icon = ICONS[i] ?? Rocket;
              return (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-30px" }}
                  transition={{ duration: 0.6, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
                  className="group card-premium p-6"
                >
                  <span className="inline-grid place-items-center w-12 h-12 rounded-xl bg-gold/10 border border-gold/20 text-gold mb-4 transition-all duration-500 group-hover:scale-110 group-hover:rotate-3">
                    <Icon className="w-5 h-5" aria-hidden="true" />
                  </span>
                  <h3 className={cn("font-display text-lg sm:text-xl font-bold text-foreground mb-2", cp(`whyUs.items.${i}.title`))}>
                    {item.title}
                  </h3>
                  <p
                    className={cn("rich-text text-sm text-foreground-muted leading-relaxed", cp(`whyUs.items.${i}.description`))}
                    {...htmlProps(item.description)}
                  />
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
