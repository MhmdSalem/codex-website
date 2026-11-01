import type { SchemaTypeDefinition } from "sanity";

import { aboutPage } from "./documents/aboutPage";
import { contactPage } from "./documents/contactPage";
import { homepage } from "./documents/homepage";
import { legalPage } from "./documents/legalPage";
import { pricingPage } from "./documents/pricingPage";
import { product } from "./documents/product";
import { project } from "./documents/project";
import { service } from "./documents/service";
import { siteSettings } from "./documents/siteSettings";

import { contactTypes } from "./objects/contact";
import { contentTypes } from "./objects/content";
import { localeTypes } from "./objects/locale";
import { media } from "./objects/media";
import { navigationTypes } from "./objects/navigation";
import { sectionTypes } from "./objects/sections";
import { seo } from "./objects/seo";

/** Documents an editor can create freely. */
export const collectionDocumentTypes = ["product", "project", "service"] as const;

/** Documents that must exist exactly once. */
export const singletonDocumentTypes = [
  "siteSettings",
  "homepage",
  "aboutPage",
  "contactPage",
  "pricingPage",
] as const;

export type SingletonDocumentType = (typeof singletonDocumentTypes)[number];

export const documentTypes: SchemaTypeDefinition[] = [
  siteSettings,
  homepage,
  product,
  project,
  service,
  aboutPage,
  contactPage,
  pricingPage,
  legalPage,
];

export const objectTypes: SchemaTypeDefinition[] = [
  ...localeTypes,
  media,
  seo,
  ...navigationTypes,
  ...contentTypes,
  ...contactTypes,
  ...sectionTypes,
];

export const schemaTypes: SchemaTypeDefinition[] = [...documentTypes, ...objectTypes];
