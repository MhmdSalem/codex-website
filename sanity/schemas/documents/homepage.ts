import { defineField, defineType } from "sanity";

/**
 * The homepage, as the editor sees it.
 *
 * One field group per scene of the build sequence, in the order they appear on
 * the page. Every field is optional: where it is empty the site shows the copy
 * from the message catalogue, so a half-filled document never leaves a hole.
 */
export const homepage = defineType({
  name: "homepage",
  title: "Homepage",
  type: "document",
  groups: [
    { name: "hero", title: "1 · Opening", default: true },
    { name: "intro", title: "2 · The idea" },
    { name: "products", title: "3 · Products" },
    { name: "capabilities", title: "4 · Services" },
    { name: "process", title: "5 · How we work" },
    { name: "about", title: "6 · The company" },
    { name: "closing", title: "7 · Closing" },
    { name: "seo", title: "SEO" },
  ],
  fields: [
    // ── 1 · Opening ─────────────────────────────────────────────────────
    defineField({
      name: "heroEyebrow",
      title: "Small line above the headline",
      type: "localeString",
      group: "hero",
    }),
    defineField({
      name: "heroHeadline",
      title: "Headline",
      description:
        "Wrap one or two words in *asterisks* to colour them, e.g. “ideas into *digital* products”.",
      type: "localeString",
      group: "hero",
    }),
    defineField({
      name: "heroSubheading",
      title: "Paragraph under the headline",
      type: "localeText",
      group: "hero",
    }),
    defineField({
      name: "heroCta",
      title: "Main button",
      type: "cta",
      group: "hero",
    }),

    // ── 2 · The idea ────────────────────────────────────────────────────
    defineField({
      name: "introLines",
      title: "The four lines",
      description: "Shown one after another as the visitor scrolls. Four short sentences.",
      type: "array",
      group: "intro",
      of: [{ type: "localeString" }],
      validation: (rule) => rule.max(4),
    }),
    defineField({
      name: "introSupport",
      title: "Supporting paragraph",
      type: "localeText",
      group: "intro",
    }),

    // ── 3 · Products ────────────────────────────────────────────────────
    defineField({
      name: "productsHeader",
      title: "Section heading",
      type: "sectionHeader",
      group: "products",
    }),
    defineField({
      name: "products",
      title: "Products shown",
      description: "Edit each product's own text under Products. Leave empty to show them all.",
      type: "array",
      group: "products",
      of: [{ type: "reference", to: [{ type: "product" }] }],
      validation: (rule) => rule.max(6).unique(),
    }),

    // ── 4 · Services ────────────────────────────────────────────────────
    defineField({
      name: "capabilities",
      title: "Services section",
      description: "The names come from each service's own document under Services.",
      type: "capabilitiesSection",
      group: "capabilities",
    }),

    // ── 5 · How we work ─────────────────────────────────────────────────
    defineField({
      name: "process",
      title: "How we work",
      description: "Four steps. Each needs a title and one sentence.",
      type: "processSection",
      group: "process",
    }),

    // ── 6 · The company ─────────────────────────────────────────────────
    defineField({
      name: "aboutPreview",
      title: "The company, in short",
      type: "aboutPreviewSection",
      group: "about",
    }),

    // ── 7 · Closing ─────────────────────────────────────────────────────
    defineField({
      name: "closingCta",
      title: "Closing invitation",
      type: "closingCtaSection",
      group: "closing",
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
