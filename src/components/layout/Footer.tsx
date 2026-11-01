import { getTranslations } from "next-intl/server";

import { ChannelIcon } from "@/components/ui/ChannelIcon";
import { Container } from "@/components/ui/Container";
import { Logo } from "@/components/ui/Logo";
import { SocialLinks } from "@/components/ui/SocialLinks";
import { resolveChannels, resolveSocials } from "@/content/contact";
import styles from "@/experience/build/build.module.css";
import { Link } from "@/i18n/navigation";
import { isRetiredPath, primaryNavigation, routes } from "@/i18n/routes";
import type { Locale } from "@/i18n/routing";
import { pick } from "@/lib/cms";
import { getSiteSettings } from "@/lib/content";
import { navigationFromRoutes, resolveNavItem } from "@/lib/links";
import { cn } from "@/lib/utils";

/**
 * Site footer.
 *
 * Kept short on purpose: the mark and a line about the company, the pages,
 * and the ways to reach us with a direct line to the next project. A warm
 * surface rather than the page's black, so the end of a page reads as a
 * landing and not a drop.
 *
 * Reads Site Settings for contact details, social links and the footer menu,
 * and falls back to the code and the message catalogue when the dashboard has
 * nothing — so the footer is never blank, connected or not.
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

  const siteName = settings?.siteName ?? tMeta("siteName");
  const channels = resolveChannels(settings);
  const socials = resolveSocials(settings);
  const year = new Date().getFullYear();
  const copyright = settings?.copyright?.replace("{year}", String(year));

  return (
    <footer
      data-site-chrome
      data-prologue-inert
      className={cn(styles.footer, "relative z-[var(--z-raised)] pb-20 lg:pb-0")}
    >
      <Container className="pt-8 pb-6 lg:pt-10">
        <div className={styles.footerCols}>
          <div>
            <Link href={routes.home} aria-label={siteName} className="inline-block">
              <Logo className="h-7" />
            </Link>
            <p className="mt-4 max-w-[36ch] text-caption text-muted">
              {pick(settings?.tagline, tFooter("tagline"))}
            </p>
          </div>

          {/* Below lg the tab bar already lists every page. */}
          <nav aria-label={tFooter("navigate")} className="hidden lg:block">
            <h2 className={cn(styles.footerHead, "mb-3")}>{tFooter("navigate")}</h2>
            <ul className={styles.footerLinks}>
              {navigation.map((item) => (
                <li key={item.href}>
                  <FooterLink {...item} />
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className={cn(styles.footerHead, "mb-3")}>{tFooter("reach")}</h2>
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
            {socials.length > 0 ? <SocialLinks socials={socials} className="mt-3" /> : null}
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-hairline pt-5">
          <p className="text-caption text-subtle">{copyright ?? tFooter("copyright", { year })}</p>
          <Link
            href={routes.contact}
            className={cn(styles.prompt, "mt-0 text-[14px] hover:border-[var(--color-signal)]")}
            style={{ padding: "8px 14px", fontFamily: "inherit" }}
          >
            <span className={styles.promptD}>$</span>
            <span>{tFooter("prompt")}</span>
            <span className={styles.caret} />
          </Link>
        </div>
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
