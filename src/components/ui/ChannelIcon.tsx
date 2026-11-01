import type { ChannelKind } from "@/content/contact";
import { cn } from "@/lib/utils";

/**
 * Marks for the three ways to reach us, drawn as the same thin line as the
 * social glyphs. The word is the accessible name; the drawing sits beside the
 * address so the row does not need a second label.
 */
export function ChannelIcon({ kind, className }: { kind: ChannelKind; className?: string }) {
  const attrs = {
    viewBox: "0 0 24 24",
    className: cn("size-4 shrink-0", className),
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.25",
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
    focusable: false,
  };

  switch (kind) {
    case "email":
      return (
        <svg {...attrs}>
          <rect x="3.75" y="6.25" width="16.5" height="11.5" rx="1.75" />
          <path d="M5 8.25 12 13l7-4.75" />
        </svg>
      );
    case "phone":
      return (
        <svg {...attrs}>
          <path d="M8.1 4.8 9.8 6.5c.35.35.4.9.15 1.35l-.95 1.7c1.55 2.95 3.9 5.25 6.9 6.7l1.7-1c.45-.25 1-.2 1.35.15l1.7 1.7c.45.45.4 1.2-.1 1.6l-1.4 1.15c-.55.45-1.3.55-2 .3-5.9-2.15-9.7-6.5-11.2-12.7-.2-.7-.1-1.45.4-1.95L6.5 4.9c.45-.5 1.2-.55 1.6-.1Z" />
        </svg>
      );
    case "whatsapp":
      return (
        <svg {...attrs}>
          <path d="M12 4.5c3.95 0 7.15 2.95 7.15 6.6 0 3.65-3.2 6.6-7.15 6.6-1.15 0-2.25-.25-3.2-.7L5.1 18.6l.9-3.2A6.2 6.2 0 0 1 4.85 11.1C4.85 7.45 8.05 4.5 12 4.5Z" />
          <path d="M8.85 9.85c.2 2.15 1.9 3.9 4.05 4.15.3 0 .55-.2.6-.45l.2-.7c.05-.25-.05-.5-.3-.6l-.9-.4c-.2-.1-.45 0-.55.2l-.2.35c-1-.4-1.55-1.05-1.8-2.05l.35-.2c.2-.1.25-.35.15-.55l-.45-.85c-.15-.25-.4-.3-.6-.2l-.6.25c-.3.1-.45.4-.4.7Z" />
        </svg>
      );
  }
}
