import { defineField, defineType } from "sanity";
import { languageIds } from "../locale/languages";

export const siteSettings = defineType({
  name: "siteSettings",
  title: "Site settings",
  type: "document",
  groups: [
    { name: "identity", title: "Identity", default: true },
    { name: "seo", title: "SEO" },
    { name: "contact", title: "Contact" },
    { name: "navigation", title: "Navigation" },
    { name: "footer", title: "Footer" },
    { name: "theme", title: "Theme" },
  ],
  fields: [
    // ── Identity ────────────────────────────────────────────────────────
    defineField({
      name: "siteName",
      title: "Site name",
      type: "localeString",
      group: "identity",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "tagline",
      title: "Tagline",
      type: "localeString",
      group: "identity",
    }),
    defineField({
      name: "logo",
      title: "Logo",
      description: "SVG preferred. Used in the header and footer.",
      type: "image",
      group: "identity",
      options: { accept: "image/svg+xml,image/png" },
    }),
    defineField({
      name: "logoMark",
      title: "Logo mark",
      description: "Compact square version for tight spaces.",
      type: "image",
      group: "identity",
      options: { accept: "image/svg+xml,image/png" },
    }),
    defineField({
      name: "favicon",
      title: "Favicon",
      description: "512 × 512 PNG or SVG.",
      type: "image",
      group: "identity",
    }),

    // ── SEO ─────────────────────────────────────────────────────────────
    defineField({
      name: "defaultSeoTitle",
      title: "Default meta title",
      type: "localeString",
      group: "seo",
    }),
    defineField({
      name: "defaultSeoDescription",
      title: "Default meta description",
      type: "localeText",
      group: "seo",
    }),
    defineField({
      name: "defaultOgImage",
      title: "Default social share image",
      description: "1200 × 630.",
      type: "image",
      group: "seo",
      options: { hotspot: true },
    }),

    // ── Contact ─────────────────────────────────────────────────────────
    defineField({
      name: "email",
      title: "Contact email",
      type: "string",
      group: "contact",
      validation: (rule) => rule.email(),
    }),
    defineField({
      name: "phone",
      title: "Phone number",
      description: "International format, e.g. +966 5X XXX XXXX.",
      type: "string",
      group: "contact",
    }),
    defineField({
      name: "whatsapp",
      title: "WhatsApp number",
      description: "Digits only, including the country code.",
      type: "string",
      group: "contact",
    }),
    defineField({
      name: "address",
      title: "Address",
      type: "localeText",
      group: "contact",
    }),
    defineField({
      name: "socialLinks",
      title: "Social links",
      type: "array",
      group: "contact",
      of: [{ type: "socialLink" }],
    }),

    // ── Navigation ──────────────────────────────────────────────────────
    defineField({
      name: "primaryNavigation",
      title: "Header navigation",
      description: "Leave empty to use the built-in route order.",
      type: "array",
      group: "navigation",
      of: [{ type: "navItem" }],
    }),
    defineField({
      name: "headerCta",
      title: "Header call to action",
      description:
        "The pill at the end of the header. Leave empty to use the built-in label pointing at Contact.",
      type: "cta",
      group: "navigation",
    }),

    // ── Footer ──────────────────────────────────────────────────────────
    defineField({
      name: "footerNavigation",
      title: "Footer links",
      type: "array",
      group: "footer",
      of: [{ type: "navItem" }],
    }),
    defineField({
      name: "footerNote",
      title: "Footer note",
      type: "localeText",
      group: "footer",
    }),
    defineField({
      name: "copyright",
      title: "Copyright text",
      description: "Use {year} to insert the current year automatically.",
      type: "localeString",
      group: "footer",
    }),

    // ── Theme ───────────────────────────────────────────────────────────
    defineField({
      name: "defaultLanguage",
      title: "Default language",
      type: "string",
      group: "theme",
      options: { list: [...languageIds], layout: "radio", direction: "horizontal" },
      initialValue: "en",
    }),
    defineField({
      name: "theme",
      title: "Theme settings",
      description: "Global presentation switches. Animation behaviour itself is defined in code.",
      type: "object",
      group: "theme",
      options: { collapsible: true, collapsed: false },
      fields: [
        defineField({
          name: "accentColor",
          title: "Accent color",
          description:
            "Hex value. Overrides the --color-accent token, which covers decorative fills only. " +
            "Text colour and filled buttons keep the house terracotta so their contrast stays safe.",
          type: "string",
          validation: (rule) =>
            rule.regex(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/, {
              name: "hex color",
              invert: false,
            }),
        }),
        defineField({
          name: "enableSmoothScroll",
          title: "Smooth scrolling",
          type: "boolean",
          initialValue: true,
        }),
        defineField({
          name: "enableCustomCursor",
          title: "Custom cursor",
          description: "Pointer devices only; always disabled for touch and reduced motion.",
          type: "boolean",
          initialValue: true,
        }),
        defineField({
          name: "enablePageTransitions",
          title: "Page transitions",
          type: "boolean",
          initialValue: true,
        }),
      ],
    }),
  ],
  preview: {
    select: { title: "siteName.en" },
    prepare({ title }) {
      return { title: title || "Site settings", subtitle: "Global configuration" };
    },
  },
});
