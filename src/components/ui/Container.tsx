import type { ElementType, ReactNode } from "react";
import { cn } from "@/lib/utils";

type ContainerWidth = "narrow" | "text" | "page" | "wide" | "full";

const widthClass: Record<ContainerWidth, string> = {
  narrow: "max-w-narrow",
  text: "max-w-text",
  page: "max-w-page",
  wide: "max-w-wide",
  full: "max-w-none",
};

interface ContainerProps {
  children: ReactNode;
  as?: ElementType;
  width?: ContainerWidth;
  /** Remove the horizontal gutter — for full-bleed media. */
  bleed?: boolean;
  className?: string;
}

/** Horizontal rhythm. The gutter is a fluid token, not a breakpoint ladder. */
export function Container({
  children,
  as: Tag = "div",
  width = "page",
  bleed = false,
  className,
}: ContainerProps) {
  return (
    <Tag className={cn("mx-auto w-full", widthClass[width], !bleed && "px-gutter", className)}>
      {children}
    </Tag>
  );
}
