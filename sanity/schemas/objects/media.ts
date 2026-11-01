import { defineField, defineType } from "sanity";

/**
 * One media primitive for the whole site.
 *
 * Editors choose image or video; the frontend decides how it is revealed,
 * masked or parallaxed. Art direction lives in code, never in the CMS.
 */
export const media = defineType({
  name: "media",
  title: "Media",
  type: "object",
  fields: [
    defineField({
      name: "kind",
      title: "Type",
      type: "string",
      options: {
        list: [
          { title: "Image", value: "image" },
          { title: "Video", value: "video" },
        ],
        layout: "radio",
        direction: "horizontal",
      },
      initialValue: "image",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "image",
      title: "Image",
      type: "image",
      options: { hotspot: true },
      hidden: ({ parent }) => parent?.kind !== "image",
      validation: (rule) =>
        rule.custom((value, context) => {
          const parent = context.parent as { kind?: string } | undefined;
          if (parent?.kind === "image" && !value) return "An image is required";
          return true;
        }),
    }),
    defineField({
      name: "videoFile",
      title: "Video file",
      description: "Prefer an external URL for anything above ~10 MB.",
      type: "file",
      options: { accept: "video/mp4,video/webm" },
      hidden: ({ parent }) => parent?.kind !== "video",
    }),
    defineField({
      name: "videoUrl",
      title: "Video URL",
      description: "Direct MP4/WebM URL from a CDN or video host.",
      type: "url",
      hidden: ({ parent }) => parent?.kind !== "video",
    }),
    defineField({
      name: "poster",
      title: "Poster image",
      description: "Shown before the video loads. Strongly recommended.",
      type: "image",
      options: { hotspot: true },
      hidden: ({ parent }) => parent?.kind !== "video",
    }),
    defineField({
      name: "alt",
      title: "Alternative text",
      description: "Describe the content for screen readers. Required for accessibility.",
      type: "localeString",
    }),
    defineField({
      name: "caption",
      title: "Caption",
      type: "localeString",
    }),
    defineField({
      name: "aspectRatio",
      title: "Preferred aspect ratio",
      description: "A layout hint only; the frontend may override it per breakpoint.",
      type: "string",
      options: {
        list: [
          { title: "Original", value: "auto" },
          { title: "16:9 — cinematic", value: "16/9" },
          { title: "4:3 — classic", value: "4/3" },
          { title: "1:1 — square", value: "1/1" },
          { title: "3:4 — portrait", value: "3/4" },
          { title: "9:16 — vertical", value: "9/16" },
        ],
      },
      initialValue: "auto",
    }),
  ],
  preview: {
    select: {
      kind: "kind",
      media: "image",
      poster: "poster",
      caption: "caption.en",
    },
    prepare({ kind, media: image, poster, caption }) {
      return {
        title: caption || (kind === "video" ? "Video" : "Image"),
        subtitle: kind === "video" ? "Video" : "Image",
        media: image ?? poster,
      };
    },
  },
});
