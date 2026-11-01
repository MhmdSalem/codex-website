import "server-only";

import { isSanityConfigured, serverEnv } from "../env";
import { client, createDraftClient } from "./client";
import { DEFAULT_REVALIDATE_SECONDS } from "./tags";

type QueryParams = Record<string, string | number | boolean | null>;

interface SanityFetchOptions<TParams extends QueryParams> {
  query: string;
  params?: TParams;
  /** Cache tags invalidated by the revalidation webhook. */
  tags?: readonly string[];
  /** Fallback ISR window in seconds. */
  revalidate?: number;
}

/**
 * The single entry point for reading published content.
 *
 * Deliberately fail-soft: with no Sanity project connected — or if the API is
 * unreachable during a build — this resolves to `null` and the calling section
 * renders its placeholder state. A CMS outage degrades the page, it does not
 * take the site down.
 *
 * Requests stay statically cacheable; draft content goes through
 * `sanityFetchDraft` instead, which is only reachable inside draft mode.
 */
export async function sanityFetch<TResult, TParams extends QueryParams = QueryParams>({
  query,
  params,
  tags = [],
  revalidate = DEFAULT_REVALIDATE_SECONDS,
}: SanityFetchOptions<TParams>): Promise<TResult | null> {
  if (!isSanityConfigured) return null;

  try {
    return await client.fetch<TResult>(query, params ?? {}, {
      next: {
        revalidate,
        tags: [...tags],
      },
    });
  } catch (error) {
    console.error("[sanity] Query failed, falling back to placeholder content.", error);
    return null;
  }
}

/**
 * Uncached read of draft content. Only called from routes that have already
 * verified draft mode, so it never affects the public, static render path.
 */
export async function sanityFetchDraft<TResult, TParams extends QueryParams = QueryParams>({
  query,
  params,
}: Pick<SanityFetchOptions<TParams>, "query" | "params">): Promise<TResult | null> {
  const token = serverEnv.sanityReadToken;
  if (!isSanityConfigured || !token) return null;

  try {
    return await createDraftClient(token).fetch<TResult>(query, params ?? {}, {
      cache: "no-store",
    });
  } catch (error) {
    console.error("[sanity] Draft query failed.", error);
    return null;
  }
}
