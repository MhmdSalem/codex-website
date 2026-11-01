/**
 * The prototype's own icon set.
 *
 * Deliberately not imported from anywhere else in the project: this folder has
 * to be deletable in one move, and a shared icon module would tie it to a
 * concept it is meant to be tested against. Six paths on one 24-unit grid at one
 * stroke weight — at 16px anything busier turns into a grey smudge.
 */

export type IconName = "sheet" | "chat" | "file" | "mail" | "data" | "check";

const PATHS: Record<IconName, string> = {
  sheet: "M4 5h16v14H4zM4 10h16M10 10v9M15 10v9",
  chat: "M4 6h16v10H9l-4 3v-3H4zM8 11h8",
  file: "M6 3h8l4 4v14H6zM14 3v4h4M9 13h6M9 17h4",
  mail: "M3 6h18v12H3zM3 7l9 6 9-6",
  data: "M4 7c0-1.6 3.6-3 8-3s8 1.4 8 3-3.6 3-8 3-8-1.4-8-3zM4 7v10c0 1.6 3.6 3 8 3s8-1.4 8-3V7M4 12c0 1.6 3.6 3 8 3s8-1.4 8-3",
  check: "M4 12.5l5 5L20 6.5",
};

export function Icon({ name, className }: { name: IconName; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
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
