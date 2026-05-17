import { notFound } from "next/navigation";
import { Mail, Phone, MessageCircle, MapPin } from "lucide-react";
import { SectionLabel } from "@/components/ui/section-label";
import { ContactForm } from "@/components/sections/contact-form";
import { Reveal } from "@/components/effects/reveal";
import { SITE_CONFIG } from "@/lib/utils";
import { isValidLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";

export default async function ContactPage({ params }: { params: { locale: string } }) {
  if (!isValidLocale(params.locale)) notFound();
  const locale = params.locale as Locale;
  const dict = await getDictionary(locale);
  const t = dict.contact;

  const directLinks = [
    {
      icon: Mail,
      label: t.direct.email,
      value: SITE_CONFIG.email,
      href: `mailto:${SITE_CONFIG.email}`,
      dir: "ltr" as const,
    },
    {
      icon: Phone,
      label: t.direct.phone,
      value: SITE_CONFIG.phone,
      href: `tel:${SITE_CONFIG.phone.replace(/\s/g, "")}`,
      dir: "ltr" as const,
    },
    {
      icon: MessageCircle,
      label: t.direct.whatsapp,
      value: SITE_CONFIG.phone,
      href: `https://wa.me/${SITE_CONFIG.whatsapp}`,
      dir: "ltr" as const,
    },
    {
      icon: MapPin,
      label: t.direct.location,
      value: t.direct.locationValue,
      href: null,
      dir: undefined,
    },
  ];

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
            <p className="mt-6 text-base sm:text-lg text-foreground-muted max-w-2xl mx-auto leading-relaxed text-balance">
              {t.subtitle}
            </p>
          </Reveal>
        </div>
      </section>

      <section className="relative py-12 sm:py-16">
        <div className="container-wide">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            <Reveal className="lg:col-span-7 order-2 lg:order-1">
              <div className="p-6 sm:p-10 rounded-4xl border border-border bg-background-surface/40 backdrop-blur-sm">
                <ContactForm locale={locale} dict={dict} />
              </div>
            </Reveal>

            <Reveal delay={0.1} className="lg:col-span-5 order-1 lg:order-2 flex flex-col gap-4">
              <h3 className="text-label uppercase text-gold mb-2">{t.direct.title}</h3>

              {directLinks.map((item) => {
                const Icon = item.icon;
                const content = (
                  <>
                    <span className="inline-grid place-items-center w-12 h-12 rounded-2xl bg-gold/10 border border-gold/20 text-gold shrink-0 group-hover:scale-110 transition-transform">
                      <Icon className="w-5 h-5" aria-hidden="true" />
                    </span>
                    <div className="flex flex-col">
                      <span className="text-xs text-foreground-subtle uppercase tracking-wider">
                        {item.label}
                      </span>
                      <span
                        className="text-sm text-foreground font-medium mt-0.5"
                        dir={item.dir}
                      >
                        {item.value}
                      </span>
                    </div>
                  </>
                );

                if (item.href) {
                  return (
                    <a
                      key={item.label}
                      href={item.href}
                      target={item.href.startsWith("http") ? "_blank" : undefined}
                      rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
                      className="group flex items-center gap-4 p-5 rounded-3xl border border-border hover:border-gold/30 bg-background-surface/40 hover:bg-background-surface/70 transition-all"
                    >
                      {content}
                    </a>
                  );
                }
                return (
                  <div
                    key={item.label}
                    className="group flex items-center gap-4 p-5 rounded-3xl border border-border bg-background-surface/40"
                  >
                    {content}
                  </div>
                );
              })}
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
