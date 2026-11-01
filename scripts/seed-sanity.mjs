/**
 * Seeds the dashboard with the site's current copy.
 *
 * Reads messages/en.json and messages/ar.json and writes the matching Sanity
 * documents — site settings, homepage, the two products, the six services,
 * the about page and the pricing page — so the Studio opens already filled in
 * and an editor changes text instead of typing it from scratch.
 *
 * Safe to re-run: documents are created if missing and left alone if they
 * already exist (pass --overwrite to replace them).
 *
 * Usage:
 *   SANITY_API_WRITE_TOKEN=... npm run sanity:seed
 *   SANITY_API_WRITE_TOKEN=... npm run sanity:seed -- --overwrite
 *
 * Needs NEXT_PUBLIC_SANITY_PROJECT_ID and NEXT_PUBLIC_SANITY_DATASET in the
 * environment (or .env.local), and a token with Editor rights from
 * https://www.sanity.io/manage → project → API → Tokens.
 */
import { readFileSync, existsSync } from "node:fs";
import { createClient } from "@sanity/client";

loadDotEnvLocal();

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const token = process.env.SANITY_API_WRITE_TOKEN;
const overwrite = process.argv.includes("--overwrite");

if (!projectId || !token) {
  console.error(
    "Set NEXT_PUBLIC_SANITY_PROJECT_ID and SANITY_API_WRITE_TOKEN first (see .env.example).",
  );
  process.exit(1);
}

const client = createClient({ projectId, dataset, token, apiVersion: "2026-07-27", useCdn: false });

const en = JSON.parse(readFileSync(new URL("../messages/en.json", import.meta.url), "utf8"));
const ar = JSON.parse(readFileSync(new URL("../messages/ar.json", import.meta.url), "utf8"));

/** A localised string or paragraph: one key per language. */
const loc = (path) => ({ en: get(en, path), ar: get(ar, path) });
/** A list of localised strings, for array fields. */
const locList = (paths) =>
  paths.map((path) => ({ _type: "localeString", _key: key(path), ...loc(path) }));
const locTextList = (paths) =>
  paths.map((path) => ({ _type: "localeText", _key: key(path), ...loc(path) }));

const SERVICES = [
  "webPlatforms",
  "aiSolutions",
  "mobileApps",
  "dataAnalytics",
  "automation",
  "integrations",
];
const PRODUCTS = ["accreditation", "daawa"];
const PROCESS = ["discover", "design", "develop", "launch"];
const PRINCIPLES = ["products", "engineering", "bilingual", "after"];

