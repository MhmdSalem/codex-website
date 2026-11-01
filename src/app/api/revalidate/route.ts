import { revalidateTag } from "next/cache";
import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { tagsForDocumentType } from "@cms/lib/tags";
import { serverEnv } from "@/lib/env";

/**
 * Sanity webhook target.
 *
 * Configure in Sanity → API → Webhooks with this projection:
 *   { "_type": _type, "slug": slug.current, "key": key }
 * and a shared secret sent as the `x-revalidate-secret` header.
 *
 * Only the tags touched by the changed document are invalidated, so editing
 * one project does not rebuild the entire site.
 */
const payloadSchema = z.object({
  _type: z.string().min(1),
  slug: z.string().optional(),
  key: z.string().optional(),
});

export async function POST(request: NextRequest) {
  const secret = serverEnv.revalidateSecret;

  if (!secret) {
    return NextResponse.json({ message: "Revalidation is not configured." }, { status: 501 });
  }

  if (request.headers.get("x-revalidate-secret") !== secret) {
    return NextResponse.json({ message: "Invalid secret." }, { status: 401 });
  }

  const parsed = payloadSchema.safeParse(await request.json().catch(() => null));

  if (!parsed.success) {
    return NextResponse.json({ message: "Invalid payload." }, { status: 400 });
  }

  const { _type, slug, key } = parsed.data;
  const tags = tagsForDocumentType(_type, slug ?? key);

  // `{ expire: 0 }` is the documented form for external webhooks: an editor
  // who hits publish expects the change to be live, not stale-while-revalidate.
  for (const tag of tags) {
    revalidateTag(tag, { expire: 0 });
  }

  return NextResponse.json({ revalidated: true, tags, now: Date.now() });
}
