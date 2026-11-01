import type { CSSProperties, ReactNode } from "react";

import { contrastFloor, contrastRatio, formatRatio, type ContrastUse } from "@/lib/color";
import { cn } from "@/lib/utils";

/* ---------------------------------------------------------------------------
   Layout primitives for the reference page only. Nothing here ships to the
   site — the site gets the tokens, this gets the explanation.
   ------------------------------------------------------------------------- */

export function Chapter({
  index,
  title,
  summary,
  children,
  theme,
}: {
  index: string;
  title: string;
  summary: string;
  children: ReactNode;
  theme?: "light";
}) {
  return (
    <section
      data-theme={theme}
      className="relative border-t border-hairline bg-background px-gutter py-block text-foreground"
    >
      <div className="mx-auto w-full max-w-wide">
        <header className="mb-block flex flex-col gap-4 md:flex-row md:items-baseline md:gap-10">
          <span className="font-mono text-micro tracking-wider text-subtle">{index}</span>
          <div className="max-w-measure-body">
            <h2 className="text-title-2">{title}</h2>
            <p className="mt-3 text-body text-muted">{summary}</p>
          </div>
        </header>
        {children}
      </div>
    </section>
  );
}

/** A named rule. The whole system is rules; this is how they are stated. */
export function Rule({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-2 border-t border-hairline py-4 md:flex-row md:gap-10">
      <dt className="w-56 shrink-0 font-mono text-micro tracking-wider text-subtle uppercase">
        {label}
      </dt>
      <dd className="max-w-measure-body text-caption text-muted">{children}</dd>
    </div>
  );
}

export function Rules({ children }: { children: ReactNode }) {
  return <dl className="border-b border-hairline">{children}</dl>;
}

/** Side-by-side verdicts. Half of a design system is what it forbids. */
export function Verdicts({ always, never }: { always: string[]; never: string[] }) {
  return (
    <div className="mt-block grid gap-px md:grid-cols-2">
      {(
        [
          ["Always", always, "text-positive"],
          ["Never", never, "text-alert"],
        ] as const
      ).map(([heading, items, tone]) => (
        <div key={heading} className="bg-surface p-6">
          <h3 className={cn("font-mono text-micro tracking-wider uppercase", tone)}>{heading}</h3>
          <ul className="mt-4 space-y-2">
            {items.map((item) => (
              <li key={item} className="text-caption text-muted">
                {item}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

export function Swatch({
  name,
  value,
  role,
  on,
  use = "body",
}: {
  name: string;
  value: string;
  role: string;
  /** Background this colour is measured against, when it carries text. */
  on?: string;
  use?: ContrastUse;
}) {
  const ratio = on ? contrastRatio(value, on) : null;
  const passes = ratio !== null && ratio >= contrastFloor[use];

  return (
    <div className="border-t border-hairline pt-3">
      <div
        className="h-20 w-full"
        style={{ backgroundColor: value, boxShadow: "inset 0 0 0 1px var(--color-hairline)" }}
      />
      <div className="mt-3 flex items-baseline justify-between gap-3">
        <span className="text-caption">{name}</span>
        <span className="font-mono text-micro text-subtle">{value}</span>
      </div>
      <p className="mt-1 text-micro tracking-normal text-subtle">{role}</p>
      {ratio !== null ? (
        <p className={cn("mt-2 font-mono text-micro", passes ? "text-positive" : "text-alert")}>
          {formatRatio(ratio)} · {use} ≥ {contrastFloor[use]}
        </p>
      ) : null}
    </div>
  );
}

export function Specimen({
  token,
  size,
  children,
  className,
  style,
}: {
  token: string;
  size: string;
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <div className="border-t border-hairline py-6">
      <div className="mb-3 flex gap-6 font-mono text-micro tracking-wider text-subtle">
        <span className="w-28">{token}</span>
        <span>{size}</span>
      </div>
      <div className={className} style={style}>
        {children}
      </div>
    </div>
  );
}

/** Compact label/value pair for numeric tokens. */
export function Metric({
  name,
  value,
  note,
  children,
}: {
  name: string;
  value: string;
  note?: string;
  children?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3 border-t border-hairline py-4 md:flex-row md:items-center">
      <span className="w-44 shrink-0 font-mono text-micro tracking-wider">{name}</span>
      <span className="w-32 shrink-0 font-mono text-micro text-subtle">{value}</span>
      {children ? <div className="min-w-0 flex-1">{children}</div> : null}
      {note ? <span className="flex-1 text-micro tracking-normal text-muted">{note}</span> : null}
    </div>
  );
}
