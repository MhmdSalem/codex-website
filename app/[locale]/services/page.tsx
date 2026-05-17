import { notFound } from "next/navigation";
import {
  Check,
  ArrowUpRight,
  QrCode,
  CalendarCheck,
  FileText,
  Megaphone,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionLabel } from "@/components/ui/section-label";
import { CtaBanner } from "@/components/sections/cta-banner";
import { Reveal } from "@/components/effects/reveal";
import { cn } from "@/lib/utils";
import { isValidLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";

const ICONS = [QrCode, CalendarCheck, FileText, Megaphone] as const;
const ANCHORS = ["registration", "workshops", "forms", "marketing"] as const;

export default async function ServicesPage({ params }: { params: { locale: string } }) {
  if (!isValidLocale(params.locale)) notFound();
  const locale = params.locale as Locale;
  const dict = await getDictionary(locale);
  const t = dict.services;
  const arrowFlip = locale === "ar" ? "-scale-x-100" : "";

  return (
    <>
      <section className="relative pt-36 pb-12 sm:pt-44 overflow-hidden">
        <div aria-hidden="true" className="absolute inset-0 bg-aurora pointer-events-none" />
        <div aria-hidden="true" className="absolute inset-0 bg-grid-pattern bg-[size:60px_60px] opacity-20 [mask-image:radial-gradient(ellipse_at_top,black_20%,transparent_70%)] pointer-events-none" />

        <div className="container-wide relative text-center">
          <SectionLabel className="justify-center">{t.sectionLabel}</SectionLabel>
          <Reveal>
            <h1 className="mt-6 font-display text-display-xl text-balance leading-[0.95] max-w-5xl mx-auto">
              <span className="text-gradient-fade">{t.title.split(" ").slice(0, -1).join(" ")} </span>
              <span className="text-gradient-gold italic">
                {t.title.split(" ").slice(-1)[0]}
              </span>
            </h1>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-6 text-lg text-foreground-muted max-w-2xl mx-auto leading-relaxed text-balance">
              {t.subtitle}
            </p>
          </Reveal>
        </div>
      </section>

      <section className="relative py-16 sm:py-24">
        <div className="container-wide">
          <div className="grid grid-cols-1 gap-6 lg:gap-8">
            {t.detailed.map((service, i) => {
              const Icon = ICONS[i] ?? QrCode;
              const anchor = ANCHORS[i] ?? "service";
              const isSoon = service.status === "soon";

              return (
                <Reveal key={service.title} delay={i * 0.1}>
                  <article
                    id={anchor}
                    className="group card-premium scroll-mt-32"
                  >
                    <div className="absolute inset-0 bg-grid-pattern bg-[size:32px_32px] opacity-10 [mask-image:radial-gradient(ellipse_at_top_right,black_30%,transparent_70%)] pointer-events-none" />

                    <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-8 p-8 sm:p-12">
                      <div className="lg:col-span-5 flex flex-col">
                        <div className="font-display text-7xl sm:text-8xl font-bold text-gold/10 leading-none mb-4">
                          0{i + 1}
                        </div>
                        <div className="flex items-center gap-3 mb-5">
                          <span className="inline-grid place-items-center w-14 h-14 rounded-2xl bg-gold/15 border border-gold/30 text-gold">
                            <Icon className="w-7 h-7" aria-hidden="true" />
                          </span>
                          <span
                            className={cn(
                              "text-[10px] font-medium uppercase tracking-[0.2em] px-3 py-1 rounded-full",
                              isSoon
                                ? "bg-foreground-muted/10 text-foreground-muted border border-border"
                                : "bg-gold/10 text-gold border border-gold/20",
                            )}
                          >
                            {isSoon ? dict.common.soon : dict.common.available}
                          </span>
                        </div>
                        <h3 className="font-display text-3xl sm:text-4xl font-bold text-foreground mb-3 leading-tight">
                          {service.title}
                        </h3>
                        <p className="text-base text-foreground-muted leading-relaxed">
                          {service.description}
                        </p>
                        {!isSoon && (
                          <div className="mt-6">
                            <Button href={`/${locale}/contact`} variant="outline" size="sm">
                              {dict.common.getStarted}
                              <ArrowUpRight className={`w-4 h-4 ${arrowFlip}`} aria-hidden="true" />
                            </Button>
                          </div>
                        )}
                      </div>

                      <div className="lg:col-span-7">
                        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {service.features.map((feature, idx) => (
                            <li
                              key={feature}
                              className="group/feature flex items-start gap-3 p-4 rounded-2xl bg-background-elevated/60 border border-border-subtle hover:border-gold/20 transition-all"
                              style={{ animationDelay: `${idx * 50}ms` }}
                            >
                              <span className="shrink-0 grid place-items-center w-6 h-6 rounded-full bg-gold/15 text-gold mt-0.5 group-hover/feature:scale-110 transition-transform">
                                <Check className="w-3.5 h-3.5" aria-hidden="true" />
                              </span>
                              <span className="text-sm text-foreground leading-relaxed">
                                {feature}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </article>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      <section className="relative py-24 sm:py-32 bg-background-surface/40 overflow-hidden">
        <span className="section-number top-0 -right-10 sm:-right-20" aria-hidden="true">$</span>

        <div className="container-wide relative">
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <SectionLabel className="justify-center">
              {t.pricing.title}
            </SectionLabel>
            <Reveal>
              <h2 className="mt-4 font-display text-display-lg text-balance leading-[1.05]">
                <span className="text-foreground">{t.pricing.title.split(" ").slice(0, -1).join(" ")} </span>
                <span className="text-gradient-gold italic">
                  {t.pricing.title.split(" ").slice(-1)[0]}
                </span>
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mt-4 text-base sm:text-lg text-foreground-muted">
                {t.pricing.subtitle}
              </p>
            </Reveal>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-6">
            {[t.pricing.starter, t.pricing.pro, t.pricing.enterprise].map((plan, i) => {
              const featured = Boolean("featured" in plan && plan.featured);
              return (
                <Reveal key={plan.name} delay={i * 0.1}>
                  <div
                    className={cn(
                      "relative flex flex-col p-8 rounded-3xl border bg-background-surface/60 backdrop-blur-sm transition-all duration-500",
                      featured
                        ? "border-gold/40 shadow-gold-glow scale-100 md:scale-105"
                        : "border-border hover:border-gold/30",
                    )}
                  >
                    {featured && (
                      <span className="absolute -top-3 left-1/2 -translate-x-1/2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-gold text-foreground-inverse text-xs font-bold">
                        <Star className="w-3 h-3 fill-current" aria-hidden="true" />
                        {locale === "ar" ? "الأكثر شيوعاً" : "Most popular"}
                      </span>
                    )}

                    <h3 className="font-display text-2xl font-bold mb-2">{plan.name}</h3>
                    <p className="text-sm text-foreground-muted leading-relaxed mb-6">
                      {plan.description}
                    </p>

                    <div className="mb-6">
                      <div className="text-xs text-foreground-subtle uppercase tracking-wider mb-1">
                        {plan.priceLabel}
                      </div>
                      <div className="flex items-baseline gap-1">
                        <span className="font-display text-4xl font-bold text-gradient-gold-static">
                          {plan.priceValue}
                        </span>
                        {plan.period && (
                          <span className="text-sm text-foreground-muted">{plan.period}</span>
                        )}
                      </div>
                    </div>

                    <ul className="flex flex-col gap-3 mb-8 flex-1">
                      {plan.features.map((feature) => (
                        <li key={feature} className="flex items-start gap-2.5">
                          <span className="shrink-0 grid place-items-center w-5 h-5 rounded-full bg-gold/15 text-gold mt-0.5">
                            <Check className="w-3 h-3" aria-hidden="true" />
                          </span>
                          <span className="text-sm text-foreground leading-relaxed">
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>

                    <Button
                      href={`/${locale}/contact`}
                      variant={featured ? "primary" : "secondary"}
                      className="w-full"
                    >
                      {plan.cta}
                    </Button>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      <CtaBanner locale={locale} dict={dict} />
    </>
  );
}
