import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";
import { defaultLocale, isValidLocale, locales } from "./lib/i18n/config";

const SESSION_COOKIE = "codex_session";

async function isValidSession(token: string | undefined): Promise<boolean> {
  if (!token) return false;
  const secret = process.env.AUTH_SECRET;
  if (!secret) return false;
  try {
    await jwtVerify(token, new TextEncoder().encode(secret));
    return true;
  } catch {
    return false;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ── Admin area protection ───────────────────────────────────────────────
  if (pathname.startsWith("/admin")) {
    // Allow login page itself
    const isLoginPage = pathname === "/admin/login";
    const token = request.cookies.get(SESSION_COOKIE)?.value;
    const valid = await isValidSession(token);

    if (isLoginPage && valid) {
      const url = request.nextUrl.clone();
      url.pathname = "/admin";
      return NextResponse.redirect(url);
    }
    if (!isLoginPage && !valid) {
      const url = request.nextUrl.clone();
      url.pathname = "/admin/login";
      url.searchParams.set("from", pathname);
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  // ── Locale handling for the public site ─────────────────────────────────
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`,
  );

  if (pathnameHasLocale) return NextResponse.next();

  const cookieLocale = request.cookies.get("NEXT_LOCALE")?.value;
  const headerLocale = request.headers
    .get("accept-language")
    ?.split(",")[0]
    ?.split("-")[0]
    ?.toLowerCase();

  let locale: string = defaultLocale;
  if (cookieLocale && isValidLocale(cookieLocale)) {
    locale = cookieLocale;
  } else if (headerLocale && isValidLocale(headerLocale)) {
    locale = headerLocale;
  }

  request.nextUrl.pathname = `/${locale}${pathname}`;
  return NextResponse.redirect(request.nextUrl);
}

export const config = {
  matcher: [
    "/((?!_next|api|favicon.ico|robots.txt|sitemap.xml|uploads|.*\\..*).*)",
  ],
};
