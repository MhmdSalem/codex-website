import { defineField, defineType } from "sanity";
import { localizedSlugSource, slugify } from "../utils/slug";

/**
 * A software product CODEX TECH owns and operates — Codex Accreditation,
 * Lammetna, and whatever ships next.
 *
 * Deliberately separate from `project`. A project is client work with a brief
 * and an end date; a product is something the company builds, runs and sells
 * on its own behalf. They need different fields, they are ordered differently,
 * and conflating them would make the homepage lie about which is which.
 */
export const product = defineType({
  name: "product",
  title: "Product",
  type: "document",
  groups: [
    { name: "overview", title: "Overview", default: true },
    { name: "media", title: "Media" },
    { name: "settings", title: "Settings" },
    { name: "seo", title: "SEO" },
  ],
  fields: [
    defineField({
      name: "name",
      title: "Product name",
      type: "localeString",
      group: "overview",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "key",
      title: "Which product is this?",
      description:
        "Ties the document to the product the website already knows, so its text replaces the built-in copy.",
      type: "string",
      group: "overview",
      options: {
        list: [
          { title: "Codex Accreditation", value: "accreditation" },
          { title: "Lammetna", value: "daawa" },
        ],
        layout: "radio",
      },
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      group: "overview",
      options: {
        source: localizedSlugSource("name"),
        slugify,
        maxLength: 96,
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "category",
      title: "Category",
      description: 'What kind of product this is — for example "Event technology".',
      type: "localeString",
      group: "overview",
    }),
    defineField({
      name: "tagline",
      title: "Tagline",
      description: "One or two sentences: what it does, in plain words.",
      type: "localeString",
      group: "overview",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "description",
      title: "Description",
      description: "Two or three sentences. What the product does and who runs on it.",
      type: "localeText",
      group: "overview",
    }),
    defineField({
      name: "audience",
      title: "Who it is for",
      description:
        "One sentence, e.g. “For event organisers and the teams running accreditation on the day.”",
      type: "localeText",
      group: "overview",
    }),
    defineField({
      name: "capabilities",
      title: "Capabilities",
      description:
        'Short concrete phrases, one per line — for example "Badge design and printing". Five reads best.',
      type: "array",
      group: "overview",
      of: [{ type: "localeString" }],
      validation: (rule) => rule.max(8),
    }),
    defineField({
      name: "status",
      title: "Status",
      type: "string",
      group: "overview",
      options: {
        list: [
          { title: "Live", value: "live" },
          { title: "In development", value: "development" },
        ],
        layout: "radio",
      },
      initialValue: "live",
    }),
    defineField({
      name: "logo",
      title: "Logo",
      description: "SVG preferred, monochrome, no padding.",
      type: "image",
      group: "media",
      options: { accept: "image/svg+xml,image/png" },
    }),
    defineField({
      name: "cover",
      title: "Cover media",
      type: "media",
      group: "media",
    }),
    defineField({
      name: "accentColor",
      title: "Accent colour",
      description:
        "Hex value used for this product's decorative fills only. Text colour and filled buttons are " +
        "never overridden, so contrast stays safe.",
      type: "string",
      group: "settings",
      validation: (rule) =>
        rule
          .regex(/^#([0-9a-fA-F]{6})$/, { name: "hex colour" })
          .error("Use a 6-digit hex, e.g. #2F6BFF"),
    }),
    defineField({
      name: "url",
      title: "Product website",
      type: "url",
      group: "settings",
    }),
    defineField({
      name: "featured",
      title: "Featured",
      description: "Featured products appear on the homepage when none are picked manually.",
      type: "boolean",
      group: "settings",
      initialValue: true,
    }),
    defineField({
      name: "sortOrder",
      title: "Sort order",
      description: "Lower numbers appear first.",
      type: "number",
      group: "settings",
      initialValue: 100,
    }),
    defineField({ name: "seo", title: "SEO", type: "seo", group: "seo" }),
  ],
  orderings: [
    {
      title: "Sort order",
      name: "sortOrderAsc",
      by: [{ field: "sortOrder", direction: "asc" }],
    },
  ],
  preview: {
    select: { title: "name.en", subtitle: "tagline.en", media: "logo" },
  },
});