const documents = [
  {
    _id: "siteSettings",
    _type: "siteSettings",
    siteName: loc("meta.siteName"),
    tagline: loc("footer.tagline"),
    defaultSeoTitle: loc("meta.defaultTitle"),
    defaultSeoDescription: loc("meta.defaultDescription"),
    legalName: "كودكس تك لخدمات البرمجة",
    commercialRegister: "233557",
    unifiedCommercialRegister: "102200000233557",
    taxRegister: "780289099",
    address: { en: "Cairo, Egypt", ar: "القاهرة، مصر" },
  },
  {
    _id: "homepage",
    _type: "homepage",
    heroEyebrow: loc("home.eyebrow"),
    heroHeadline: loc("home.headline"),
    heroSubheading: loc("home.subheading"),
    introLines: locList([
      "home.intro.lineOne",
      "home.intro.lineTwo",
      "home.intro.lineThree",
      "home.intro.lineFour",
    ]),
    introSupport: loc("home.intro.support"),
    productsHeader: header("home.productsSection"),
    capabilities: { _type: "capabilitiesSection", header: header("home.servicesSection") },
    process: {
      _type: "processSection",
      header: header("home.processSection"),
      steps: PROCESS.map((id) => ({
        _type: "processStep",
        _key: id,
        title: loc(`catalog.process.${id}.title`),
        description: loc(`catalog.process.${id}.body`),
      })),
    },
    aboutPreview: {
      _type: "aboutPreviewSection",
      header: {
        _type: "sectionHeader",
        eyebrow: loc("home.company.eyebrow"),
        headline: loc("home.company.headline"),
        intro: loc("home.company.bodyOne"),
      },
    },
    closingCta: {
      _type: "closingCtaSection",
      eyebrow: loc("home.closing.eyebrow"),
      headline: loc("home.closing.headline"),
      body: loc("home.closing.body"),
    },
  },
  ...PRODUCTS.map((id, index) => ({
    _id: `product-${id}`,
    _type: "product",
    key: id,
    name: loc(`catalog.products.${id}.name`),
    slug: { _type: "slug", current: id },
    category: loc(`catalog.products.${id}.tag`),
    tagline: loc(`catalog.products.${id}.summary`),
    description: loc(`catalog.products.${id}.detail`),
    audience: loc(`catalog.products.${id}.audience`),
    capabilities: locList(
      ["a", "b", "c", "d", "e"].map((k) => `catalog.products.${id}.features.${k}`),
    ),
    status: "live",
    featured: true,
    sortOrder: (index + 1) * 10,
  })),
  ...SERVICES.map((id, index) => ({
    _id: `service-${id}`,
    _type: "service",
    key: id,
    name: loc(`catalog.services.${id}.name`),
    slug: { _type: "slug", current: id.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`) },
    shortDescription: loc(`catalog.services.${id}.summary`),
    detail: loc(`catalog.services.${id}.detail`),
    deliverables: locList(["a", "b", "c", "d"].map((k) => `catalog.services.${id}.includes.${k}`)),
    sortOrder: (index + 1) * 10,
  })),
  {
    _id: "aboutPage",
    _type: "aboutPage",
    eyebrow: loc("about.eyebrow"),
    headline: loc("about.headline"),
    lead: loc("about.lead"),
    storyParagraphs: locTextList(["about.story.one", "about.story.two", "about.story.three"]),
    milestones: en.about.log.items.map((item, index) => ({
      _type: "localeString",
      _key: `m${index}`,
      en: item.msg,
      ar: ar.about.log.items[index]?.msg ?? item.msg,
    })),
    principlesLabel: loc("about.principlesLabel"),
    values: PRINCIPLES.map((id) => ({
      _type: "valueItem",
      _key: id,
      title: loc(`about.principles.${id}.title`),
      description: loc(`about.principles.${id}.body`),
    })),
    closingStatement: loc("about.cta.headline"),
  },
  {
    _id: "contactPage",
    _type: "contactPage",
    eyebrow: loc("contact.eyebrow"),
    headline: loc("contact.headline"),
    supportingText: loc("contact.lead"),
  },
  {
    _id: "pricingPage",
    _type: "pricingPage",
    eyebrow: loc("pricing.eyebrow"),
    headline: loc("pricing.headline"),
    lead: loc("pricing.lead"),
    servicesNote: loc("pricing.servicesNote"),
    note: loc("pricing.note"),
    serviceFloors: [
      ["webPlatforms", 120000],
      ["aiSolutions", 180000],
      ["mobileApps", 150000],
      ["dataAnalytics", 90000],
      ["automation", 60000],
      ["integrations", 50000],
    ].map(([k, amount]) => ({ _type: "serviceFloor", _key: k, key: k, amount })),
    engagements: [
      { _type: "engagementPrice", _key: "project", key: "project", amount: 120000, monthly: false },
      { _type: "engagementPrice", _key: "retainer", key: "retainer", amount: 35000, monthly: true },
      { _type: "engagementPrice", _key: "partnership", key: "partnership", monthly: false },
    ],
  },
];

const transaction = client.transaction();
for (const doc of documents) {
  if (overwrite) transaction.createOrReplace(doc);
  else transaction.createIfNotExists(doc);
}

const result = await transaction.commit();
console.log(
  `${overwrite ? "Replaced" : "Seeded"} ${documents.length} documents in ${projectId}/${dataset} (transaction ${result.transactionId}).`,
);

// ─────────────────────────────────────────────────────────────────────────────

function header(path) {
  return {
    _type: "sectionHeader",
    eyebrow: loc(`${path}.eyebrow`),
    headline: loc(`${path}.headline`),
    intro: loc(`${path}.lead`),
  };
}

function get(object, path) {
  return path.split(".").reduce((value, part) => (value == null ? undefined : value[part]), object);
}

function key(path) {
  return path.replace(/[^a-zA-Z0-9]/g, "-");
}

/** Minimal .env.local loader so the script works without extra tooling. */
function loadDotEnvLocal() {
  const file = new URL("../.env.local", import.meta.url);
  if (!existsSync(file)) return;
  for (const line of readFileSync(file, "utf8").split(/\r?\n/)) {
    const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (match && !(match[1] in process.env))
      process.env[match[1]] = match[2].replace(/^["']|["']$/g, "");
  }
}
