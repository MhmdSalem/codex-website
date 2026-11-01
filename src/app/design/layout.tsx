import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";

import "../globals.css";

import { fontVariables } from "@/lib/fonts";

/**
 * Root layout for the design reference.
 *
 * This route lives outside `[locale]` on purpose: it is an internal tool, not
 * a page of the site. It carries no header, no footer, no smooth scroll and no
 * translations, so what you see is the token layer and nothing else.
 */
export const metadata: Metadata = {
  title: "CODEX TECH — Design System",
  description: "Internal reference for the CODEX TECH visual language.",
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function DesignLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" dir="ltr" className={fontVariables}>
      <body className="bg-background text-foreground antialiased">{children}</body>
    </html>
  );
}
