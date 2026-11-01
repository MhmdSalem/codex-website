import { defineField, defineType } from "sanity";

/** The six services, by the key the website knows them by. */
export const SERVICE_KEYS = [
  { title: "Web platforms", value: "webPlatforms" },
  { title: "AI solutions", value: "aiSolutions" },
  { title: "Mobile apps", value: "mobileApps" },
  { title: "Data & analytics", value: "dataAnalytics" },
  { title: "Automation", value: "automation" },
  { title: "Integrations", value: "integrations" },
];

/** The three ways of working, by key. */
export const ENGAGEMENT_KEYS = [
  { title: "Fixed-scope project", value: "project" },
  { title: "Monthly retainer", value: "retainer" },
  { title: "Product partnership", value: "partnership" },
];

/**
 * The pricing page: the text at the top and the numbers themselves.
 *
 * Amounts are whole Egyptian pounds. An engagement with no amount is shown as
 * agreed case by case. Anything left empty falls back to the figures in code.
 */
export const pricingPage = defineType({
  name: "pricingPage",
  title: "Pricing page",
  type: "document",
  groups: [
    { name: "content", title: "Text", default: true },
    { name: "prices", title: "Prices" },
    { name: "seo", title: "SEO" },
  ],
  fields: [
    defineField({ name: "eyebrow", title: "Small line", type: "localeString", group: "content" }),
    defineField({ name: "headline", title: "Headline", type: "localeString", group: "content" }),
    defineField({ name: "lead", title: "Intro paragraph", type: "localeText", group: "content" }),
    defineField({
      name: "servicesNote",
      title: "Note under the starting prices",
      type: "localeText",
      group: "content",
    }),
    defineField({
      name: "note",
      title: "Note under “what sets the price”",
      type: "localeText",
      group: "content",
    }),
    defineField({
      name: "serviceFloors",
      title: "Starting price per service",
      type: "array",
      group: "prices",
      of: [
        {
          type: "object",
          name: "serviceFloor",
          fields: [
            defineField({
              name: "key",
              title: "Service",
              type: "string",
              options: { list: SERVICE_KEYS },
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "amount",
              title: "Starting price (EGP)",
              type: "number",
              validation: (rule) => rule.required().min(0),
            }),
          ],
          preview: {
            select: { key: "key", amount: "amount" },
            prepare({ key, amount }) {
              const match = SERVICE_KEYS.find((option) => option.value === key);
              return { title: match?.title ?? key, subtitle: amount ? `from EGP ${amount}` : "" };
            },
          },
        },
      ],
    }),
    defineField({
      name: "engagements",
      title: "Ways of working",
      type: "array",
      group: "prices",
      of: [
        {
          type: "object",
          name: "engagementPrice",
          fields: [
            defineField({
              name: "key",
              title: "Model",
              type: "string",
              options: { list: ENGAGEMENT_KEYS },
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "amount",
              title: "Starting amount (EGP)",
              description: "Leave empty for “agreed case by case”.",
              type: "number",
              validation: (rule) => rule.min(0),
            }),
            defineField({
              name: "monthly",
              title: "Per month",
              type: "boolean",
              initialValue: false,
            }),
          ],
          preview: {
            select: { key: "key", amount: "amount", monthly: "monthly" },
            prepare({ key, amount, monthly }) {
              const match = ENGAGEMENT_KEYS.find((option) => option.value === key);
              return {
                title: match?.title ?? key,
                subtitle: amount
                  ? `from EGP ${amount}${monthly ? " / month" : ""}`
                  : "case by case",
              };
            },
          },
        },
      ],
    }),
    defineField({ name: "seo", title: "SEO", type: "seo", group: "seo" }),
  ],
  preview: {
    prepare() {
      return { title: "Pricing page" };
    },
  },
});
