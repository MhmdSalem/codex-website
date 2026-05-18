/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      { protocol: "https", hostname: "**" },
    ],
  },
  // We are on Next.js 14.x which still uses the experimental key.
  // (Next.js 15+ moved this to top-level `serverExternalPackages`.)
  experimental: {
    optimizePackageImports: ["lucide-react", "framer-motion"],
    serverComponentsExternalPackages: ["mongoose", "bcryptjs"],
  },
};

export default nextConfig;
