import { createClient } from "next-sanity";
import { env, sanityProjectId } from "../env";

/**
 * Read-only client for published content.
 *
 * `useCdn` is on: responses come from Sanity's edge cache and are invalidated
 * by the revalidation webhook, which is far cheaper than polling the API.
 */
export const client = createClient({
  projectId: sanityProjectId,
  dataset: env.sanity.dataset,
  apiVersion: env.sanity.apiVersion,
  useCdn: true,
  perspective: "published",
});

/**
 * Client for draft content. Requires a read token and never uses the CDN.
 */
export function createDraftClient(token: string) {
  return client.withConfig({
    token,
    useCdn: false,
    perspective: "drafts",
    stega: {
      enabled: true,
      studioUrl: "/studio",
    },
  });
}
