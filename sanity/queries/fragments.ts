import { baseLanguage, supportedLanguages } from "../schemas/locale/languages";

/**
 * GROQ building blocks.
 *
 * Localization is resolved inside the query: every localized field collapses
 * to a plain value for `$locale`, falling back to the default language when a
 * translation is missing. Components therefore never see locale objects, and
 * the payload carries one language instead of all of them.
 */

/**
 * Projects a localized field down to a single string.
 *
 * GROQ cannot look up an object attribute from a variable — `name[$locale]`
 * is not dynamic property access — so each language gets an explicit branch:
 *
 *   "name": select($locale == "ar" => coalesce(name.ar, name.en), name.en)
 *
 * Branches are generated from `supportedLanguages`, so adding a language
 * never means editing a query.
 */
export function loc(field: string, alias = field.split(".").pop() ?? field): string {
  const fallback = `${field}.${baseLanguage.id}`;
  const branches = supportedLanguages
    .filter((language) => !language.isDefault)
    .map(
      (language) => `$locale == "${language.id}" => coalesce(${field}.${language.id}, ${fallback})`,
    );

  return `"${alias}": select(${[...branches, fallback].join(", ")})`;
}

/**
 * The same projection as `loc()`, but for an array whose *items* are locale
 * objects rather than a named localized field.
 *
 * Used inside `array[]{ ... }`, where the scope is already the locale object,
 * so the language keys are read as bare attributes.
 */
export function locSelf(alias: string): string {
  const fallback = baseLanguage.id;
  const branches = supportedLanguages
    .filter((language) => !language.isDefault)
    .map((language) => `$locale == "${language.id}" => coalesce(${language.id}, ${fallback})`);

  return `"${alias}": select(${[...branches, fallback].join(", ")})`;
}

export const imageFragment = /* groq */ `{
  ...,
  "lqip": asset->metadata.lqip,
  "dimensions": asset->metadata.dimensions
}`;

export const mediaFragment = /* groq */ `{
  kind,
  aspectRatio,
  ${loc("alt")},
  ${loc("caption")},
  image ${imageFragment},
  poster ${imageFragment},
  "videoUrl": coalesce(videoUrl, videoFile.asset->url)
}`;

export const linkFragment = /* groq */ `{
  ${loc("label")},
  kind,
  route,
  anchor,
  href,
  newTab
}`;

export const ctaFragment = /* groq */ `{
  ${loc("label")},
  kind,
  route,
  anchor,
  href,
  newTab,
  variant
}`;

export const navItemFragment = /* groq */ `{
  ${loc("label")},
  kind,
  route,
  anchor,
  href,
  newTab,
  children[] ${linkFragment}
}`;

export const seoFragment = /* groq */ `{
  ${loc("title")},
  ${loc("description")},
  ogImage ${imageFragment},
  keywords,
  noIndex
}`;

export const statisticFragment = /* groq */ `{
  value,
  prefix,
  suffix,
  ${loc("label")}
}`;

export const sectionHeaderFragment = /* groq */ `{
  ${loc("eyebrow")},
  ${loc("headline")},
  ${loc("intro")}
}`;

export const socialLinkFragment = /* groq */ `{
  platform,
  label,
  url
}`;

export const projectSummaryFragment = /* groq */ `{
  _id,
  "slug": slug.current,
  ${loc("name")},
  client,
  ${loc("industry")},
  year,
  ${loc("shortDescription")},
  coverImage ${imageFragment},
  coverVideo ${mediaFragment},
  themeColor,
  featured,
  services[]->{ _id, ${loc("name")} }
}`;

export const productSummaryFragment = /* groq */ `{
  _id,
  key,
  "slug": slug.current,
  ${loc("name")},
  ${loc("audience")},
  ${loc("category")},
  ${loc("tagline")},
  ${loc("description")},
  "capabilities": capabilities[] { ${locSelf("value")} }.value,
  status,
  logo ${imageFragment},
  cover ${mediaFragment},
  accentColor,
  url,
  featured
}`;

export const serviceSummaryFragment = /* groq */ `{
  _id,
  key,
  "slug": slug.current,
  ${loc("name")},
  ${loc("shortDescription")},
  ${loc("detail")},
  "deliverables": deliverables[] { ${locSelf("value")} }.value,
  icon ${imageFragment}
}`;

export const testimonialFragment = /* groq */ `{
  ${loc("quote")},
  authorName,
  ${loc("authorRole")},
  company,
  avatar ${imageFragment}
}`;
