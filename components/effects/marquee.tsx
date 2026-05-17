"use client";

import { Asterisk } from "lucide-react";
import { cn } from "@/lib/utils";

type MarqueeProps = {
  items: string[];
  className?: string;
  reverse?: boolean;
  size?: "sm" | "md" | "lg";
};

export function Marquee({
  items,
  className,
  reverse = false,
  size = "md",
}: MarqueeProps) {
  const sizes = {
    sm: "text-2xl sm:text-3xl",
    md: "text-4xl sm:text-5xl md:text-6xl",
    lg: "text-5xl sm:text-7xl md:text-8xl",
  };

  // Duplicate for seamless loop
  const list = [...items, ...items];

  return (
    <div className={cn("marquee-container py-6", className)}>
      <div
        className={cn(
          "flex items-center gap-10 whitespace-nowrap",
          reverse ? "animate-marquee-reverse" : "animate-marquee",
          sizes[size],
        )}
        style={{ width: "max-content" }}
      >
        {list.map((item, i) => (
          <div key={i} className="flex items-center gap-10">
            <span className="font-display font-bold tracking-tight text-foreground-muted/40 hover:text-gold transition-colors">
              {item}
            </span>
            <Asterisk
              className="w-6 h-6 text-gold/60 shrink-0"
              aria-hidden="true"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
