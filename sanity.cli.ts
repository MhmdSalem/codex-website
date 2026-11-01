import { defineCliConfig } from "sanity/cli";
import { env, sanityProjectId } from "./sanity/env";

export default defineCliConfig({
  api: {
    projectId: sanityProjectId,
    dataset: env.sanity.dataset,
  },
  /** The Studio is served by Next.js at /studio, not deployed separately. */
  autoUpdates: false,
});
