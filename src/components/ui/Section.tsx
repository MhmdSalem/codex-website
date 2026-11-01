import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SectionProps {
  children: ReactNode;
  id?: string;
  /** Vertical rhythm. `hero` fills the viewport, `flush` removes padding. */
  spacing?: "default" | "large" | "compact" | "hero" | "flush";
  className?: string;
  /** Accessible name for the section landmark. */
  label?: string;
}

const spacingClass: Record<NonNullable<SectionProps["spacing"]>, string> = {
  default: "py-section",
  large: "py-section-lg",
  compact: "py-block",
  // Full-viewport only from `lg`. On a phone that pinning leaves a black
  // screen with the title on the last line — the page looks empty, not opened.
  hero: "py-block lg:flex lg:min-h-[calc(100svh-var(--header-height))] lg:flex-col lg:justify-end lg:pb-section lg:pt-0",
  flush: "",
};

/**
 * A full-width page section. Sections own vertical rhythm; the components
 * inside them own horizontal rhythm through `Container`.
 */
export function Section({ children, id, spacing = "default", className, label }: SectionProps) {
  return (
    <section
      id={id}
      aria-label={label}
      data-section={id}
      className={cn("relative w-full", spacingClass[spacing], className)}
    >
      {children}
    </section>
  );
}
