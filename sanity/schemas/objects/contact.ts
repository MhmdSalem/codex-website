import { defineField, defineType } from "sanity";

export const contactMethod = defineType({
  name: "contactMethod",
  title: "Contact method",
  type: "object",
  fields: [
    defineField({
      name: "kind",
      title: "Type",
      type: "string",
      options: {
        list: [
          { title: "Email", value: "email" },
          { title: "Phone", value: "phone" },
          { title: "WhatsApp", value: "whatsapp" },
          { title: "Other", value: "other" },
        ],
      },
      initialValue: "email",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "label",
      title: "Label",
      type: "localeString",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "value",
      title: "Value",
      description: "The address, number or handle shown to visitors.",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "href",
      title: "Link override",
      description: "Leave empty to generate mailto:, tel: or wa.me automatically.",
      type: "string",
    }),
  ],
  preview: {
    select: { title: "value", subtitle: "kind" },
  },
});

export const office = defineType({
  name: "office",
  title: "Office",
  type: "object",
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "localeString",
      validation: (rule) => rule.required(),
    }),
    defineField({ name: "address", title: "Address", type: "localeText" }),
    defineField({ name: "city", title: "City", type: "localeString" }),
    defineField({ name: "country", title: "Country", type: "localeString" }),
    defineField({
      name: "mapUrl",
      title: "Map URL",
      type: "url",
    }),
    defineField({
      name: "timezone",
      title: "Time zone",
      description: "IANA name, e.g. Asia/Riyadh. Used for the local-time display.",
      type: "string",
    }),
  ],
  preview: {
    select: { title: "name.en", subtitle: "city.en" },
  },
});

/**
 * Contact form copy. Field keys are fixed in code; only the visible strings
 * are editable, so the form can never be broken from the CMS.
 */
export const formLabels = defineType({
  name: "formLabels",
  title: "Form labels",
  type: "object",
  options: { collapsible: true, collapsed: true },
  fields: [
    defineField({ name: "name", title: "Name field", type: "localeString" }),
    defineField({ name: "email", title: "Email field", type: "localeString" }),
    defineField({ name: "company", title: "Company field", type: "localeString" }),
    defineField({ name: "budget", title: "Budget field", type: "localeString" }),
    defineField({ name: "message", title: "Message field", type: "localeString" }),
    defineField({ name: "submit", title: "Submit button", type: "localeString" }),
    defineField({ name: "sending", title: "Sending state", type: "localeString" }),
    defineField({ name: "required", title: "Required-field error", type: "localeString" }),
    defineField({ name: "invalidEmail", title: "Invalid-email error", type: "localeString" }),
    defineField({ name: "genericError", title: "Generic error", type: "localeString" }),
  ],
});

export const contactTypes = [contactMethod, office, formLabels];
