import type { ModuleId } from "./scene";

/**
 * The six module glyphs.
 *
 * Drawn on a 24-unit grid at one stroke weight so the set reads as one family.
 * Hand-drawn rather than imported: an icon library would ship several hundred
 * paths to use six of them, and none of the six would share a weight with the
 * rest of the interface.
 */
const paths: Record<ModuleId, string> = {
  // A browser frame with its chrome bar.
  webPlatforms: "M3.5 5.5h17v13h-17zM3.5 9.5h17M6 7.5h.01M8.5 7.5h.01",
  /*
    A brain: one centre line and two mirrored lobes.

    Written as a mirrored pair rather than a single outline so the two halves are
    provably identical — an asymmetric brain at 20px reads as a smudge.
  */
  aiSolutions:
    "M12 6.4v11.4" +
    "M12 6.4a3 3 0 0 0-5.2 2c-1.1.4-1.8 1.5-1.8 2.7 0 .8.3 1.5.8 2.1-.2.4-.3.8-.3 1.3 0 1.6 1.3 2.8 2.8 2.8 1 0 1.9-.5 2.4-1.3" +
    "M12 6.4a3 3 0 0 1 5.2 2c1.1.4 1.8 1.5 1.8 2.7 0 .8-.3 1.5-.8 2.1.2.4.3.8.3 1.3 0 1.6-1.3 2.8-2.8 2.8-1 0-1.9-.5-2.4-1.3",
  // A handset.
  mobileApps:
    "M8.5 3.5h7a1.5 1.5 0 0 1 1.5 1.5v14a1.5 1.5 0 0 1-1.5 1.5h-7A1.5 1.5 0 0 1 7 19V5a1.5 1.5 0 0 1 1.5-1.5zM10.8 17.9h2.4",
  // Bars off a baseline.
  dataAnalytics: "M4 20h16M6.5 20v-5.5M11 20V8.5M15.5 20v-8M20 20V5.5",
  // A gear: eight teeth, a rim and a hub.
  automation:
    "M12 4v2.1M12 17.9V20M4 12h2.1M17.9 12H20M6.3 6.3l1.5 1.5M16.2 16.2l1.5 1.5M17.7 6.3l-1.5 1.5M7.8 16.2l-1.5 1.5" +
    "M12 7.6a4.4 4.4 0 1 0 0 8.8 4.4 4.4 0 0 0 0-8.8zM12 10.6a1.4 1.4 0 1 0 0 2.8 1.4 1.4 0 0 0 0-2.8z",
  // A puzzle piece: a tab on top, a socket on the trailing edge.
  integrations:
    "M6.5 5h3.1a2.4 2.4 0 0 1 4.8 0h3.1a1.5 1.5 0 0 1 1.5 1.5v3.1a2.4 2.4 0 0 0 0 4.8v3.1a1.5 1.5 0 0 1-1.5 1.5H6.5A1.5 1.5 0 0 1 5 17.5V6.5A1.5 1.5 0 0 1 6.5 5z",
};

/** The raw paths, for scenes that draw the glyphs inside their own SVG. */
export const modulePaths: Readonly<Record<ModuleId, string>> = paths;

export function ModuleGlyph({ id, className }: { id: ModuleId; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.3"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d={paths[id]} />
    </svg>
  );
}
