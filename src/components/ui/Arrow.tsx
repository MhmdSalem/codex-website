import { cn } from "@/lib/utils";

/**
 * The trailing arrow on a call to action.
 *
 * Leans out of the button on hover, which is why it lives next to `Button`
 * rather than inside it — the lean is driven by `group-hover`, so the glyph has
 * to be a child of the button that owns the group.
 *
 * Mirrored in RTL. "Forward" is a direction, not a fixed vector, and an arrow
 * pointing right in an Arabic layout points backwards.
 */
export function Arrow({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      className={cn(
        "size-4 shrink-0 transition-transform duration-[var(--duration-fast)] ease-out-expo",
        "group-hover:translate-x-0.5 rtl:-scale-x-100 rtl:group-hover:-translate-x-0.5",
        "motion-reduce:transition-none motion-reduce:group-hover:translate-x-0",
        className,
      )}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.25"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M2.75 8h10.5M9.5 4.25 13.25 8 9.5 11.75" />
    </svg>
  );
}
