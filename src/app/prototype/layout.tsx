import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";

import "../globals.css";

import { SmoothScrollProvider } from "@/components/providers/SmoothScrollProvider";
import { fontVariables } from "@/lib/fonts";

/**
 * Root layout for motion prototypes.
 *
 * Outside `[locale]`, next to the design reference, for the same reason: this is
 * a rig for testing one idea, not a page of the site. It carries the design
 * tokens, the fonts and the smooth scroll — the last one matters, because a
 * scrubbed timeline feels different under Lenis than under a raw scrollbar and
 * the point of a prototype is to feel what the real thing will feel like.
 *
 * It carries no header, no footer, no navigation and no translations. Nothing in
 * the site imports from `src/prototype/`, and nothing in `src/prototype/`
 * imports from the site beyond the tokens and two utilities.
 */
export const metadata: Metadata = {
  title: "CODEX TECH — Story Core prototype",
  description: "Internal motion prototype.",
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function PrototypeLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" dir="ltr" className={fontVariables}>
      <body className="bg-background text-foreground antialiased">
        <SmoothScrollProvider>
          <main id="main">{children}</main>
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
