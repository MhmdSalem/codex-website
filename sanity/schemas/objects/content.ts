import { defineField, defineType } from "sanity";

/** A single headline number: "120+", "3.4×", "98%". */
export const statistic = defineType({
  name: "statistic",
  title: "Statistic",
  type: "object",
  fields: [
    defineField({
      name: "value",
      title: "Value",
      description: "Digits only when possible — the frontend animates the count.",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "prefix",
      title: "Prefix",
      type: "string",
    }),
    defineField({
      name: "suffix",
      title: "Suffix",
      description: "For example +, %, ×, K, M.",
      type: "string",
    }),
    defineField({
      name: "label",
      title: "Label",
      type: "localeString",
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: { value: "value", suffix: "suffix", label: "label.en" },
    prepare({ value, suffix, label }) {
      return { title: `${value ?? ""}${suffix ?? ""}`, subtitle: label };
    },
  },
});

export const testimonial = defineType({
  name: "testimonial",
  title: "Testimonial",
  type: "object",
  fields: [
    defineField({
      name: "quote",
      title: "Quote",
      type: "localeText",
      validation: (rule) => rule.required(),
    }),
    defineField({ name: "authorName", title: "Author", type: "string" }),
    defineField({ name: "authorRole", title: "Role", type: "localeString" }),
    defineField({ name: "company", title: "Company", type: "string" }),
    defineField({
      name: "avatar",
      title: "Avatar",
      type: "image",
      options: { hotspot: true },
    }),
  ],
  preview: {
    select: { title: "authorName", subtitle: "company", media: "avatar" },
  },
});

/** One step in a process or methodology section. Order = array order. */
export const processStep = defineType({
  name: "processStep",
  title: "Process step",
  type: "object",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "localeString",
      validation: (rule) => rule.required(),
    }),
    defineField({ name: "description", title: "Description", type: "localeText" }),
  ],
  preview: {
    select: { title: "title.en", subtitle: "description.en" },
  },
});

export const valueItem = defineType({
  name: "valueItem",
  title: "Value",
  type: "object",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "localeString",
      validation: (rule) => rule.required(),
    }),
    defineField({ name: "description", title: "Description", type: "localeText" }),
  ],
  preview: {
    select: { title: "title.en", subtitle: "description.en" },
  },
});

export const teamMember = defineType({
  name: "teamMember",
  title: "Team member",
  type: "object",
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({ name: "role", title: "Role", type: "localeString" }),
    defineField({
      name: "photo",
      title: "Photo",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({ name: "bio", title: "Short bio", type: "localeText" }),
    defineField({
      name: "links",
      title: "Links",
      type: "array",
      of: [{ type: "socialLink" }],
    }),
  ],
  preview: {
    select: { title: "name", subtitle: "role.en", media: "photo" },
  },
});

/** A measurable outcome shown on a case study. */
export const resultItem = defineType({
  name: "resultItem",
  title: "Result",
  type: "object",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "localeString",
      validation: (rule) => rule.required(),
    }),
    defineField({ name: "description", title: "Description", type: "localeText" }),
    defineField({
      name: "metric",
      title: "Metric",
      description: "Optional headline number for this result.",
      type: "statistic",
    }),
  ],
  preview: {
    select: { title: "title.en", subtitle: "description.en" },
  },
});

export const contentTypes = [
  statistic,
  testimonial,
  processStep,
  valueItem,
  teamMember,
  resultItem,
];
