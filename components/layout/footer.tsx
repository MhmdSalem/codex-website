import Link from "next/link";
import {
  Mail,
  Phone,
  MessageCircle,
  MapPin,
  Linkedin,
  Instagram,
  Twitter,
  Facebook,
  ArrowUpRight,
} from "lucide-react";
import { Logo } from "@/components/ui/logo";
import { SITE_CONFIG } from "@/lib/utils";
import { htmlProps } from "@/components/content/rich-text";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/get-dictionary";

type FooterProps = {
  locale: Locale;
  dict: Dictionary;
};

export function Footer({ locale, dict }: FooterProps) {
  const year = new Date().getFullYear();
  const info = dict.contact.info;

  const navLinks = [
    { href: `/${locale}`, label: dict.footer.nav.home },
    { href: `/${locale}/services`, label: dict.footer.nav.services },
    { href: `/${locale}/about`, label: dict.footer.nav.about },
    { href: `/${locale}/contact`, label: dict.footer.nav.contact },
  ];

  const serviceLinks = [
    { href: `/${locale}/services#registration`, label: dict.footer.services.registration },
    { href: `/${locale}/services#workshops`, label: dict.footer.services.workshops },
    { href: `/${locale}/services#forms`, label: dict.footer.services.forms },
    { href: `/${locale}/services#marketing`, label: dict.footer.services.marketing },
  ];

  const social = [
    { href: SITE_CONFIG.social.linkedin, icon: Linkedin, label: "LinkedIn" },
    { href: SITE_CONFIG.social.twitter, icon: Twitter, label: "Twitter" },
    { href: SITE_CONFIG.social.instagram, icon: Instagram, label: "Instagram" },
    { href: SITE_CONFIG.social.facebook, icon: Facebook, label: "Facebook" },
  ];

  return (
    <footer className="relative mt-32 bg-background overflow-hidden">
      <div aria-hidden="true" className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent" />
      <div aria-hidden="true" className="absolute -top-32 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full bg-gold/8 blur-[120px] pointer-events-none" />

      <div className="container-wide relative">
        <div className="py-20 border-b border-border">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-block mb-6">
              <Logo locale={locale} variant="large" />
            </div>
            <p
              className="rich-text font-display text-display-md text-balance leading-[1.05] text-gradient-fade"
              {...htmlProps(dict.footer.tagline)}
            />
            <div className="mt-8 flex justify-center">
              <Link
                href={`/${locale}/contact`}
                className="group inline-flex items-center gap-2 text-sm font-semibold text-gold hover:gap-3 transition-all"
              >
                {dict.nav.cta}
                <ArrowUpRight
                  className={`w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform ${locale === "ar" ? "-scale-x-100" : ""}`}
                />
              </Link>
            </div>
          </div>
        </div>

        <div className="py-14 grid grid-cols-1 md:grid-cols-12 gap-10">
          <div className="md:col-span-4 flex flex-col gap-5">
            <h4 className="text-label uppercase text-gold">Codex</h4>
            <p
              className="rich-text text-sm text-foreground-muted leading-relaxed max-w-md"
              {...htmlProps(dict.about.paragraphs[0])}
            />
            <div className="flex items-center gap-2 pt-2">
              {social.map(({ href, icon: Icon, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-10 h-10 inline-flex items-center justify-center rounded-full border border-border text-foreground-muted hover:text-gold hover:border-gold/40 transition-colors"
                >
                  <Icon className="w-4 h-4" aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>

          <div className="md:col-span-2 flex flex-col gap-4">
            <h4 className="text-label uppercase text-gold">{dict.footer.nav.title}</h4>
            <ul className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-foreground-muted hover:text-gold transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-3 flex flex-col gap-4">
            <h4 className="text-label uppercase text-gold">{dict.footer.services.title}</h4>
            <ul className="flex flex-col gap-2">
              {serviceLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-foreground-muted hover:text-gold transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-3 flex flex-col gap-4">
            <h4 className="text-label uppercase text-gold">{dict.footer.contact.title}</h4>
            <ul className="flex flex-col gap-3 text-sm">
              <li>
                <a
                  href={`mailto:${info.email}`}
                  className="inline-flex items-center gap-2 text-foreground-muted hover:text-gold transition-colors"
                >
                  <Mail className="w-4 h-4" aria-hidden="true" />
                  {info.email}
                </a>
              </li>
              <li>
                <a
                  href={`tel:${info.phone.replace(/\s/g, "")}`}
                  className="inline-flex items-center gap-2 text-foreground-muted hover:text-gold transition-colors"
                  dir="ltr"
                >
                  <Phone className="w-4 h-4" aria-hidden="true" />
                  {info.phone}
                </a>
              </li>
              <li>
                <a
                  href={`https://wa.me/${info.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-foreground-muted hover:text-gold transition-colors"
                >
                  <MessageCircle className="w-4 h-4" aria-hidden="true" />
                  WhatsApp
                </a>
              </li>
              <li className="inline-flex items-center gap-2 text-foreground-muted">
                <MapPin className="w-4 h-4" aria-hidden="true" />
                {dict.contact.direct.locationValue}
              </li>
            </ul>
          </div>
        </div>

        <div className="py-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-foreground-subtle">
          <p>
            © {year} Codex. {dict.footer.legal.rights}.
          </p>
          <p className="opacity-70">{dict.footer.madeIn}</p>
        </div>
      </div>

      <div aria-hidden="true" className="font-display font-bold text-[20vw] sm:text-[18vw] leading-[0.9] text-center text-gradient-gold-static opacity-[0.04] select-none -mb-[3vw] -mt-10 px-4">
        CODEX
      </div>
    </footer>
  );
}
