import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/utils";

/**
 * Small label above a headline.
 *
 * Uppercase and wide tracking are correct for Latin and wrong for Arabic, so
 * the transform is stripped in RTL by the base stylesheet via `[data-eyebrow]`.
 */
export function Eyebrow({ children, className, ...rest }: ComponentPropsWithoutRef<"span">) {
  return (
    <span
      data-eyebrow
      className={cn(
        "font-mono text-micro tracking-wider text-muted uppercase",
        "inline-flex items-center gap-3",
        className,
      )}
      {...rest}
    >
      {children}
    </span>
  );
}
