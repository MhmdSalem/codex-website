import { defineField, defineType } from "sanity";

/**
 * Navigation is CMS-managed but route-safe: editors pick from the routes the
 * app actually implements, so a typo can never produce a dead link. Anything
 * outside the site uses the explicit "External URL" option.
 */
const ROUTE_OPTIONS = [
  { title: "Home", value: "/" },
  { title: "About", value: "/about" },
  { title: "Services", value: "/services" },
  { title: "Products", value: "/products" },
  { title: "Work", value: "/work" },
  { title: "Pricing", value: "/pricing" },
  { title: "Contact", value: "/contact" },
  { title: "Privacy", value: "/privacy" },
  { title: "Delivery", value: "/delivery" },
  { title: "Refunds", value: "/refunds" },
];

const linkFields = [
  defineField({
    name: "label",
    title: "Label",
    type: "localeString",
    validation: (rule) => rule.required(),
  }),
  defineField({
    name: "kind",
    title: "Destination",
    type: "string",
    options: {
      list: [
        { title: "Site page", value: "route" },
        { title: "External URL", value: "external" },
        { title: "Email", value: "email" },
        { title: "Phone", value: "phone" },
      ],
      layout: "radio",
      direction: "horizontal",
    },
    initialValue: "route",
    validation: (rule) => rule.required(),
  }),
  defineField({
    name: "route",
    title: "Page",
    type: "string",
    options: { list: ROUTE_OPTIONS },
    hidden: ({ parent }) => parent?.kind !== "route",
  }),
  defineField({
    name: "anchor",
    title: "Anchor",
    description: "Optional element id on the target page, without the #.",
    type: "string",
    hidden: ({ parent }) => parent?.kind !== "route",
  }),
  defineField({
    name: "href",
    title: "URL / address",
    type: "string",
    hidden: ({ parent }) => parent?.kind === "route",
  }),
  defineField({
    name: "newTab",
    title: "Open in a new tab",
    type: "boolean",
    initialValue: false,
    hidden: ({ parent }) => parent?.kind !== "external",
  }),
];

/** A leaf link. Used inside dropdowns, the footer and CTA slots. */
export const navLink = defineType({
  name: "navLink",
  title: "Link",
  type: "object",
  fields: linkFields,
  preview: {
    select: { title: "label.en", route: "route", href: "href" },
    prepare({ title, route, href }) {
      return { title: title || "Untitled link", subtitle: route || href };
    },
  },
});

/** A top-level navigation entry, optionally with one level of children. */
export const navItem = defineType({
  name: "navItem",
  title: "Navigation item",
  type: "object",
  fields: [
    ...linkFields,
    defineField({
      name: "children",
      title: "Sub-links",
      description: "Optional. One level deep only.",
      type: "array",
      of: [{ type: "navLink" }],
    }),
  ],
  preview: {
    select: { title: "label.en", route: "route", href: "href", children: "children" },
    prepare({ title, route, href, children }) {
      const count = Array.isArray(children) ? children.length : 0;
      return {
        title: title || "Untitled item",
        subtitle: count > 0 ? `${route || href} · ${count} sub-links` : route || href,
      };
    },
  },
});

/** A call to action: same destination model, plus a visual variant. */
export const cta = defineType({
  name: "cta",
  title: "Call to action",
  type: "object",
  fields: [
    ...linkFields,
    defineField({
      name: "variant",
      title: "Style",
      type: "string",
      options: {
        list: [
          { title: "Primary", value: "primary" },
          { title: "Outline", value: "outline" },
          { title: "Text", value: "text" },
        ],
        layout: "radio",
        direction: "horizontal",
      },
      initialValue: "primary",
    }),
  ],
  preview: {
    select: { title: "label.en", variant: "variant" },
    prepare({ title, variant }) {
      return { title: title || "Untitled CTA", subtitle: variant };
    },
  },
});

export const socialLink = defineType({
  name: "socialLink",
  title: "Social link",
  type: "object",
  fields: [
    defineField({
      name: "platform",
      title: "Platform",
      type: "string",
      options: {
        list: [
          { title: "Instagram", value: "instagram" },
          { title: "Facebook", value: "facebook" },
          { title: "X / Twitter", value: "x" },
          { title: "LinkedIn", value: "linkedin" },
          { title: "Behance", value: "behance" },
          { title: "Dribbble", value: "dribbble" },
          { title: "GitHub", value: "github" },
          { title: "YouTube", value: "youtube" },
          { title: "TikTok", value: "tiktok" },
          { title: "Other", value: "other" },
        ],
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "label",
      title: "Label override",
      description: "Leave empty to use the platform name.",
      type: "string",
    }),
    defineField({
      name: "url",
      title: "URL",
      type: "url",
      validation: (rule) => rule.required().uri({ scheme: ["http", "https"] }),
    }),
  ],
  preview: {
    select: { title: "platform", subtitle: "url" },
  },
});

export const navigationTypes = [navLink, navItem, cta, socialLink];
