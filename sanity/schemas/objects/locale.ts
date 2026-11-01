import { defineArrayMember, defineField, defineType, type FieldDefinition } from "sanity";
import { baseLanguage, supportedLanguages } from "../locale/languages";

/**
 * Field-level localization types.
 *
 * Each generated type exposes one field per language. The default language sits
 * at the top of the form; every other language is grouped into a collapsible
 * "Translations" fieldset so editors are never overwhelmed.
 */

const TRANSLATIONS_FIELDSET = "translations";

function localeFields(build: (languageId: string) => FieldDefinition): FieldDefinition[] {
  return supportedLanguages.map((language) => {
    const field = build(language.id);
    return {
      ...field,
      title: language.title,
      ...(language.isDefault ? {} : { fieldset: TRANSLATIONS_FIELDSET }),
    } as FieldDefinition;
  });
}

const fieldsets = [
  {
    name: TRANSLATIONS_FIELDSET,
    title: "Translations",
    options: { collapsible: true, collapsed: false },
  },
];

/** Short single-line copy: headlines, labels, eyebrows. */
export const localeString = defineType({
  name: "localeString",
  title: "Localized text",
  type: "object",
  fieldsets,
  fields: localeFields((id) => defineField({ name: id, type: "string" })),
  preview: {
    select: { title: baseLanguage.id },
  },
});

/** Multi-line plain copy: descriptions, summaries, addresses. */
export const localeText = defineType({
  name: "localeText",
  title: "Localized paragraph",
  type: "object",
  fieldsets,
  fields: localeFields((id) => defineField({ name: id, type: "text", rows: 4 })),
  preview: {
    select: { title: baseLanguage.id },
  },
});

/** Rich editorial content with inline media. */
export const localePortableText = defineType({
  name: "localePortableText",
  title: "Localized rich text",
  type: "object",
  fieldsets,
  fields: localeFields((id) =>
    defineField({
      name: id,
      type: "array",
      of: [
        defineArrayMember({
          type: "block",
          styles: [
            { title: "Body", value: "normal" },
            { title: "Heading", value: "h2" },
            { title: "Subheading", value: "h3" },
            { title: "Quote", value: "blockquote" },
          ],
          lists: [
            { title: "Bulleted", value: "bullet" },
            { title: "Numbered", value: "number" },
          ],
          marks: {
            decorators: [
              { title: "Bold", value: "strong" },
              { title: "Italic", value: "em" },
            ],
            annotations: [
              defineArrayMember({
                name: "externalLink",
                type: "object",
                title: "Link",
                fields: [
                  defineField({
                    name: "href",
                    type: "url",
                    title: "URL",
                    validation: (rule) =>
                      rule.uri({ scheme: ["http", "https", "mailto", "tel"] }).required(),
                  }),
                  defineField({
                    name: "newTab",
                    type: "boolean",
                    title: "Open in a new tab",
                    initialValue: false,
                  }),
                ],
              }),
            ],
          },
        }),
        defineArrayMember({ type: "media" }),
      ],
    }),
  ),
});

export const localeTypes = [localeString, localeText, localePortableText];
