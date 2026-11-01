import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

/**
 * The project's type scale, declared to tailwind-merge.
 *
 * Without this it cannot tell `text-title-1` from `text-white` — both are
 * `text-*`, and anything it does not recognise as a size it treats as a colour.
 * The two then look like one conflict and the *size* silently loses, so
 * `cn("text-title-1 text-white")` used to return `text-white` alone and the
 * heading rendered at inherited body size.
 *
 * Kept in step with the `--text-*` tokens in styles/tokens.css.
 */
const fontSizes = ["micro", "caption", "body", "lead", "title-3", "title-2", "title-1", "display"];

const twMerge = extendTailwindMerge({ extend: { theme: { text: fontSizes } } });

/** Merge conditional class names, resolving Tailwind conflicts last-wins. */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/** Remove nullish entries from an array while narrowing the element type. */
export function compact<T>(items: readonly (T | null | undefined)[]): T[] {
  return items.filter((item): item is T => item !== null && item !== undefined);
}

/** Clamp a number into an inclusive range. */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/** Map a value from one range to another. */
export function mapRange(
  value: number,
  inMin: number,
  inMax: number,
  outMin: number,
  outMax: number,
): number {
  if (inMax - inMin === 0) return outMin;
  return outMin + ((value - inMin) * (outMax - outMin)) / (inMax - inMin);
}

/** Zero-padded index used for editorial numbering (01, 02, 03…). */
export function ordinal(index: number, length = 2): string {
  return String(index + 1).padStart(length, "0");
}

/** Absolute URL builder for canonical tags, OG images and the sitemap. */
export function absoluteUrl(path: string, origin: string): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${origin.replace(/\/$/, "")}${normalized === "/" ? "" : normalized}`;
}
