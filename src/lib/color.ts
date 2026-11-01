/**
 * Colour maths for the design system.
 *
 * The palette makes a hard promise — `signal` fills, `signal-bright` writes —
 * and that promise is only worth something if it is checked. These helpers let
 * the design reference compute its own contrast ratios instead of quoting
 * numbers that quietly go stale the next time a hex changes.
 */

export interface Rgb {
  r: number;
  g: number;
  b: number;
}

export function hexToRgb(hex: string): Rgb {
  const value = hex.replace("#", "");
  const full =
    value.length === 3
      ? value
          .split("")
          .map((char) => char + char)
          .join("")
      : value;

  return {
    r: Number.parseInt(full.slice(0, 2), 16),
    g: Number.parseInt(full.slice(2, 4), 16),
    b: Number.parseInt(full.slice(4, 6), 16),
  };
}

/** WCAG 2.1 relative luminance. */
export function relativeLuminance(hex: string): number {
  const { r, g, b } = hexToRgb(hex);

  const channel = (value: number) => {
    const srgb = value / 255;
    return srgb <= 0.03928 ? srgb / 12.92 : ((srgb + 0.055) / 1.055) ** 2.4;
  };

  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}

/** WCAG 2.1 contrast ratio, 1–21. */
export function contrastRatio(foreground: string, background: string): number {
  const a = relativeLuminance(foreground);
  const b = relativeLuminance(background);
  const [lighter, darker] = a > b ? [a, b] : [b, a];
  return (lighter + 0.05) / (darker + 0.05);
}

export type ContrastUse = "body" | "large" | "ui";

/** Minimum ratio each role must clear. */
export const contrastFloor: Record<ContrastUse, number> = {
  body: 4.5,
  large: 3,
  ui: 3,
};

export function passesContrast(
  foreground: string,
  background: string,
  use: ContrastUse = "body",
): boolean {
  return contrastRatio(foreground, background) >= contrastFloor[use];
}

export function formatRatio(ratio: number): string {
  return `${ratio.toFixed(2)}:1`;
}
