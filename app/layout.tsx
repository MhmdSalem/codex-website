import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://codex-tech.com"),
  title: {
    default: "Codex — Smart Software Solutions",
    template: "%s · Codex",
  },
  description:
    "Codex builds ready-to-deploy software systems delivered on a simple monthly subscription. Save time, save cost, and grow your business.",
  applicationName: "Codex",
  authors: [{ name: "Codex" }],
  generator: "Next.js",
  keywords: ["Codex", "software", "SaaS", "Egypt", "subscription software"],
  referrer: "origin-when-cross-origin",
  creator: "Codex",
  publisher: "Codex",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    type: "website",
    siteName: "Codex",
    url: "https://codex-tech.com",
    title: "Codex — Smart Software Solutions",
    description:
      "Ready-to-deploy software systems delivered on a simple monthly subscription.",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "Codex" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Codex — Smart Software Solutions",
    description:
      "Ready-to-deploy software systems delivered on a simple monthly subscription.",
    images: ["/og.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export const viewport: Viewport = {
  themeColor: "#0A0A0F",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
