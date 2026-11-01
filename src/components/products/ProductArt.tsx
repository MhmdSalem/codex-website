import type { ProductId } from "@/content/catalog";
import { cn } from "@/lib/utils";

/**
 * Line drawings, not screenshots.
 *
 * A screenshot dates the day it was taken and promises a screen the reader may
 * not get. An outline of the object — a phone holding an invitation, a pass on a
 * lanyard — says what the product *is* and stays true through every redesign of
 * what it looks like. One accent element each, where the product does its work.
 */
function Invitation({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 96 132"
      className={cn("text-white/25", className)}
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      strokeLinecap="round"
      aria-hidden="true"
      focusable="false"
    >
      <rect x="18" y="4" width="60" height="124" rx="8" />
      <path d="M40 10h16" />
      <rect x="27" y="26" width="42" height="58" rx="3" className="text-accent" />
      <path d="M36 40h24M36 50h24M36 60h14" />
      <path d="M33 96h30M33 106h20" />
    </svg>
  );
}

function Pass({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 96 132"
      className={cn("text-white/25", className)}
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      strokeLinecap="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M40 4l8 20M56 4l-8 20" />
      <rect x="20" y="24" width="56" height="80" rx="5" />
      <path d="M43 24h10" />
      <rect x="30" y="38" width="20" height="20" rx="2" className="text-accent" />
      <path d="M56 42h12M56 50h8" />
      <path d="M30 70h36M30 80h24" />
      <path d="M30 92h14" className="text-accent" />
    </svg>
  );
}

export function ProductArt({ id, className }: { id: ProductId; className?: string }) {
  return id === "daawa" ? <Invitation className={className} /> : <Pass className={className} />;
}
