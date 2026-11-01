/**
 * Sanity configuration values.
 *
 * Re-exported from the app's validated environment module so the Studio and
 * the website can never drift apart. Imported relatively rather than through
 * the `@/` alias, because the Sanity CLI resolves this file outside Next.
 */
export { env, isSanityConfigured, sanityProjectId, serverEnv } from "../src/lib/env";
