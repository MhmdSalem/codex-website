import { defineField, defineType } from "sanity";
import { localizedSlugSource, slugify } from "../utils/slug";

export const service = defineType({
  name: "service",
  title: "Service",
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
      title: "Service name",
      type: "localeString",
      group: "overview",
      validation: (rule) => rule.required(),
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
      name: "shortDescription",
      title: "Short description",
      type: "localeText",
      group: "overview",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "fullDescription",
      title: "Full description",
      type: "localePortableText",
      group: "overview",
    }),
    defineField({
      name: "deliverables",
      title: "Deliverables",
      description: "Short list shown alongside the description.",
      type: "array",
      group: "overview",
      of: [{ type: "localeString" }],
    }),
    defineField({
      name: "icon",
      title: "Icon",
      description: "SVG preferred, monochrome, no padding.",
      type: "image",
      group: "media",
      options: { accept: "image/svg+xml,image/png" },
    }),
    defineField({
      name: "featuredMedia",
      title: "Featured media",
      type: "media",
      group: "media",
    }),
    defineField({
      name: "relatedProjects",
      title: "Related projects",
      type: "array",
      group: "settings",
      of: [{ type: "reference", to: [{ type: "project" }] }],
      validation: (rule) => rule.unique(),
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
    select: { title: "name.en", subtitle: "shortDescription.en", media: "icon" },
  },
});
