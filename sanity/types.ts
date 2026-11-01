import type { PortableTextBlock } from "@portabletext/types";

/**
 * Shapes returned by the GROQ projections in `sanity/queries`.
 *
 * Localized fields are resolved inside GROQ with `coalesce(field[$locale],
 * field.en)`, so everything below is already a plain value for the requested
 * language — components never deal with locale objects.
 *
 * Hand-written for now. Once a Sanity project exists, `npm run sanity:schema
 * && npm run sanity:typegen` can generate these from the real schema.
 */

export interface SanityImage {
  _type?: "image";
  asset?: { _ref: string; _type: "reference" };
  hotspot?: { x: number; y: number; height: number; width: number };
  crop?: { top: number; bottom: number; left: number; right: number };
  /** Base64 low-quality placeholder from asset metadata. */
  lqip?: string | null;
  dimensions?: { width: number; height: number; aspectRatio: number } | null;
}

export type MediaKind = "image" | "video";
export type MediaAspectRatio = "auto" | "16/9" | "4/3" | "1/1" | "3/4" | "9/16";

export interface SanityMedia {
  kind: MediaKind;
  image: SanityImage | null;
  poster: SanityImage | null;
  videoUrl: string | null;
  alt: string | null;
  caption: string | null;
  aspectRatio: MediaAspectRatio | null;
}

export type LinkKind = "route" | "external" | "email" | "phone";
export type CtaVariant = "primary" | "outline" | "text";

export interface SanityLink {
  label: string | null;
  kind: LinkKind | null;
  route: string | null;
  anchor: string | null;
  href: string | null;
  newTab: boolean | null;
}

export interface SanityCta extends SanityLink {
  variant: CtaVariant | null;
}

export interface SanityNavItem extends SanityLink {
  children: SanityLink[] | null;
}

export interface SanitySocialLink {
  platform: string;
  label: string | null;
  url: string;
}

export interface SanitySeo {
  title: string | null;
  description: string | null;
  ogImage: SanityImage | null;
  keywords: string[] | null;
  noIndex: boolean | null;
}

export interface SanityStatistic {
  value: string;
  prefix: string | null;
  suffix: string | null;
  label: string | null;
}

export interface SanityTestimonial {
  quote: string | null;
  authorName: string | null;
  authorRole: string | null;
  company: string | null;
  avatar: SanityImage | null;
}

export interface SanityProcessStep {
  title: string | null;
  description: string | null;
}

export interface SanityValueItem {
  title: string | null;
  description: string | null;
}

export interface SanityTeamMember {
  name: string;
  role: string | null;
  photo: SanityImage | null;
  bio: string | null;
  links: SanitySocialLink[] | null;
}

export interface SanityResultItem {
  title: string | null;
  description: string | null;
  metric: SanityStatistic | null;
}

export interface SanitySectionHeader {
  eyebrow: string | null;
  headline: string | null;
  intro: string | null;
}

// ─── Site settings ──────────────────────────────────────────────────────────

export interface SanityThemeSettings {
  accentColor: string | null;
  enableSmoothScroll: boolean | null;
  enableCustomCursor: boolean | null;
  enablePageTransitions: boolean | null;
}

export interface SiteSettings {
  siteName: string | null;
  tagline: string | null;
  logo: SanityImage | null;
  logoMark: SanityImage | null;
  favicon: SanityImage | null;
  defaultSeoTitle: string | null;
  defaultSeoDescription: string | null;
  defaultOgImage: SanityImage | null;
  email: string | null;
  phone: string | null;
  whatsapp: string | null;
  legalName: string | null;
  commercialRegister: string | null;
  unifiedCommercialRegister: string | null;
  taxRegister: string | null;
  address: string | null;
  socialLinks: SanitySocialLink[] | null;
  primaryNavigation: SanityNavItem[] | null;
  headerCta: SanityCta | null;
  footerNavigation: SanityNavItem[] | null;
  footerNote: string | null;
  copyright: string | null;
  defaultLanguage: string | null;
  theme: SanityThemeSettings | null;
}

// ─── Homepage ───────────────────────────────────────────────────────────────

export type HomeSectionKey =
  | "hero"
  | "intro"
  | "products"
  | "featuredProjects"
  | "capabilities"
  | "process"
  | "statistics"
  | "aboutPreview"
  | "closingCta";

export interface HomeSectionToggle {
  key: HomeSectionKey;
  enabled: boolean | null;
}

export interface Homepage {
  heroEyebrow: string | null;
  heroHeadline: string | null;
  heroSubheading: string | null;
  heroCta: SanityCta | null;
  introLines: string[] | null;
  introSupport: string | null;
  productsHeader: SanitySectionHeader | null;
  products: ProductSummary[] | null;
  capabilities: {
    header: SanitySectionHeader | null;
    services: ServiceSummary[] | null;
    cta: SanityCta | null;
  } | null;
  process: {
    header: SanitySectionHeader | null;
    steps: SanityProcessStep[] | null;
  } | null;
  aboutPreview: {
    header: SanitySectionHeader | null;
    body: PortableTextBlock[] | null;
    media: SanityMedia | null;
    cta: SanityCta | null;
  } | null;
  closingCta: {
    eyebrow: string | null;
    headline: string | null;
    body: string | null;
    cta: SanityCta | null;
  } | null;
  seo: SanitySeo | null;
}

