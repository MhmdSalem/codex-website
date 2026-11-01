import { defineField, defineType } from "sanity";

/**
 * Homepage composition.
 *
 * Visibility and order are data (an array of toggles the editor can drag);
 * the rendering, layout and animation of each section stay in code. The `key`
 * list must match the section registry in src/components/sections.
 */
export const HOME_SECTION_KEYS = [
  { title: "Hero", value: "hero" },
  { title: "Intro statement", value: "intro" },
  { title: "Products", value: "products" },
  { title: "Featured projects", value: "featuredProjects" },
  { title: "Capabilities", value: "capabilities" },
  { title: "Process", value: "process" },
  { title: "Statistics", value: "statistics" },
  { title: "About preview", value: "aboutPreview" },
  { title: "Closing call to action", value: "closingCta" },
];

export const homeSection = defineType({
  name: "homeSection",
  title: "Section",
  type: "object",
  fields: [
    defineField({
      name: "key",
      title: "Section",
      type: "string",
      options: { list: HOME_SECTION_KEYS },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "enabled",
      title: "Visible",
      type: "boolean",
      initialValue: true,
    }),
  ],
  preview: {
    select: { key: "key", enabled: "enabled" },
    prepare({ key, enabled }) {
      const match = HOME_SECTION_KEYS.find((option) => option.value === key);
      return {
        title: match?.title ?? key ?? "Section",
        subtitle: enabled === false ? "Hidden" : "Visible",
      };
    },
  },
});

/** Shared heading block reused by most sections. */
export const sectionHeader = defineType({
  name: "sectionHeader",
  title: "Section header",
  type: "object",
  fields: [
    defineField({ name: "eyebrow", title: "Eyebrow", type: "localeString" }),
    defineField({ name: "headline", title: "Headline", type: "localeString" }),
    defineField({ name: "intro", title: "Intro", type: "localeText" }),
  ],
  preview: {
    select: { title: "headline.en", subtitle: "eyebrow.en" },
  },
});

export const capabilitiesSection = defineType({
  name: "capabilitiesSection",
  title: "Capabilities section",
  type: "object",
  options: { collapsible: true, collapsed: true },
  fields: [
    defineField({ name: "header", title: "Header", type: "sectionHeader" }),
    defineField({
      name: "services",
      title: "Services",
      description: "Drag to reorder. Leave empty to show every service by its own sort order.",
      type: "array",
      of: [{ type: "reference", to: [{ type: "service" }] }],
    }),
    defineField({ name: "cta", title: "Call to action", type: "cta" }),
  ],
});

export const processSection = defineType({
  name: "processSection",
  title: "Process section",
  type: "object",
  options: { collapsible: true, collapsed: true },
  fields: [
    defineField({ name: "header", title: "Header", type: "sectionHeader" }),
    defineField({
      name: "steps",
      title: "Steps",
      type: "array",
      of: [{ type: "processStep" }],
    }),
  ],
});

export const aboutPreviewSection = defineType({
  name: "aboutPreviewSection",
  title: "About preview",
  type: "object",
  options: { collapsible: true, collapsed: true },
  fields: [
    defineField({ name: "header", title: "Header", type: "sectionHeader" }),
    defineField({ name: "body", title: "Body", type: "localePortableText" }),
    defineField({ name: "media", title: "Media", type: "media" }),
    defineField({ name: "cta", title: "Call to action", type: "cta" }),
  ],
});

export const closingCtaSection = defineType({
  name: "closingCtaSection",
  title: "Closing call to action",
  type: "object",
  options: { collapsible: true, collapsed: true },
  fields: [
    defineField({ name: "eyebrow", title: "Eyebrow", type: "localeString" }),
    defineField({ name: "headline", title: "Headline", type: "localeString" }),
    defineField({ name: "body", title: "Body", type: "localeText" }),
    defineField({ name: "cta", title: "Call to action", type: "cta" }),
  ],
});

export const teamSection = defineType({
  name: "teamSection",
  title: "Team section",
  type: "object",
  options: { collapsible: true, collapsed: true },
  fields: [
    defineField({ name: "header", title: "Header", type: "sectionHeader" }),
    defineField({
      name: "members",
      title: "Members",
      type: "array",
      of: [{ type: "teamMember" }],
    }),
  ],
});

export const sectionTypes = [
  homeSection,
  sectionHeader,
  capabilitiesSection,
  processSection,
  aboutPreviewSection,
  closingCtaSection,
  teamSection,
];
