import { networkInterfaces } from "node:os";
import path from "node:path";
import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

/**
 * Every LAN address this machine answers on.
 *
 * The dev server blocks `/_next/*` requests from hosts it does not recognise, so
 * opening `http://<lan-ip>:3000` on a phone serves the HTML but none of the
 * client bundle — the page renders and then nothing hydrates. Detecting the
 * addresses instead of listing them keeps this working after DHCP hands out a
 * new one. Development only; the option has no effect on a production build.
 */
function lanHosts(): string[] {
  return Object.values(networkInterfaces())
    .flat()
    .filter((details) => details && details.family === "IPv4" && !details.internal)
    .map((details) => details!.address);
}

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  /** Extra hosts — a tunnel, say — can be added with DEV_ORIGINS=a.example,b.example. */
  allowedDevOrigins: [...lanHosts(), ...(process.env.DEV_ORIGINS?.split(",") ?? [])]
    .map((host) => host.trim())
    .filter(Boolean),
  /** Pin the workspace root; a stray lockfile further up the tree misleads it. */
  turbopack: {
    root: path.resolve(import.meta.dirname),
  },
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
        pathname: "/images/**",
      },
    ],
  },
  experimental: {
    optimizePackageImports: ["motion", "gsap", "lenis"],
  },
};

export default withNextIntl(nextConfig);