// ─── Pricing ────────────────────────────────────────────────────────────────

export interface PricingPage {
  eyebrow: string | null;
  headline: string | null;
  lead: string | null;
  servicesNote: string | null;
  note: string | null;
  serviceFloors: Array<{ key: string; amount: number | null }> | null;
  engagements: Array<{ key: string; amount: number | null; monthly: boolean | null }> | null;
  seo: SanitySeo | null;
}

// ─── Products ───────────────────────────────────────────────────────────────

/** Software CODEX TECH owns and operates, as opposed to client work. */
export interface ProductSummary {
  _id: string;
  key: "accreditation" | "daawa" | null;
  slug: string;
  name: string | null;
  audience: string | null;
  category: string | null;
  tagline: string | null;
  description: string | null;
  capabilities: string[] | null;
  status: "live" | "development" | null;
  logo: SanityImage | null;
  cover: SanityMedia | null;
  accentColor: string | null;
  url: string | null;
  featured: boolean | null;
}

// ─── Projects ───────────────────────────────────────────────────────────────

export interface ProjectSummary {
  _id: string;
  slug: string;
  name: string | null;
  client: string | null;
  industry: string | null;
  year: number | null;
  shortDescription: string | null;
  coverImage: SanityImage | null;
  coverVideo: SanityMedia | null;
  themeColor: string | null;
  featured: boolean | null;
  services: Array<{ _id: string; name: string | null }> | null;
}

export interface Project extends ProjectSummary {
  introduction: PortableTextBlock[] | null;
  challenge: PortableTextBlock[] | null;
  strategy: PortableTextBlock[] | null;
  solution: PortableTextBlock[] | null;
  experience: PortableTextBlock[] | null;
  gallery: SanityMedia[] | null;
  videoGallery: SanityMedia[] | null;
  results: SanityResultItem[] | null;
  statistics: SanityStatistic[] | null;
  testimonial: SanityTestimonial | null;
  relatedProjects: ProjectSummary[] | null;
  publishedAt: string | null;
  seo: SanitySeo | null;
}

// ─── Services ───────────────────────────────────────────────────────────────

export interface ServiceSummary {
  _id: string;
  key: string | null;
  slug: string;
  name: string | null;
  shortDescription: string | null;
  detail: string | null;
  deliverables: string[] | null;
  icon: SanityImage | null;
}

export interface Service extends ServiceSummary {
  fullDescription: PortableTextBlock[] | null;
  featuredMedia: SanityMedia | null;
  relatedProjects: ProjectSummary[] | null;
  seo: SanitySeo | null;
}

// ─── About ──────────────────────────────────────────────────────────────────

export interface AboutPage {
  eyebrow: string | null;
  headline: string | null;
  lead: string | null;
  storyParagraphs: string[] | null;
  milestones: string[] | null;
  principlesLabel: string | null;
  intro: PortableTextBlock[] | null;
  story: PortableTextBlock[] | null;
  philosophy: PortableTextBlock[] | null;
  values: SanityValueItem[] | null;
  statistics: SanityStatistic[] | null;
  closingStatement: string | null;
  closingCta: SanityCta | null;
  team: {
    header: SanitySectionHeader | null;
    members: SanityTeamMember[] | null;
  } | null;
  images: SanityMedia[] | null;
  seo: SanitySeo | null;
}

// ─── Contact ────────────────────────────────────────────────────────────────

export type ContactMethodKind = "email" | "phone" | "whatsapp" | "other";

export interface SanityContactMethod {
  kind: ContactMethodKind;
  label: string | null;
  value: string;
  href: string | null;
}

export interface SanityOffice {
  name: string | null;
  address: string | null;
  city: string | null;
  country: string | null;
  mapUrl: string | null;
  timezone: string | null;
}

export interface SanityFormLabels {
  name: string | null;
  email: string | null;
  company: string | null;
  budget: string | null;
  message: string | null;
  submit: string | null;
  sending: string | null;
  required: string | null;
  invalidEmail: string | null;
  genericError: string | null;
}

export interface ContactPage {
  eyebrow: string | null;
  headline: string | null;
  supportingText: string | null;
  contactMethods: SanityContactMethod[] | null;
  offices: SanityOffice[] | null;
  formLabels: SanityFormLabels | null;
  successMessage: string | null;
  privacyNote: string | null;
  seo: SanitySeo | null;
}

// ─── Legal ──────────────────────────────────────────────────────────────────

export interface LegalPage {
  key: string;
  title: string | null;
  summary: string | null;
  body: PortableTextBlock[] | null;
  lastUpdated: string | null;
  seo: SanitySeo | null;
}

export type { PortableTextBlock };
