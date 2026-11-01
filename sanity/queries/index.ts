import { defineQuery } from "next-sanity";
import {
  ctaFragment,
  imageFragment,
  linkFragment,
  loc,
  locSelf,
  mediaFragment,
  navItemFragment,
  productSummaryFragment,
  projectSummaryFragment,
  sectionHeaderFragment,
  seoFragment,
  serviceSummaryFragment,
  socialLinkFragment,
  statisticFragment,
  testimonialFragment,
} from "./fragments";

/**
 * Every query takes a `$locale` parameter. Queries that also take `$slug` or
 * `$key` document it in their name.
 */

export const siteSettingsQuery = defineQuery(/* groq */ `
  *[_type == "siteSettings"][0]{
    ${loc("siteName")},
    ${loc("tagline")},
    logo ${imageFragment},
    logoMark ${imageFragment},
    favicon ${imageFragment},
    ${loc("defaultSeoTitle")},
    ${loc("defaultSeoDescription")},
    defaultOgImage ${imageFragment},
    email,
    phone,
    whatsapp,
    legalName,
    commercialRegister,
    unifiedCommercialRegister,
    taxRegister,
    ${loc("address")},
    socialLinks[] ${socialLinkFragment},
    primaryNavigation[] ${navItemFragment},
    headerCta ${ctaFragment},
    footerNavigation[] ${navItemFragment},
    ${loc("footerNote")},
    ${loc("copyright")},
    defaultLanguage,
    theme
  }
`);

export const homepageQuery = defineQuery(/* groq */ `
  *[_type == "homepage"][0]{
    ${loc("heroEyebrow")},
    ${loc("heroHeadline")},
    ${loc("heroSubheading")},
    heroCta ${ctaFragment},
    "introLines": introLines[] { ${locSelf("value")} }.value,
    ${loc("introSupport")},
    productsHeader ${sectionHeaderFragment},
    "products": select(
      count(products) > 0 => products[]-> ${productSummaryFragment},
      *[_type == "product" && featured == true] | order(sortOrder asc)[0...6] ${productSummaryFragment}
    ),
    capabilities{
      header ${sectionHeaderFragment},
      "services": select(
        count(services) > 0 => services[]-> ${serviceSummaryFragment},
        *[_type == "service"] | order(sortOrder asc)[0...8] ${serviceSummaryFragment}
      ),
      cta ${ctaFragment}
    },
    process{
      header ${sectionHeaderFragment},
      steps[]{
        ${loc("title")},
        ${loc("description")}
      }
    },
    aboutPreview{
      header ${sectionHeaderFragment},
      ${loc("body")},
      media ${mediaFragment},
      cta ${ctaFragment}
    },
    closingCta{
      ${loc("eyebrow")},
      ${loc("headline")},
      ${loc("body")},
      cta ${ctaFragment}
    },
    seo ${seoFragment}
  }
`);

export const pricingPageQuery = defineQuery(/* groq */ `
  *[_type == "pricingPage"][0]{
    ${loc("eyebrow")},
    ${loc("headline")},
    ${loc("lead")},
    ${loc("servicesNote")},
    ${loc("note")},
    serviceFloors[]{ key, amount },
    engagements[]{ key, amount, monthly },
    seo ${seoFragment}
  }
`);

export const productsQuery = defineQuery(/* groq */ `
  *[_type == "product" && defined(slug.current)] | order(sortOrder asc) ${productSummaryFragment}
`);

export const projectsQuery = defineQuery(/* groq */ `
  *[_type == "project" && defined(slug.current)]
    | order(sortOrder asc, publishedAt desc) ${projectSummaryFragment}
`);

export const projectSlugsQuery = defineQuery(/* groq */ `
  *[_type == "project" && defined(slug.current)]{ "slug": slug.current }
`);

