import { cache } from "react";
import { sanityFetch } from "@cms/lib/fetch";
import { cacheTags } from "@cms/lib/tags";
import {
  aboutPageQuery,
  contactPageQuery,
  homepageQuery,
  legalPageQuery,
  productsQuery,
  projectBySlugQuery,
  projectSlugsQuery,
  projectsQuery,
  serviceBySlugQuery,
  servicesQuery,
  siteSettingsQuery,
} from "@cms/queries";
import type {
  AboutPage,
  ContactPage,
  Homepage,
  LegalPage,
  ProductSummary,
  Project,
  ProjectSummary,
  Service,
  ServiceSummary,
  SiteSettings,
} from "@cms/types";
import type { Locale } from "@/i18n/routing";

/**
 * The content API used by pages and layouts.
 *
 * Every function returns `null` (or an empty array) when the CMS is not
 * connected, so pages render their placeholder state instead of failing.
 * `cache()` deduplicates identical reads within a single request — the header,
 * footer and page body all ask for site settings, but only one query is sent.
 */

export const getSiteSettings = cache(async (locale: Locale): Promise<SiteSettings | null> =>
  sanityFetch<SiteSettings>({
    query: siteSettingsQuery,
    params: { locale },
    tags: [cacheTags.siteSettings],
  }),
);

export const getHomepage = cache(async (locale: Locale): Promise<Homepage | null> => {
  return sanityFetch<Homepage>({
    query: homepageQuery,
    params: { locale },
    tags: [cacheTags.homepage, cacheTags.products, cacheTags.projects, cacheTags.services],
  });
});

export const getProducts = cache(async (locale: Locale): Promise<ProductSummary[]> => {
  const products = await sanityFetch<ProductSummary[]>({
    query: productsQuery,
    params: { locale },
    tags: [cacheTags.products],
  });
  return products ?? [];
});

export const getProjects = cache(async (locale: Locale): Promise<ProjectSummary[]> => {
  const projects = await sanityFetch<ProjectSummary[]>({
    query: projectsQuery,
    params: { locale },
    tags: [cacheTags.projects],
  });
  return projects ?? [];
});

export const getProject = cache(async (locale: Locale, slug: string): Promise<Project | null> =>
  sanityFetch<Project>({
    query: projectBySlugQuery,
    params: { locale, slug },
    tags: [cacheTags.projects, cacheTags.project(slug)],
  }),
);

export const getProjectSlugs = cache(async (): Promise<string[]> => {
  const rows = await sanityFetch<Array<{ slug: string }>>({
    query: projectSlugsQuery,
    tags: [cacheTags.projects],
  });
  return (rows ?? []).map((row) => row.slug).filter(Boolean);
});

export const getServices = cache(async (locale: Locale): Promise<ServiceSummary[]> => {
  const services = await sanityFetch<ServiceSummary[]>({
    query: servicesQuery,
    params: { locale },
    tags: [cacheTags.services],
  });
  return services ?? [];
});

export const getService = cache(async (locale: Locale, slug: string): Promise<Service | null> =>
  sanityFetch<Service>({
    query: serviceBySlugQuery,
    params: { locale, slug },
    tags: [cacheTags.services, cacheTags.service(slug)],
  }),
);

export const getAboutPage = cache(async (locale: Locale): Promise<AboutPage | null> =>
  sanityFetch<AboutPage>({
    query: aboutPageQuery,
    params: { locale },
    tags: [cacheTags.aboutPage],
  }),
);

export const getContactPage = cache(async (locale: Locale): Promise<ContactPage | null> =>
  sanityFetch<ContactPage>({
    query: contactPageQuery,
    params: { locale },
    tags: [cacheTags.contactPage],
  }),
);

export const getLegalPage = cache(async (locale: Locale, key: string): Promise<LegalPage | null> =>
  sanityFetch<LegalPage>({
    query: legalPageQuery,
    params: { locale, key },
    tags: [cacheTags.legalPages, cacheTags.legalPage(key)],
  }),
);
