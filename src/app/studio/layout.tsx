import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";

/**
 * Root layout for the embedded Studio.
 *
 * The Studio ships its own design system, so it deliberately skips the site's
 * fonts, tokens and providers — nothing from the marketing site leaks in.
 */
export const metadata: Metadata = {
  title: "CODEX TECH — Studio",
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  interactiveWidget: "resizes-content",
};

export default function StudioLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body style={{ margin: 0 }}>{children}</body>
    </html>
  );
}
