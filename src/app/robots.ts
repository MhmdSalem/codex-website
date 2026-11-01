import type { MetadataRoute } from "next";
import { env } from "@/lib/env";

export default function robots(): MetadataRoute.Robots {
  const isLive = !env.siteUrl.includes("localhost");

  return {
    rules: isLive
      ? [
          {
            userAgent: "*",
            allow: "/",
            // `design`, `plan-b` and `prototype` are internal: a token page and
            // two concept builds kept in the repo for reference. They ship with
            // the app, so they are named here rather than left to be found.
            disallow: ["/studio", "/design", "/plan-b", "/prototype", "/api/"],
          },
        ]
      : [{ userAgent: "*", disallow: "/" }],
    sitemap: `${env.siteUrl}/sitemap.xml`,
    host: env.siteUrl,
  };
}
