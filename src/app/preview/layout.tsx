import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";

import "../globals.css";

import { fontVariables } from "@/lib/fonts";

/**
 * Root layout for the redesign previews.
 *
 * Outside `[locale]` on purpose: these are two proposals to look at, not pages
 * of the site. Arabic and RTL because that is the published language — a
 * direction approved in English would have to be re-judged the moment the real
 * type arrived. No header, footer, smooth scroll or page transitions, so what is
 * being judged is the section treatment and nothing else.
 */
export const metadata: Metadata = {
  title: "CODEX TECH — مقترحات الشكل",
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function PreviewLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ar" dir="rtl" className={fontVariables}>
      <body className="bg-black text-foreground antialiased">{children}</body>
    </html>
  );
}
