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
import { getSiteSettings } from "@/lib/content";
import { navigationFromRoutes, resolveNavItem } from "@/lib/links";
import { cn } from "@/lib/utils";

/**
 * Site footer — one slim strip.
 *
 * The mark, the pages in a single line, the ways to reach us as icons, and
 * the copyright. No headings, no paragraphs: the pages above already said
 * everything, so the footer only has to close the page.
 *
 * Reads Site Settings for contact details, social links and the footer menu,
 * and falls back to the code and the message catalogue when the dashboard
 * has nothing.
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
      className={cn(styles.footer, "relative z-[var(--z-raised)] pb-16 lg:pb-0")}
    >
      <Container className="flex flex-wrap items-center justify-between gap-x-8 gap-y-3 py-5">
        <Link href={routes.home} aria-label={siteName} className="inline-flex shrink-0">
          <Logo className="h-6" />
        </Link>

        {/* Below lg the tab bar already lists every page. */}
        <nav aria-label={tFooter("navigate")} className="hidden lg:block">
          <ul className="flex flex-wrap items-center gap-x-6 gap-y-2 text-caption">
            {navigation.map((item) => (
              <li key={item.href}>
                <FooterLink {...item} />
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-1">
          {channels.map((channel) => (
            <a
              key={channel.href}
              href={channel.href}
              aria-label={`${tContact(channel.kind)} ${channel.value}`}
              title={channel.value}
              className="inline-flex size-10 items-center justify-center text-muted transition-colors hover:text-accent-text"
              {...(channel.kind === "whatsapp"
                ? { target: "_blank", rel: "noreferrer noopener" }
                : {})}
            >
              <ChannelIcon kind={channel.kind} className="size-5" />
            </a>
          ))}
          {socials.length > 0 ? <SocialLinks socials={socials} className="gap-1" /> : null}
        </div>

        <p className="w-full text-micro text-subtle lg:w-auto">
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
  const className = "text-muted transition-colors hover:text-foreground";

  if (external) {
    return (
      <a
        href={href}
        className={className}
        {...(newTab ? { target: "_blank", rel: "noreferrer noopener" } : {})}
      >
        {label}
      </a>
    );
  }

  return (
    <Link href={href} className={className}>
      {label}
    </Link>
  );
}
