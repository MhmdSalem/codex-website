import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { ContactForm } from "@/components/forms/ContactForm";
import { ChannelIcon } from "@/components/ui/ChannelIcon";
import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/ui/PageHeader";
import { Section } from "@/components/ui/Section";
import { SocialLinks } from "@/components/ui/SocialLinks";
import { COMPANY_ADDRESS, resolveChannels, resolveEmail, resolveSocials } from "@/content/contact";
import styles from "@/experience/build/build.module.css";
import { Window } from "@/experience/build/Window";
import type { Locale } from "@/i18n/routing";
import { getContactPage, getSiteSettings } from "@/lib/content";
import { buildPageMetadata } from "@/lib/seo";
import { cn } from "@/lib/utils";
import { Reveal } from "@/motion/Reveal";

interface PageProps {
  params: Promise<{ locale: Locale }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const [t, contact] = await Promise.all([
    getTranslations({ locale, namespace: "contact" }),
    getContactPage(locale),
  ]);

  return buildPageMetadata({
    locale,
    path: "/contact",
    title: contact?.headline ?? t("title"),
    description: t("description"),
    seo: contact?.seo,
  });
}

/**
 * Contact — the prompt.
 *
 * The enquiry form sits inside a terminal window under the command that
 * starts a project, so writing to us is the last line of the same program the
 * homepage ran. The direct channels follow as the ways the session can be
 * reached outside the window.
 */
export default async function ContactPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const [t, contact, settings] = await Promise.all([
    getTranslations("contact"),
    getContactPage(locale),
    getSiteSettings(locale),
  ]);

  const channels = resolveChannels(settings);
  const socials = resolveSocials(settings);

  return (
    <>
      <PageHeader
        eyebrow={contact?.eyebrow ?? t("eyebrow")}
        headline={contact?.headline ?? t("headline")}
        description={contact?.supportingText ?? t("lead")}
      />

      <Reveal>
        <Section spacing="flush" label={t("form.label")}>
          <Container>
            <div className={cn(styles.module, styles.contactGrid)}>
              <div data-reveal>
                <Window title={t("replTitle")} status="● ready">
                  <div className={styles.repl}>
                    <span className={styles.termDim}>$ </span>
                    <b>{t("replHint")}</b>
                  </div>
                  <div className={styles.replBody}>
                    <ContactForm locale={locale} email={resolveEmail(settings)} />
                  </div>
                </Window>
              </div>

              <div>
                {channels.length > 0 ? (
                  <div data-reveal className={cn(styles.glass, "p-4")}>
                    <div className={cn(styles.cmd, "mb-2 px-3 pt-2")}>{t("channelsLabel")}</div>
                    <ul className={styles.channels}>
                      {channels.map((channel) => (
                        <li key={`${channel.kind}:${channel.href}`}>
                          <a
                            href={channel.href}
                            aria-label={`${t(channel.kind)} ${channel.value}`}
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
                      <li>
                        <div>
                          <span className={styles.meta} style={{ direction: "inherit" }}>
                            {t("address")}
                          </span>
                          <span>{COMPANY_ADDRESS[locale]}</span>
                        </div>
                      </li>
                    </ul>
                  </div>
                ) : null}

                {socials.length > 0 ? (
                  <div data-reveal className="mt-8">
                    <div className={styles.cmd}>{t("socialLabel")}</div>
                    <SocialLinks socials={socials} />
                  </div>
                ) : null}

                <div data-reveal className={cn(styles.glass, "mt-8 p-5")}>
                  <span className={styles.meta} style={{ direction: "inherit" }}>
                    {t("responseLabel")}
                  </span>
                  <p className="mt-2 text-body">{t("response")}</p>
                </div>
              </div>
            </div>
          </Container>
        </Section>
      </Reveal>
    </>
  );
}