export const projectBySlugQuery = defineQuery(/* groq */ `
  *[_type == "project" && slug.current == $slug][0]{
    _id,
    "slug": slug.current,
    ${loc("name")},
    client,
    ${loc("industry")},
    year,
    ${loc("shortDescription")},
    ${loc("introduction")},
    coverImage ${imageFragment},
    coverVideo ${mediaFragment},
    themeColor,
    featured,
    publishedAt,
    services[]->{ _id, ${loc("name")} },
    ${loc("challenge")},
    ${loc("strategy")},
    ${loc("solution")},
    ${loc("experience")},
    gallery[] ${mediaFragment},
    videoGallery[] ${mediaFragment},
    results[]{
      ${loc("title")},
      ${loc("description")},
      metric ${statisticFragment}
    },
    statistics[] ${statisticFragment},
    testimonial ${testimonialFragment},
    "relatedProjects": select(
      count(relatedProjects) > 0 => relatedProjects[]-> ${projectSummaryFragment},
      *[_type == "project" && slug.current != $slug] | order(sortOrder asc)[0...3] ${projectSummaryFragment}
    ),
    seo ${seoFragment}
  }
`);

export const servicesQuery = defineQuery(/* groq */ `
  *[_type == "service" && defined(slug.current)] | order(sortOrder asc) ${serviceSummaryFragment}
`);

export const serviceSlugsQuery = defineQuery(/* groq */ `
  *[_type == "service" && defined(slug.current)]{ "slug": slug.current }
`);

export const serviceBySlugQuery = defineQuery(/* groq */ `
  *[_type == "service" && slug.current == $slug][0]{
    _id,
    "slug": slug.current,
    ${loc("name")},
    ${loc("shortDescription")},
    ${loc("fullDescription")},
    "deliverables": deliverables[]{ ${loc("@", "value")} }.value,
    icon ${imageFragment},
    featuredMedia ${mediaFragment},
    relatedProjects[]-> ${projectSummaryFragment},
    seo ${seoFragment}
  }
`);

export const aboutPageQuery = defineQuery(/* groq */ `
  *[_type == "aboutPage"][0]{
    ${loc("eyebrow")},
    ${loc("headline")},
    ${loc("lead")},
    "storyParagraphs": storyParagraphs[] { ${locSelf("value")} }.value,
    "milestones": milestones[] { ${locSelf("value")} }.value,
    ${loc("principlesLabel")},
    ${loc("intro")},
    ${loc("story")},
    ${loc("philosophy")},
    values[]{
      ${loc("title")},
      ${loc("description")}
    },
    statistics[] ${statisticFragment},
    ${loc("closingStatement")},
    closingCta ${ctaFragment},
    team{
      header ${sectionHeaderFragment},
      members[]{
        name,
        ${loc("role")},
        photo ${imageFragment},
        ${loc("bio")},
        links[] ${socialLinkFragment}
      }
    },
    images[] ${mediaFragment},
    seo ${seoFragment}
  }
`);

export const contactPageQuery = defineQuery(/* groq */ `
  *[_type == "contactPage"][0]{
    ${loc("eyebrow")},
    ${loc("headline")},
    ${loc("supportingText")},
    contactMethods[]{
      kind,
      ${loc("label")},
      value,
      href
    },
    offices[]{
      ${loc("name")},
      ${loc("address")},
      ${loc("city")},
      ${loc("country")},
      mapUrl,
      timezone
    },
    formLabels{
      ${loc("name")},
      ${loc("email")},
      ${loc("company")},
      ${loc("budget")},
      ${loc("message")},
      ${loc("submit")},
      ${loc("sending")},
      ${loc("required")},
      ${loc("invalidEmail")},
      ${loc("genericError")}
    },
    ${loc("successMessage")},
    ${loc("privacyNote")},
    seo ${seoFragment}
  }
`);

export const legalPageQuery = defineQuery(/* groq */ `
  *[_type == "legalPage" && key == $key][0]{
    key,
    ${loc("title")},
    ${loc("summary")},
    ${loc("body")},
    lastUpdated,
    seo ${seoFragment}
  }
`);

export { linkFragment };
