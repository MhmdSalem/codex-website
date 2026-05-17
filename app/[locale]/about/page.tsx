import { notFound } from "next/navigation";
import { Zap, Minimize2, Award, Eye } from "lucide-react";
import { SectionLabel } from "@/components/ui/section-label";
import { CtaBanner } from "@/components/sections/cta-banner";
import { Reveal } from "@/components/effects/reveal";
import { isValidLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";

const VALUE_ICONS = [Zap, Minimize2, Award, Eye] as const;

export default async function AboutPage({ params }: { params: { locale: string } }) {
  if (!isValidLocale(params.locale)) notFound();
  const locale = params.locale as Locale;
  const dict = await getDictionary(locale);
  const t = dict.about;

  return (
    <>
      <section className="relative pt-36 pb-12 sm:pt-44 overflow-hidden">
        <div aria-hidden="true" className="absolute inset-0 bg-aurora pointer-events-none" />
        <div aria-hidden="true" className="absolute inset-0 bg-grid-pattern bg-[size:60px_60px] opacity-20 [mask-image:radial-gradient(ellipse_at_top,black_20%,transparent_70%)] pointer-events-none" />

        <div className="container-wide relative text-center">
          <SectionLabel className="justify-center">{t.sectionLabel}</SectionLabel>
          <Reveal>
            <h1 className="mt-6 font-display text-display-xl text-balance leading-[0.95] max-w-5xl mx-auto">
              <span className="text-gradient-fade">{t.title.split(" ").slice(0, -2).join(" ")} </span>
              <span className="text-gradient-gold italic">
                {t.title.split(" ").slice(-2).join(" ")}
              </span>
            </h1>
          </Reveal>
        </div>
      </section>

      <section className="relative py-16 sm:py-24">
        <div className="container-wide">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 max-w-6xl mx-auto">
            <div className="lg:col-span-5">
              <Reveal>
                <div className="font-display text-7xl sm:text-8xl font-bold text-gradient-gold-static leading-none mb-4">
                  Codex
                </div>
                <p className="text-sm uppercase tracking-[0.3em] text-foreground-muted">
                  {locale === "ar" ? "قصتنا" : "Our story"}
                </p>
              </Reveal>
            </div>
            <div className="lg:col-span-7 space-y-6">
              {t.paragraphs.map((p, i) => (
                <Reveal key={i} delay={i * 0.1}>
                  <p className="text-base sm:text-lg text-foreground-muted leading-relaxed">
                    {p}
                  </p>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="relative py-24 sm:py-32 bg-background-surface/40 overflow-hidden">
        <span className="section-number top-0 -left-10 sm:-left-20" aria-hidden="true">★</span>

        <div aria-hidden="true" className="absolute inset-0 bg-grid-pattern bg-[size:64px_64px] opacity-20 [mask-image:linear-gradient(to_bottom,transparent,black_30%,black_70%,transparent)] pointer-events-none" />

        <div className="container-wide relative">
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <SectionLabel className="justify-center">
              {t.values.title}
            </SectionLabel>
            <Reveal>
              <h2 className="mt-4 font-display text-display-lg text-balance leading-[1.05]">
                <span className="text-gradient-fade">{t.values.title}</span>
              </h2>
            </Reveal>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {t.values.items.map((value, i) => {
              const Icon = VALUE_ICONS[i] ?? Zap;
              return (
                <Reveal key={value.title} delay={i * 0.1}>
                  <div className="group card-premium p-7">
                    <span className="inline-grid place-items-center w-14 h-14 rounded-2xl bg-gold/10 border border-gold/20 text-gold mb-5 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                      <Icon className="w-6 h-6" aria-hidden="true" />
                    </span>
                    <h3 className="font-display text-xl font-bold text-foreground mb-2">
                      {value.title}
                    </h3>
                    <p className="text-sm text-foreground-muted leading-relaxed">
                      {value.description}
                    </p>
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
