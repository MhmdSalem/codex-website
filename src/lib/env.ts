import { z } from "zod";

/**
 * Environment access is centralised and validated here.
 *
 * Nothing in this file throws. A missing Sanity project must degrade to
 * placeholder content rather than break the build, so the CMS-related values
 * are optional and callers check `isSanityConfigured` before fetching.
 */

/** Treat empty strings as absent so `.default()` can take over. */
const optional = (value: string | undefined): string | undefined =>
  value && value.trim().length > 0 ? value.trim() : undefined;

const publicSchema = z.object({
  siteUrl: z.url().default("http://localhost:3000"),
  sanityProjectId: z
    .string()
    .regex(/^[a-z0-9-]+$/, "Invalid Sanity project id")
    .optional(),
  sanityDataset: z.string().min(1).default("production"),
  sanityApiVersion: z.string().min(1).default("2026-07-27"),
  /*
    Public contact channels.

    Optional on purpose: an address nobody reads is worse than no address, so an
    unset value hides the channel instead of rendering a dead `mailto:`. Site
    Settings in the CMS takes precedence over both when it is connected.
  */
  contactEmail: z.email().optional(),
  contactPhone: z.string().min(4).optional(),
  contactWhatsapp: z.string().min(4).optional(),
});

// NEXT_PUBLIC_* variables must be referenced statically to be inlined.
const parsedPublic = publicSchema.safeParse({
  siteUrl: optional(process.env.NEXT_PUBLIC_SITE_URL),
  sanityProjectId: optional(process.env.NEXT_PUBLIC_SANITY_PROJECT_ID),
  sanityDataset: optional(process.env.NEXT_PUBLIC_SANITY_DATASET),
  sanityApiVersion: optional(process.env.NEXT_PUBLIC_SANITY_API_VERSION),
  contactEmail: optional(process.env.NEXT_PUBLIC_CONTACT_EMAIL),
  contactPhone: optional(process.env.NEXT_PUBLIC_CONTACT_PHONE),
  contactWhatsapp: optional(process.env.NEXT_PUBLIC_CONTACT_WHATSAPP),
});

if (!parsedPublic.success && process.env.NODE_ENV !== "production") {
  console.warn(
    "[env] Invalid public environment variables:",
    z.flattenError(parsedPublic.error).fieldErrors,
  );
}

const publicEnv = parsedPublic.success
  ? parsedPublic.data
  : publicSchema.parse({ sanityProjectId: undefined });

export const env = {
  siteUrl: publicEnv.siteUrl.replace(/\/$/, ""),
  sanity: {
    projectId: publicEnv.sanityProjectId,
    dataset: publicEnv.sanityDataset,
    apiVersion: publicEnv.sanityApiVersion,
  },
  contact: {
    email: publicEnv.contactEmail,
    phone: publicEnv.contactPhone,
    whatsapp: publicEnv.contactWhatsapp,
  },
} as const;

/**
 * Server-only secrets. Read lazily so they are never bundled for the client.
 */
export const serverEnv = {
  get sanityReadToken() {
    return optional(process.env.SANITY_API_READ_TOKEN);
  },
  get revalidateSecret() {
    return optional(process.env.SANITY_REVALIDATE_SECRET);
  },
  get previewSecret() {
    return optional(process.env.SANITY_PREVIEW_SECRET);
  },
  /** Resend API key. Without it the contact form reports a delivery failure. */
  get resendApiKey() {
    return optional(process.env.RESEND_API_KEY);
  },
  /** Where enquiries are delivered. Falls back to the public contact address. */
  get enquiryRecipient() {
    return optional(process.env.CONTACT_RECIPIENT) ?? env.contact.email;
  },
  /**
   * The `From` address. Must be on a domain verified with Resend, which is why
   * it is a separate value from the address visitors are shown.
   */
  get enquirySender() {
    return optional(process.env.CONTACT_SENDER);
  },
} as const;

/** True once a real Sanity project id is present. */
export const isSanityConfigured = Boolean(env.sanity.projectId);

/**
 * Sanity's config objects reject an empty project id, so the Studio and client
 * fall back to a syntactically valid placeholder. Requests made with it are
 * never sent — `isSanityConfigured` short-circuits first.
 */
export const sanityProjectId = env.sanity.projectId ?? "placeholder";

export const isProduction = process.env.NODE_ENV === "production";
