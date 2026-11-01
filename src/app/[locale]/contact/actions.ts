"use server";

import { getTranslations } from "next-intl/server";
import { z } from "zod";

import { CONTACT_EMAIL } from "@/content/contact";
import { locales, type Locale } from "@/i18n/routing";
import { serverEnv } from "@/lib/env";

import type { EnquiryState } from "./enquiry";

/**
 * The contact form's server half.
 *
 * Validation, then delivery. Nothing is stored: an enquiry is an email, and
 * keeping a copy of it in a database we would also have to secure and empty is a
 * liability rather than a feature.
 */

const TOPICS = ["product", "existing", "ai", "other"] as const;

const schema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.email().max(200),
  company: z.string().trim().max(160).optional(),
  topic: z.enum(TOPICS).optional(),
  message: z.string().trim().min(10).max(4000),
});

/** `formData.get` returns `File | string | null`; only strings are of interest. */
function text(data: FormData, key: string): string {
  const value = data.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

export async function submitEnquiry(
  _previous: EnquiryState,
  formData: FormData,
): Promise<EnquiryState> {
  const rawLocale = text(formData, "locale");
  const locale: Locale = isLocale(rawLocale) ? rawLocale : "ar";
  const t = await getTranslations({ locale, namespace: "contact.form" });

  const values = {
    name: text(formData, "name"),
    email: text(formData, "email"),
    company: text(formData, "company"),
    topic: text(formData, "topic"),
    message: text(formData, "message"),
  };

  /*
    A honeypot, not a captcha.

    The field is hidden from people and left empty by them; a bot that fills
    every input in the document fills this one too. Answering `sent` rather than
    an error is deliberate — a rejection tells the sender what to change.
  */
  if (text(formData, "website").length > 0) {
    return { status: "sent" };
  }

  const parsed = schema.safeParse(values);

  if (!parsed.success) {
    const fields = z.flattenError(parsed.error).fieldErrors;

    return {
      status: "error",
      values,
      errors: {
        ...(fields.name ? { name: t("errors.name") } : {}),
        ...(fields.email ? { email: t("errors.email") } : {}),
        ...(fields.message ? { message: t("errors.message") } : {}),
      },
    };
  }

  const delivered = await deliver(parsed.data, locale);

  if (!delivered) {
    return { status: "error", values, message: t("errors.failed") };
  }

  return { status: "sent" };
}

type Enquiry = z.infer<typeof schema>;

/**
 * Hands the enquiry to Resend.
 *
 * Called over `fetch` rather than through the SDK: it is one POST to one
 * endpoint, and a dependency for that is a dependency to keep updated. Returns
 * `false` on any failure — including no API key at all — so the form can offer
 * the direct address instead of silently swallowing the message.
 */
async function deliver(enquiry: Enquiry, locale: Locale): Promise<boolean> {
  const apiKey = serverEnv.resendApiKey;
  const to = serverEnv.enquiryRecipient ?? CONTACT_EMAIL;
  const from = serverEnv.enquirySender;

  if (!apiKey || !to || !from) {
    if (process.env.NODE_ENV !== "production") {
      console.warn("[contact] Enquiry not delivered — email delivery is not configured.", enquiry);
    }
    return false;
  }

  const lines = [
    `Name:    ${enquiry.name}`,
    `Email:   ${enquiry.email}`,
    enquiry.company ? `Company: ${enquiry.company}` : null,
    enquiry.topic ? `Topic:   ${enquiry.topic}` : null,
    `Locale:  ${locale}`,
    "",
    enquiry.message,
  ].filter((line): line is string => line !== null);

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [to],
        // The visitor's address, so hitting reply in the inbox answers them.
        reply_to: enquiry.email,
        subject: `New enquiry — ${enquiry.name}`,
        text: lines.join("\n"),
      }),
    });

    if (!response.ok) {
      console.error("[contact] Resend rejected the enquiry:", response.status);
      return false;
    }

    return true;
  } catch (error) {
    console.error("[contact] Enquiry delivery failed:", error);
    return false;
  }
}
