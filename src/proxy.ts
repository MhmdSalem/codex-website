import createMiddleware from "next-intl/middleware";
import { routing } from "@/i18n/routing";

/**
 * Locale negotiation and redirects.
 *
 * Next 16 renamed the `middleware` file convention to `proxy`; next-intl still
 * ships the handler factory under its original name, and the request/response
 * signature is unchanged.
 */
export default createMiddleware(routing);

export const config = {
  /**
   * Everything except API routes, the embedded Studio, the design reference, the
   * redesign previews, the Plan B concept, the motion prototypes, Next internals
   * and files with an extension. Unmatched paths get a locale prefix, so /work
   * redirects to /ar/work and unknown paths land on the localised 404.
   *
   * `plan-b` carries its own locale segment (`/plan-b/en`) and must be left
   * alone: negotiation here would rewrite it to `/en/plan-b`, which is not a
   * route. `design`, `prototype` and `preview` have no locale segment at all.
   */
  matcher: ["/((?!api|studio|design|prototype|preview|plan-b|_next|_vercel|.*\\..*).*)"],
};
