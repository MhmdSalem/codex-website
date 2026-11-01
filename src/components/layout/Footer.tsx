import { getTranslations } from "next-intl/server";

import { ChannelIcon } from "@/components/ui/ChannelIcon";
import { Container } from "@/components/ui/Container";
import { Logo } from "@/components/ui/Logo";
import { SocialLinks } from "@/components/ui/SocialLinks";
import { COMPANY_ADDRESS, LEGAL_ENTITY, resolveChannels, resolveSocials } from "@/content/contact";
import styles from "@/experience/build/build.module.css";
import { Link } from "@/i18n/navigation";
import { isRetiredPath, legalNavigation, primaryNavigation, routes } from "@/i18n/routes";
import type { Locale } from "@/i18n/routing";
import { getSiteSettings } from "@/lib/content";
import { navigationFromRoutes, resolveNavItem } from "@/lib/links";
import { cn } from "@/lib/utils";

/**
 * Site footer.
 *
 * A warm surface rather than the page's black, so the end of a page reads as
 * a landing and not a drop. The mark and where we are first, then the
 * columns: the company and its registry, the destinations, the legal pages,
 * and the ways to reach us with a direct line to the next project.
 *
 * Reads Site Settings for contact details, social links and the footer menu,
 * and falls back to the route map plus translated labels when the CMS is empty.
 */
export async function Footer({ locale }: { locale: Locale }) {
  const [settings, tNav, tFooter, tMeta, tContact] = await Promise.all([
    getSiteSettings(locale),
    getTranslations("nav"),
    getTranslations("footer"),
    getTranslations("meta"),
    getTranslations("contact"),
  ]);

  const navigation = (
    settings?.footerNavigation
      ?.map(resolveNavItem)
      .filter((item): item is NonNullable<typeof item> => item !== null) ??
    navigationFromRoutes(primaryNavigation, (key) => tNav(key))
  ).filter((item) => !isRetiredPath(item.href));

  const legal = navigationFromRoutes(legalNavigation, (key) => tNav(key));
  const siteName = settings?.siteName ?? tMeta("siteName");
  const channels = resolveChannels(settings);
  const socials = resolveSocials(settings);
  const year = new Date().getFullYear();
  const copyright = settings?.copyright?.replace("{year}", String(year));

  return (
    <footer
      data-site-chrome
      data-prologue-inert
      // Above the fixed backdrop, which sits at z 0 behind positioned content.
      className={cn(styles.footer, "relative z-[var(--z-raised)] pb-20 lg:pb-0")}
    >
      <Container className="pt-12 pb-10 lg:pt-16">
        {/* The status line. */}
        <div className="flex flex-wrap items-center justify-between gap-6 border-b border-hairline pb-6">
          <Link href={routes.home} aria-label={siteName} className="inline-block">
            <Logo className="h-7" />
          </Link>
          <div className={styles.footerStatus}>
            <span>{tFooter("status.region")}</span>
            <span>{year}</span>
          </div>
        </div>

        <div className={cn(styles.footerCols, "pt-12")}>
          <div>
            <p className={cn(styles.lead, "mt-0 max-w-[36ch]")}>
              {settings?.tagline ?? tFooter("tagline")}
            </p>
            <dl className="mt-8 grid gap-1 text-caption text-subtle">
              <div>
                <dt className="inline">{tFooter("entity")}: </dt>
                <dd className="inline text-muted">{LEGAL_ENTITY.name}</dd>
              </div>
              <div>
                <dt className="inline">{tFooter("commercialRegister")}: </dt>
                <dd className="inline text-muted" dir="ltr">
                  {LEGAL_ENTITY.commercialRegister}
                </dd>
              </div>
              <div>
                <dt className="inline">{tFooter("unifiedCommercialRegister")}: </dt>
                <dd className="inline break-all text-muted" dir="ltr">
                  {LEGAL_ENTITY.unifiedCommercialRegister}
                </dd>
              </div>
              <div>
                <dt className="inline">{tFooter("taxRegister")}: </dt>
                <dd className="inline text-muted" dir="ltr">
                  {LEGAL_ENTITY.taxRegister}
                </dd>
              </div>
              <div>
                <dt className="inline">{tFooter("address")}: </dt>
                <dd className="inline text-muted">{COMPANY_ADDRESS[locale]}</dd>
              </div>
            </dl>
          </div>

          <nav aria-label={tFooter("navigate")}>
            <h2 className={cn(styles.footerHead, "mb-4")}>{tFooter("navigate").toLowerCase()}</h2>
            <ul className={styles.footerLinks}>
              {navigation.map((item) => (
                <li key={item.href}>
                  <FooterLink {...item} />
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label={tFooter("legal")}>
            <h2 className={cn(styles.footerHead, "mb-4")}>{tFooter("legal").toLowerCase()}</h2>
            <ul className={styles.footerLinks}>
              {legal.map((item) => (
                <li key={item.href}>
                  <FooterLink {...item} />
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className={cn(styles.footerHead, "mb-4")}>{tFooter("reach").toLowerCase()}</h2>
            {channels.length > 0 ? (
              <ul className={styles.channels}>
                {channels.map((channel) => (
                  <li key={channel.href}>
                    <a
                      href={channel.href}
                      aria-label={`${tContact(channel.kind)} ${channel.value}`}
                      {...(channel.kind === "whatsapp"
                        ? { target: "_blank", rel: "noreferrer noopener" }
                        : {})}
                    >
                      <ChannelIcon kind={channel.kind} />
                      <span dir={channel.kind === "email" ? undefined : "ltr"}>
                        {channel.value}
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            ) : null}
            {socials.length > 0 ? <SocialLinks socials={socials} className="mt-5" /> : null}
            <Link
              href={routes.contact}
              className={cn(styles.prompt, "mt-6 text-[15px] hover:border-[var(--color-signal)]")}
              style={{ padding: "12px 18px", fontFamily: "inherit" }}
            >
              <span className={styles.promptD}>$</span>
              <span>{tFooter("prompt")}</span>
              <span className={styles.caret} />
            </Link>
          </div>
        </div>

        <p className="mt-12 text-caption text-subtle">
          {copyright ?? tFooter("copyright", { year })}
        </p>
      </Container>
    </footer>
  );
}

function FooterLink({
  href,
  label,
  external,
  newTab,
}: {
  href: string;
  label: string;
  external: boolean;
  newTab: boolean;
}) {
  if (external) {
    return (
      <a href={href} {...(newTab ? { target: "_blank", rel: "noreferrer noopener" } : {})}>
        {label}
      </a>
    );
  }

  return <Link href={href}>{label}</Link>;
}
