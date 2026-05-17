import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "outline" | "ghost";
type Size = "sm" | "md" | "lg";

const variantClasses: Record<Variant, string> = {
  primary:
    "bg-gradient-gold text-foreground-inverse font-semibold shadow-gold-glow hover:shadow-gold-glow-lg",
  secondary:
    "bg-background-elevated text-foreground border border-border hover:border-gold/40 hover:bg-background-surface",
  outline:
    "border border-gold/40 text-gold hover:bg-gold/10 hover:border-gold/60",
  ghost: "text-foreground-muted hover:text-foreground hover:bg-white/5",
};

const sizeClasses: Record<Size, string> = {
  sm: "h-9 px-4 text-sm gap-1.5",
  md: "h-11 px-6 text-sm gap-2",
  lg: "h-13 px-8 text-base gap-2.5 py-3.5",
};

type BaseProps = {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: React.ReactNode;
};

type ButtonProps = BaseProps &
  Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, keyof BaseProps> & {
    href?: never;
  };

type AnchorProps = BaseProps &
  Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, keyof BaseProps> & {
    href: string;
  };

export function Button(props: ButtonProps | AnchorProps) {
  const {
    variant = "primary",
    size = "md",
    className,
    children,
    ...rest
  } = props;

  const classes = cn(
    "inline-flex items-center justify-center rounded-full transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:opacity-50 disabled:pointer-events-none whitespace-nowrap",
    variantClasses[variant],
    sizeClasses[size],
    className,
  );

  if ("href" in rest && rest.href) {
    const { href, ...anchorProps } = rest as AnchorProps;
    const isExternal = /^(https?:)?\/\//.test(href);
    if (isExternal) {
      return (
        <a
          {...anchorProps}
          href={href}
          target={anchorProps.target ?? "_blank"}
          rel={anchorProps.rel ?? "noopener noreferrer"}
          className={classes}
        >
          {children}
        </a>
      );
    }
    return (
      <Link {...(anchorProps as object)} href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button
      {...(rest as React.ButtonHTMLAttributes<HTMLButtonElement>)}
      className={classes}
    >
      {children}
    </button>
  );
}
