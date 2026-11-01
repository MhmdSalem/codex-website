import { IBM_Plex_Sans_Arabic, Inter_Tight, Space_Grotesk } from "next/font/google";

/**
 * Typefaces are self-hosted by next/font (no runtime request to Google) and
 * exposed as CSS variables consumed by the `--font-*` design tokens.
 */

const display = Space_Grotesk({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-display-src",
  fallback: ["Helvetica Neue", "Arial", "sans-serif"],
});

const sans = Inter_Tight({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans-src",
  fallback: ["Helvetica Neue", "Arial", "sans-serif"],
});

const arabic = IBM_Plex_Sans_Arabic({
  subsets: ["arabic", "latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
  variable: "--font-arabic-src",
  fallback: ["Segoe UI", "Tahoma", "sans-serif"],
});

/** Apply to <html> so every token resolves for both scripts. */
export const fontVariables = [display.variable, sans.variable, arabic.variable].join(" ");
