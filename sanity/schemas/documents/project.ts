import { defineField, defineType } from "sanity";
import { localizedSlugSource, slugify } from "../utils/slug";

export const project = defineType({
  name: "project",
  title: "Project",
  type: "document",
  groups: [
    { name: "overview", title: "Overview", default: true },
    { name: "story", title: "Case study" },
    { name: "media", title: "Media" },
    { name: "outcome", title: "Results" },
    { name: "settings", title: "Settings" },
    { name: "seo", title: "SEO" },
  ],
  fields: [
    // ── Overview ────────────────────────────────────────────────────────
    defineField({
      name: "name",
      title: "Project name",
      type: "localeString",
      group: "overview",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      description: "Shared across both languages: /en/work/<slug> and /ar/work/<slug>.",
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
      name: "client",
      title: "Client",
      type: "string",
      group: "overview",
    }),
    defineField({
      name: "industry",
      title: "Industry",
      type: "localeString",
      group: "overview",
    }),
    defineField({
      name: "year",
      title: "Year",
      type: "number",
      group: "overview",
      validation: (rule) => rule.min(2000).max(2100).integer(),
    }),
    defineField({
      name: "services",
      title: "Services",
      type: "array",
      group: "overview",
      of: [{ type: "reference", to: [{ type: "service" }] }],
      validation: (rule) => rule.unique(),
    }),
    defineField({
      name: "shortDescription",
      title: "Short description",
      description: "One or two lines, used on cards and in listings.",
      type: "localeText",
      group: "overview",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "introduction",
      title: "Full introduction",
      type: "localePortableText",
      group: "overview",
    }),

    // ── Case study ──────────────────────────────────────────────────────
    defineField({
      name: "challenge",
      title: "Challenge",
      type: "localePortableText",
      group: "story",
    }),
    defineField({
      name: "strategy",
      title: "Strategy",
      type: "localePortableText",
      group: "story",
    }),
    defineField({
      name: "solution",
      title: "Solution",
      type: "localePortableText",
      group: "story",
    }),
    defineField({
      name: "experience",
      title: "Experience",
      type: "localePortableText",
      group: "story",
    }),

    // ── Media ───────────────────────────────────────────────────────────
    defineField({
      name: "coverImage",
      title: "Cover image",
      description: "Used in listings, the hero and social sharing.",
      type: "image",
      group: "media",
      options: { hotspot: true },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "coverVideo",
      title: "Cover video",
      description: "Optional. Plays on hover in listings and behind the project hero.",
      type: "media",
      group: "media",
    }),
    defineField({
      name: "gallery",
      title: "Gallery",
      type: "array",
      group: "media",
      of: [{ type: "media" }],
    }),
    defineField({
      name: "videoGallery",
      title: "Video gallery",
      type: "array",
      group: "media",
      of: [{ type: "media" }],
    }),

    // ── Results ─────────────────────────────────────────────────────────
    defineField({
      name: "results",
      title: "Results",
      type: "array",
      group: "outcome",
      of: [{ type: "resultItem" }],
    }),
    defineField({
      name: "statistics",
      title: "Statistics",
      type: "array",
      group: "outcome",
      of: [{ type: "statistic" }],
      validation: (rule) => rule.max(6),
    }),
    defineField({
      name: "testimonial",
      title: "Testimonial",
      type: "testimonial",
      group: "outcome",
    }),
    defineField({
      name: "relatedProjects",
      title: "Related projects",
      description: "Leave empty to fall back to the next projects in sort order.",
      type: "array",
      group: "outcome",
      of: [{ type: "reference", to: [{ type: "project" }] }],
      validation: (rule) => rule.max(3).unique(),
    }),

    // ── Settings ────────────────────────────────────────────────────────
    defineField({
      name: "themeColor",
      title: "Theme color",
      description: "Hex value used as the accent while this project is on screen.",
      type: "string",
      group: "settings",
      validation: (rule) => rule.regex(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/, { name: "hex color" }),
    }),
    defineField({
      name: "featured",
      title: "Featured",
      type: "boolean",
      group: "settings",
      initialValue: false,
    }),
    defineField({
      name: "sortOrder",
      title: "Sort order",
      description: "Lower numbers appear first.",
      type: "number",
      group: "settings",
      initialValue: 100,
    }),
    defineField({
      name: "publishedAt",
      title: "Published at",
      type: "datetime",
      group: "settings",
      initialValue: () => new Date().toISOString(),
    }),

    // ── SEO ─────────────────────────────────────────────────────────────
    defineField({ name: "seo", title: "SEO", type: "seo", group: "seo" }),
  ],
  orderings: [
    {
      title: "Sort order",
      name: "sortOrderAsc",
      by: [
        { field: "sortOrder", direction: "asc" },
        { field: "publishedAt", direction: "desc" },
      ],
    },
    {
      title: "Newest first",
      name: "publishedAtDesc",
      by: [{ field: "publishedAt", direction: "desc" }],
    },
  ],
  preview: {
    select: {
      title: "name.en",
      client: "client",
      year: "year",
      featured: "featured",
      media: "coverImage",
    },
    prepare({ title, client, year, featured, media }) {
      const details = [client, year].filter(Boolean).join(" · ");
      return {
        title: `${featured ? "★ " : ""}${title ?? "Untitled project"}`,
        subtitle: details || undefined,
        media,
      };
    },
  },
});
