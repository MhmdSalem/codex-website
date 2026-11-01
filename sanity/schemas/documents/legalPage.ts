import { defineField, defineType } from "sanity";

/**
 * Legal pages are keyed by route rather than slug so the frontend can resolve
 * /privacy without an editor accidentally renaming the URL.
 */
export const legalPage = defineType({
  name: "legalPage",
  title: "Legal page",
  type: "document",
  fields: [
    defineField({
      name: "key",
      title: "Page",
      type: "string",
      options: {
        list: [
          { title: "Privacy Policy", value: "privacy" },
          { title: "Service Delivery", value: "delivery" },
          { title: "Refunds and Cancellations", value: "refunds" },
          { title: "Terms of Service", value: "terms" },
          { title: "Cookie Policy", value: "cookies" },
        ],
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "title",
      title: "Title",
      type: "localeString",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "summary",
      title: "Summary",
      type: "localeText",
    }),
    defineField({
      name: "body",
      title: "Body",
      type: "localePortableText",
    }),
    defineField({
      name: "lastUpdated",
      title: "Last updated",
      type: "date",
      initialValue: () => new Date().toISOString().slice(0, 10),
    }),
    defineField({ name: "seo", title: "SEO", type: "seo" }),
  ],
  preview: {
    select: { title: "title.en", subtitle: "key" },
  },
});
