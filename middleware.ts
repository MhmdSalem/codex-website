import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";
import { defaultLocale, isValidLocale, locales } from "./lib/i18n/config";

const SESSION_COOKIE = "codex_session";

/**
 * Subdomain that hosts the admin dashboard.
 * `dashboard.codex-me.com` is the production target; `dashboard.localhost` is
 * useful for local testing via /etc/hosts.
 */
const DASHBOARD_HOST_PREFIX = "dashboard.";

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
  const host = (request.headers.get("host") ?? "").toLowerCase();
  const hostname = host.split(":")[0];
  const isDevelopment = process.env.NODE_ENV !== "production";
  // In development we also treat plain `localhost` / `127.0.0.1` as the
  // dashboard host so devs can hit `http://localhost:3000/admin` directly
  // without configuring `dashboard.localhost` in their hosts file.
  const isDevLoopback =
    isDevelopment && (hostname === "localhost" || hostname === "127.0.0.1");
  const isDashboardHost =
    host.startsWith(DASHBOARD_HOST_PREFIX) || isDevLoopback;

  // ── 1. Block admin pages from being served on the public domain ──────────
  // /admin and any of its subpaths must only ever appear on the dashboard
  // subdomain. Returning 404 keeps the URL out of search results and prevents
  // accidental discovery.
  if (!isDashboardHost && pathname.startsWith("/admin")) {
    return new NextResponse("Not Found", { status: 404 });
  }

  // ── 2. On dashboard host, "/" should land directly on the admin app ──────
  // Skipped on dev loopback so that `http://localhost:3000/` still serves the
  // public site locally.
  if (
    isDashboardHost &&
    !isDevLoopback &&
    (pathname === "/" || pathname === "")
  ) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin";
    return NextResponse.redirect(url);
  }

  // ── 3. Admin auth gate (works for any host, but main host already 404'd) ─
  if (pathname.startsWith("/admin")) {
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

  // ── 4. On the dashboard host, redirect any non-admin URL to the main site ─
  // This prevents the public locale-prefixed pages from being reachable via
  // the dashboard subdomain (cleaner SEO and fewer canonical conflicts).
  // Skipped on dev loopback so the public site stays reachable on localhost.
  if (isDashboardHost && !isDevLoopback) {
    const mainHost = host.replace(DASHBOARD_HOST_PREFIX, "");
    const url = request.nextUrl.clone();
    url.host = mainHost;
    url.protocol = "https:";
    url.port = "";
    return NextResponse.redirect(url);
  }

  // ── 5. Locale handling for the public site ───────────────────────────────
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
