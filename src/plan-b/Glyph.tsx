import { cn } from "@/lib/utils";

/**
 * The icon set, drawn on one 24-unit grid at one stroke weight.
 *
 * Deliberately small and deliberately local to Plan B. These are labels on
 * plates, not illustrations: at 16px anything with more than five strokes turns
 * into a grey square, so each of these is the fewest lines that still reads.
 */
export type GlyphName =
  | "sheet"
  | "chat"
  | "file"
  | "keyboard"
  | "database"
  | "clock"
  | "search"
  | "draft"
  | "code"
  | "launch"
  | "chart"
  | "badge"
  | "globe"
  | "bell";

const PATHS: Record<GlyphName, string> = {
  sheet: "M4 5h16v14H4zM4 10h16M10 10v9M15 10v9",
  chat: "M4 6h16v10H9l-4 3v-3H4zM8 11h8",
  file: "M6 3h8l4 4v14H6zM14 3v4h4M9 13h6M9 17h4",
  keyboard: "M3 7h18v10H3zM6 10h1M10 10h1M14 10h1M18 10h1M8 14h8",
  database:
    "M4 7c0-1.6 3.6-3 8-3s8 1.4 8 3-3.6 3-8 3-8-1.4-8-3zM4 7v10c0 1.6 3.6 3 8 3s8-1.4 8-3V7M4 12c0 1.6 3.6 3 8 3s8-1.4 8-3",
  clock: "M12 3a9 9 0 100 18 9 9 0 000-18zM12 7v5l4 2",
  search: "M11 4a7 7 0 100 14 7 7 0 000-14zM16 16l4 4",
  draft: "M4 20h16M6 16l10-10 3 3-10 10H6zM6 16v-1",
  code: "M9 8l-4 4 4 4M15 8l4 4-4 4",
  launch:
    "M12 3c3 2.4 4.5 5.6 4.5 9L12 20l-4.5-8c0-3.4 1.5-6.6 4.5-9zM12 10.5v.01M8 15l-2 5 4-2M16 15l2 5-4-2",
  chart: "M4 20h16M7 16v-5M12 16V7M17 16v-8",
  badge: "M7 3h10v11l-5 3-5-3zM10 8h4M12 20v-3",
  globe:
    "M12 3a9 9 0 100 18 9 9 0 000-18zM3 12h18M12 3c2.4 2.4 3.6 5.4 3.6 9s-1.2 6.6-3.6 9M12 3c-2.4 2.4-3.6 5.4-3.6 9s1.2 6.6 3.6 9",
  bell: "M12 4a5 5 0 015 5v4l2 3H5l2-3V9a5 5 0 015-5zM10 19a2 2 0 004 0",
};

export function Glyph({ name, className }: { name: GlyphName; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={cn("size-4 shrink-0", className)}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d={PATHS[name]} />
    </svg>
  );
}
