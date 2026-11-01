import { cn } from "@/lib/utils";
import {
  LOGO_ACCENT_COLOUR,
  LOGO_ACCENT_PATH,
  LOGO_ASPECT,
  LOGO_VIEWBOX,
  LOGO_WORDMARK_COLOUR,
  LOGO_WORDMARK_PATH,
} from "./logo-paths";

export type LogoVariant = "full" | "mono";

interface LogoProps {
  /**
   * `full` paints the brand colours and is the default — the mark should look
   * like the mark. `mono` paints everything in `currentColor`, for surfaces
   * that invert or sit on an unknown background, where a fixed brand colour
   * would render as an inverted approximation of itself.
   */
  variant?: LogoVariant;
  className?: string;
}

/**
 * The CODEX TECH lockup, inline so it can inherit colour and take part in the
 * blend modes the chrome relies on. Sized by height: set one on the parent or
 * pass `h-*` and the width follows from the aspect ratio.
 *
 * Purely decorative on its own — the accessible name belongs to the link or
 * heading that wraps it, so the same mark can be a home link in the header and
 * a plain graphic elsewhere without announcing itself twice.
 *
 * Outlines are generated from the brand raster; see scripts/trace-logo.mjs.
 */
export function Logo({ variant = "full", className }: LogoProps) {
  const wordmark = variant === "full" ? LOGO_WORDMARK_COLOUR : "currentColor";
  const accent = variant === "full" ? LOGO_ACCENT_COLOUR : "currentColor";

  return (
    <svg
      viewBox={LOGO_VIEWBOX}
      // The mark is sized by height and its width follows from the ratio. Both
      // parts matter: Tailwind's preflight puts `max-width: 100%` on svg, which
      // inside a shrink-to-fit parent is circular — the parent waits on the
      // mark's width while the mark gets clamped to the collapsed result.
      style={{ aspectRatio: LOGO_ASPECT }}
      className={cn("w-auto max-w-none", className)}
      aria-hidden="true"
      focusable="false"
    >
      <path fill={wordmark} fillRule="evenodd" d={LOGO_WORDMARK_PATH} />
      <path fill={accent} fillRule="evenodd" d={LOGO_ACCENT_PATH} />
    </svg>
  );
}
