/**
 * The single place where the site's languages are declared for the CMS.
 *
 * Localization is field-level: one document holds every language, so media,
 * ordering, references and theme values are never duplicated between locales.
 * Adding a language is a one-line change here — every `locale*` field type is
 * generated from this list.
 */
export const supportedLanguages = [
  { id: "en", title: "English", isDefault: true },
  { id: "ar", title: "العربية — Arabic", isDefault: false },
] as const;

export type SupportedLanguage = (typeof supportedLanguages)[number];
export type SupportedLanguageId = SupportedLanguage["id"];

export const baseLanguage: SupportedLanguage = supportedLanguages[0];

export const languageIds: readonly SupportedLanguageId[] = supportedLanguages.map(
  (language) => language.id,
);
