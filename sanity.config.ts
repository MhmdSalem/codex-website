import { visionTool } from "@sanity/vision";
import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";

import { env, sanityProjectId } from "./sanity/env";
import { schemaTypes, singletonDocumentTypes } from "./sanity/schemas";
import { structure } from "./sanity/structure";

const singletons = new Set<string>(singletonDocumentTypes);

/** Singletons may be edited and published, but never created or deleted. */
const SINGLETON_ACTIONS = new Set(["publish", "discardChanges", "restore"]);

export default defineConfig({
  name: "codex-tech-studio",
  title: "CODEX TECH",
  basePath: "/studio",

  projectId: sanityProjectId,
  dataset: env.sanity.dataset,

  schema: {
    types: schemaTypes,
    templates: (templates) => templates.filter(({ schemaType }) => !singletons.has(schemaType)),
  },

  document: {
    actions: (actions, context) =>
      singletons.has(context.schemaType)
        ? actions.filter(({ action }) => action && SINGLETON_ACTIONS.has(action))
        : actions,
  },

  plugins: [structureTool({ structure }), visionTool({ defaultApiVersion: env.sanity.apiVersion })],
});
