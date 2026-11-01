import { draftMode } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";
import { defaultLocale, isLocale } from "@/i18n/routing";
import { serverEnv } from "@/lib/env";

/**
 * Enables draft mode and redirects to the previewed page.
 *
 * Called from the Studio's preview pane or a bookmarked URL:
 *   /api/draft/enable?secret=...&path=/work/atlas&locale=en
 *
 * The redirect target is validated as a same-site relative path so this
 * endpoint can never be used as an open redirect.
 */
export async function GET(request: NextRequest) {
  const secret = serverEnv.previewSecret;
  const { searchParams } = request.nextUrl;

  if (!secret) {
    return NextResponse.json({ message: "Preview is not configured." }, { status: 501 });
  }

  if (searchParams.get("secret") !== secret) {
    return NextResponse.json({ message: "Invalid secret." }, { status: 401 });
  }

  const requestedLocale = searchParams.get("locale") ?? defaultLocale;
  const locale = isLocale(requestedLocale) ? requestedLocale : defaultLocale;

  const requestedPath = searchParams.get("path") ?? "/";
  const path =
    requestedPath.startsWith("/") && !requestedPath.startsWith("//") ? requestedPath : "/";

  const draft = await draftMode();
  draft.enable();

  return NextResponse.redirect(new URL(`/${locale}${path === "/" ? "" : path}`, request.url));
}
