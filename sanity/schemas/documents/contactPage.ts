import { defineField, defineType } from "sanity";

export const contactPage = defineType({
  name: "contactPage",
  title: "Contact page",
  type: "document",
  groups: [
    { name: "content", title: "Content", default: true },
    { name: "details", title: "Contact details" },
    { name: "form", title: "Form" },
    { name: "seo", title: "SEO" },
  ],
  fields: [
    defineField({
      name: "eyebrow",
      title: "Eyebrow",
      type: "localeString",
      group: "content",
    }),
    defineField({
      name: "headline",
      title: "Headline",
      type: "localeString",
      group: "content",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "supportingText",
      title: "Supporting text",
      type: "localeText",
      group: "content",
    }),
    defineField({
      name: "contactMethods",
      title: "Contact methods",
      description: "Leave empty to use the details from Site settings.",
      type: "array",
      group: "details",
      of: [{ type: "contactMethod" }],
    }),
    defineField({
      name: "offices",
      title: "Offices",
      type: "array",
      group: "details",
      of: [{ type: "office" }],
    }),
    defineField({
      name: "formLabels",
      title: "Form labels",
      type: "formLabels",
      group: "form",
    }),
    defineField({
      name: "successMessage",
      title: "Success message",
      type: "localeText",
      group: "form",
    }),
    defineField({
      name: "privacyNote",
      title: "Privacy note",
      description: "Small print shown under the submit button.",
      type: "localeText",
      group: "form",
    }),
    defineField({ name: "seo", title: "SEO", type: "seo", group: "seo" }),
  ],
  preview: {
    select: { title: "headline.en" },
    prepare({ title }) {
      return { title: "Contact page", subtitle: title };
    },
  },
});
