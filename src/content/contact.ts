import type { SiteSettings } from "@cms/types";
import { env } from "@/lib/env";
import { whatsappHref } from "@/lib/links";

export type ChannelKind = "email" | "phone" | "whatsapp";

export interface Channel {
  kind: ChannelKind;
  /** What the visitor reads — the address or number itself. */
  value: string;
  href: string;
  external: boolean;
}

/**
 * The company's real address, as a last fallback.
 *
 * Here rather than only in `.env.example` because it is not a deployment
 * setting — it is the same address on every environment, and a site that hides
 * its own email until someone remembers a variable is worse than one that
 * hard-codes it. An environment variable still overrides it.
 */
export const CONTACT_EMAIL = "info@codex-tech.ai";

/** The public phone. Same number answers WhatsApp. */
export const CONTACT_PHONE = "+201555399054";
export const CONTACT_WHATSAPP = CONTACT_PHONE;

/**
 * The registered company, as filed — not a marketing name.
 *
 * Shown under the mark in the footer. The legal name stays Arabic in every
 * locale because that is the name on the register; only the labels translate.
 */
export const LEGAL_ENTITY = {
  name: "كودكس تك لخدمات البرمجة",
  commercialRegister: "233557",
  unifiedCommercialRegister: "102200000233557",
  taxRegister: "780289099",
} as const;

/** Public seat of the company. The legal name stays Arabic; the city does not. */
export const COMPANY_ADDRESS = {
  ar: "القاهرة، مصر",
  en: "Cairo, Egypt",
} as const;

export interface Social {
  /** Matches the CMS platform list; used as a stable key. */
  platform: string;
  label: string;
  url: string;
}

/**
 * The public accounts.
 *
 * Share-style Facebook URLs are what the page hands out, so that is what is
 * stored. Tracking parameters (`mibextid`, `igsi`) are stripped: they identify
 * the person who copied the link, not the destination.
 */
const SOCIALS: readonly Social[] = [
  {
    platform: "instagram",
    label: "Instagram",
    url: "https://www.instagram.com/codexx.tech/",
  },
  {
    platform: "facebook",
    label: "Facebook",
    url: "https://www.facebook.com/share/1GRVBBeKeu/",
  },
] as const;

/** Fallback labels for CMS entries saved without a label override. */
const PLATFORM_LABELS: Record<string, string> = {
  instagram: "Instagram",
  facebook: "Facebook",
  x: "X",
  linkedin: "LinkedIn",
  behance: "Behance",
  dribbble: "Dribbble",
  github: "GitHub",
  youtube: "YouTube",
  tiktok: "TikTok",
};

/**
 * The social accounts, CMS first.
 *
 * The CMS list replaces this one wholesale rather than merging with it — a
 * half-overridden list is impossible to reason about from the Studio, where you
 * can only see what you typed.
 */
export function resolveSocials(settings: SiteSettings | null | undefined): Social[] {
  const fromCms = settings?.socialLinks?.map((link) => ({
    platform: link.platform,
    label: link.label ?? PLATFORM_LABELS[link.platform] ?? link.platform,
    url: link.url,
  }));

  return fromCms && fromCms.length > 0 ? fromCms : [...SOCIALS];
}

/**
 * The contact channels, in the order they are shown.
 *
 * Three sources, one shape: Site Settings wins when the CMS is connected,
 * environment variables come next, and the constants above are the floor. A
 * channel with no value in any of them is absent from the list rather than
 * rendered empty — the site never shows a number that nobody is answering.
 */
export function resolveChannels(settings: SiteSettings | null | undefined): Channel[] {
  const email = settings?.email ?? env.contact.email ?? CONTACT_EMAIL;
  const phone = settings?.phone ?? env.contact.phone ?? CONTACT_PHONE;
  const whatsapp = settings?.whatsapp ?? env.contact.whatsapp ?? CONTACT_WHATSAPP;

  const channels: Channel[] = [];

  if (email) {
    channels.push({ kind: "email", value: email, href: `mailto:${email}`, external: true });
  }

  if (phone) {
    channels.push({
      kind: "phone",
      value: phone,
      href: `tel:${phone.replace(/[^\d+]/g, "")}`,
      external: true,
    });
  }

  if (whatsapp) {
    channels.push({
      kind: "whatsapp",
      value: whatsapp,
      href: whatsappHref(whatsapp),
      external: true,
    });
  }

  return channels;
}

/** The address used for a plain `mailto:` link. */
export function resolveEmail(settings: SiteSettings | null | undefined): string {
  return settings?.email ?? env.contact.email ?? CONTACT_EMAIL;
}
