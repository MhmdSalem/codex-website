import { defineField, defineType } from "sanity";
import { HOME_SECTION_KEYS } from "../objects/sections";

export const homepage = defineType({
  name: "homepage",
  title: "Homepage",
  type: "document",
  groups: [
    { name: "hero", title: "Hero", default: true },
    { name: "content", title: "Sections" },
    { name: "composition", title: "Composition" },
    { name: "seo", title: "SEO" },
  ],
  fields: [
    // ── Hero ────────────────────────────────────────────────────────────
    defineField({
      name: "heroEyebrow",
      title: "Eyebrow",
      type: "localeString",
      group: "hero",
    }),
    defineField({
      name: "heroHeadline",
      title: "Headline",
      description: "Kept short — it is set at display scale and animates in word by word.",
      type: "localeString",
      group: "hero",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "heroSubheading",
      title: "Subheading",
      type: "localeString",
      group: "hero",
    }),
    defineField({
      name: "heroSupportingText",
      title: "Supporting text",
      type: "localeText",
      group: "hero",
    }),
    defineField({
      name: "heroMedia",
      title: "Hero media",
      type: "media",
      group: "hero",
    }),
    defineField({
      name: "heroCta",
      title: "Hero call to action",
      type: "cta",
      group: "hero",
    }),

    // ── Sections ────────────────────────────────────────────────────────
    defineField({
      name: "introStatement",
      title: "Intro statement",
      description: "The opening manifesto line after the hero.",
      type: "localePortableText",
      group: "content",
    }),
    defineField({
      name: "products",
      title: "Products",
      description: "Drag to reorder. Leave empty to use products flagged as featured.",
      type: "array",
      group: "content",
      of: [{ type: "reference", to: [{ type: "product" }] }],
      validation: (rule) => rule.max(6).unique(),
    }),
    defineField({
      name: "productsHeader",
      title: "Products header",
      type: "sectionHeader",
      group: "content",
    }),
    defineField({
      name: "featuredProjects",
      title: "Featured projects",
      description: "Drag to reorder. Leave empty to use projects flagged as featured.",
      type: "array",
      group: "content",
      of: [{ type: "reference", to: [{ type: "project" }] }],
      validation: (rule) => rule.max(8).unique(),
    }),
    defineField({
      name: "featuredProjectsHeader",
      title: "Featured projects header",
      type: "sectionHeader",
      group: "content",
    }),
    defineField({
      name: "capabilities",
      title: "Capabilities",
      type: "capabilitiesSection",
      group: "content",
    }),
    defineField({
      name: "process",
      title: "Process",
      type: "processSection",
      group: "content",
    }),
    defineField({
      name: "statisticsHeader",
      title: "Statistics header",
      type: "sectionHeader",
      group: "content",
    }),
    defineField({
      name: "statistics",
      title: "Statistics",
      type: "array",
      group: "content",
      of: [{ type: "statistic" }],
      validation: (rule) => rule.max(6),
    }),
    defineField({
      name: "aboutPreview",
      title: "About preview",
      type: "aboutPreviewSection",
      group: "content",
    }),
    defineField({
      name: "closingCta",
      title: "Closing call to action",
      type: "closingCtaSection",
      group: "content",
    }),

    // ── Composition ─────────────────────────────────────────────────────
    defineField({
      name: "sections",
      title: "Section order and visibility",
      description:
        "Drag to reorder the homepage and toggle sections on or off. Sections left out of this list fall back to the default order.",
      type: "array",
      group: "composition",
      of: [{ type: "homeSection" }],
      initialValue: HOME_SECTION_KEYS.map((option) => ({
        _type: "homeSection",
        key: option.value,
        enabled: true,
      })),
      validation: (rule) => rule.unique(),
    }),

    // ── SEO ─────────────────────────────────────────────────────────────
    defineField({ name: "seo", title: "SEO", type: "seo", group: "seo" }),
  ],
  preview: {
    select: { title: "heroHeadline.en" },
    prepare({ title }) {
      return { title: "Homepage", subtitle: title };
    },
  },
});
