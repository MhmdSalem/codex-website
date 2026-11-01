import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

export type ButtonVariant = "primary" | "outline" | "accent" | "text";
export type ButtonSize = "sm" | "md" | "lg";

const base =
  "group relative inline-flex items-center justify-center gap-2 font-sans font-medium " +
  // `transition`, not `transition-colors`: the filled variant answers a hover
  // with a lift rather than a colour, so transform has to be in the list.
  "transition duration-[var(--duration-fast)] ease-out-expo " +
  "motion-reduce:transition-none motion-reduce:hover:translate-y-0 " +
  "disabled:pointer-events-none disabled:opacity-40";

const variantClass: Record<ButtonVariant, string> = {
  /*
    White label, by brand direction — which is why the fill is `accent-fill` and
    not `accent`. White on the house terracotta is 3.15:1 and fails AA for text;
    on the deepened tone it is 4.83:1 and passes. Same hue, one step darker.

    Hover lifts rather than lightens. With a white label a brighter fill would
    make it *less* legible, so the fill holds and the button moves instead.
  */
  primary: "bg-accent-fill text-white rounded-full hover:-translate-y-0.5",
  // Brightens on both axes — border and surface — and keeps its label white
  // rather than turning it accent-coloured, which would read as a state change
  // rather than a hover.
  outline:
    "border border-border-strong text-foreground rounded-full " +
    "hover:border-white/40 hover:bg-white/6 hover:-translate-y-0.5",
  /*
    The chrome CTA: an accent hairline around a transparent centre.

    Distinct from `outline` in one respect only — the border carries the brand
    colour instead of a neutral — which is what lets the header hold a call to
    action without a filled slab competing with the hero's own primary button.
    The label stays white rather than accent-coloured; accent type at 14px on
    black is legible but the border already spends the colour budget, and two
    accent elements inside one pill reads as a warning state.
  */
  accent:
    "border border-accent/70 text-foreground rounded-full " +
    "hover:border-accent hover:bg-accent/10 hover:-translate-y-0.5",
  text: "text-foreground hover:text-accent underline-offset-8 hover:underline",
};

const sizeClass: Record<ButtonSize, string> = {
  sm: "text-caption px-4 py-2",
  md: "text-body px-6 py-3",
  lg: "text-lead px-8 py-4",
};

interface CommonProps {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
}

type ButtonAsButton = CommonProps &
  Omit<ComponentPropsWithoutRef<"button">, keyof CommonProps> & {
    href?: never;
  };

type ButtonAsLink = CommonProps & {
  /** Internal paths are locale-prefixed automatically. */
  href: string;
  external?: boolean;
  newTab?: boolean;
};

export type ButtonProps = ButtonAsButton | ButtonAsLink;

function classesFor({ variant = "primary", size = "md", className }: CommonProps) {
  return cn(base, variantClass[variant], variant === "text" ? "" : sizeClass[size], className);
}

/**
 * The site's single interactive primitive.
 *
 * Renders a locale-aware `Link` for internal routes, a plain anchor for
 * anything that leaves the site, and a `button` otherwise — so the right
 * element always ends up in the accessibility tree.
 */
export function Button(props: ButtonProps) {
  const { children, variant, size, className } = props;
  const classes = classesFor({ children, variant, size, className });

  if ("href" in props && props.href !== undefined) {
    const { href, external, newTab } = props;

    if (external) {
      return (
        <a
          href={href}
          className={classes}
          {...(newTab ? { target: "_blank", rel: "noreferrer noopener" } : {})}
        >
          {children}
        </a>
      );
    }

    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  const {
    children: _children,
    variant: _variant,
    size: _size,
    className: _className,
    ...rest
  } = props;

  return (
    <button type="button" className={classes} {...rest}>
      {children}
    </button>
  );
}
