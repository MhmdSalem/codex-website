import { defineField, defineType } from "sanity";

/**
 * Per-document SEO overrides. Anything left empty falls back to Site Settings,
 * then to the built-in translations, so a page is never missing metadata.
 */
export const seo = defineType({
  name: "seo",
  title: "SEO",
  type: "object",
  options: { collapsible: true, collapsed: true },
  fields: [
    defineField({
      name: "title",
      title: "Meta title",
      description: "Aim for 50–60 characters. Falls back to the page title.",
      type: "localeString",
    }),
    defineField({
      name: "description",
      title: "Meta description",
      description: "Aim for 140–160 characters.",
      type: "localeText",
    }),
    defineField({
      name: "ogImage",
      title: "Social share image",
      description: "1200 × 630. Falls back to the site default.",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "keywords",
      title: "Keywords",
      type: "array",
      of: [{ type: "string" }],
      options: { layout: "tags" },
    }),
    defineField({
      name: "noIndex",
      title: "Hide from search engines",
      type: "boolean",
      initialValue: false,
    }),
  ],
});
