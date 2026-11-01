import { routes } from "@/i18n/routes";

/**
 * One glyph per destination, on the same 24-unit grid and stroke weight as the
 * service glyphs, so the tab bar and the content share a hand.
 */
const ICONS: Record<string, string> = {
  [routes.home]: "M4 11.5 12 5l8 6.5V19a1 1 0 0 1-1 1h-4.5v-5h-5v5H5a1 1 0 0 1-1-1z",
  [routes.about]: "M12 4a8 8 0 1 0 0 16 8 8 0 0 0 0-16zM12 11v5M12 8h.01",
  [routes.services]: "M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z",
  [routes.products]: "M12 3.5 20 8v8l-8 4.5L4 16V8zM4 8l8 4.5L20 8M12 12.5V20.5",
  [routes.pricing]: "M4 12V5h7l9 9-7 7zM8 9h.01",
  [routes.contact]: "M4 6h16v10H9l-5 4V6zM8 11h8",
};

const FALLBACK = "M5 12h14M12 5l7 7-7 7";

export function TabIcon({ href, className }: { href: string; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d={ICONS[href] ?? FALLBACK} />
    </svg>
  );
}
