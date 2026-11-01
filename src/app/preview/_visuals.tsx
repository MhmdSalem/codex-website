import type { ReactNode } from "react";

import { LINE, PALETTE } from "./_palette";

/**
 * The drawn furniture the sections sit on.
 *
 * Everything here is CSS or hand-drawn SVG: no stock photography, no gradient
 * hero wash, no floating dashboard render. A software company's own diagrams are
 * the only honest illustration available to it, so the "images" on this page are
 * the system drawn as a system.
 */

/** Blueprint ruling. Fades out towards the edges so it frames instead of tiling. */
export function GridPlate({
  size = 64,
  fade = "60%",
  className,
}: {
  size?: number;
  fade?: string;
  className?: string;
}) {
  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute inset-0 ${className ?? ""}`}
      style={{
        // At `faint` the ruling is invisible on black, which is the whole
        // complaint about the current site — a texture nobody can see is a flat
        // field. It has to read as a drawn surface.
        backgroundImage: `linear-gradient(to right, ${LINE.base} 1px, transparent 1px), linear-gradient(to bottom, ${LINE.base} 1px, transparent 1px)`,
        backgroundSize: `${size}px ${size}px`,
        maskImage: `radial-gradient(120% 100% at 50% 0%, #000 0%, #000 ${fade}, transparent 100%)`,
        WebkitMaskImage: `radial-gradient(120% 100% at 50% 0%, #000 0%, #000 ${fade}, transparent 100%)`,
      }}
    />
  );
}

/** The logo's bracket, blown up to architectural scale as a section frame. */
export function BracketMark({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 200 200"
      fill="none"
      stroke={PALETTE.terracotta}
      strokeWidth="2"
      className={className}
    >
      <path d="M78 24 20 100l58 76" />
      <path d="M122 24l58 76-58 76" />
      <path d="M108 12 92 188" />
    </svg>
  );
}

/** Corner ticks — a panel that is measured rather than rounded. */
export function Framed({
  children,
  tone = "line",
  className,
}: {
  children: ReactNode;
  tone?: "line" | "accent";
  className?: string;
}) {
  const colour = tone === "accent" ? PALETTE.terracotta : LINE.strong;

  return (
    <div className={`relative ${className ?? ""}`}>
      {(
        [
          "left-0 top-0 border-l border-t",
          "right-0 top-0 border-r border-t",
          "left-0 bottom-0 border-b border-l",
          "right-0 bottom-0 border-b border-r",
        ] as const
      ).map((position) => (
        <span
          key={position}
          aria-hidden
          className={`absolute size-3.5 ${position}`}
          style={{ borderColor: colour }}
        />
      ))}
      {children}
    </div>
  );
}

/** A measurement rule: the ticks down the edge of an engineering drawing. */
export function Rule({ className }: { className?: string }) {
  return (
    <div aria-hidden className={`flex flex-col justify-between ${className ?? ""}`}>
      {Array.from({ length: 9 }).map((_, index) => (
        <span
          key={index}
          className="block h-px"
          style={{
            width: index % 4 === 0 ? "1.75rem" : "0.75rem",
            background: index % 4 === 0 ? LINE.strong : LINE.base,
          }}
        />
      ))}
    </div>
  );
}

/**
 * The pipeline, drawn.
 *
 * Reads right to left with the page: scattered sources, one integration layer,
 * the system, the screen a decision is made on. This is the diagram the services
 * page argues in prose, which is why it replaces a paragraph rather than
 * decorating one.
 */
export function FlowDiagram() {
  const stages = [
    { label: "أنظمتك الحالية", note: "جداول، ERP، دفع" },
    { label: "طبقة الربط", note: "تحقق ومحاولات إعادة" },
    { label: "النظام", note: "صلاحيات وسجل وموافقات" },
    { label: "الشاشة", note: "قرار من رقم واحد" },
  ];

  return (
    <ol className="flex flex-col gap-4 md:flex-row md:items-stretch">
      {stages.map((stage, index) => (
        <li key={stage.label} className="flex flex-1 items-center gap-4">
          <div
            className="flex-1 px-5 py-6"
            style={{
              background: index === 2 ? PALETTE.clay : "transparent",
              border: `1px solid ${index === 2 ? PALETTE.terracottaDeep : LINE.base}`,
            }}
          >
            <span className="font-mono text-micro" style={{ color: PALETTE.ash }}>
              {String(index + 1).padStart(2, "0")}
            </span>
            <p className="mt-3 text-body" style={{ color: PALETTE.bone }}>
              {stage.label}
            </p>
            <p className="mt-1 text-caption" style={{ color: PALETTE.ash }}>
              {stage.note}
            </p>
          </div>

          {index < stages.length - 1 ? (
            <span
              aria-hidden
              className="hidden h-px w-6 shrink-0 md:block"
              style={{ background: PALETTE.terracottaDeep }}
            />
          ) : null}
        </li>
      ))}
    </ol>
  );
}

/**
 * A product window, drawn to scale.
 *
 * Not a screenshot: a real one would need a signed-in tenant and would date the
 * moment the UI changes. This shows the shape of the screen — chrome, a list, a
 * live state — which is what a visitor is actually reading for.
 */
export function ScreenMock({
  title,
  rows,
  badge,
  tint,
}: {
  title: string;
  rows: readonly { name: string; meta: string; state?: boolean }[];
  badge: { value: string; label: string };
  tint: string;
}) {
  return (
    <div className="overflow-hidden" style={{ background: tint, border: `1px solid ${LINE.base}` }}>
      <div
        className="flex items-center gap-2 px-4 py-3"
        style={{ borderBottom: `1px solid ${LINE.base}` }}
      >
        <span className="flex gap-1.5" aria-hidden>
          {[0, 1, 2].map((dot) => (
            <span key={dot} className="size-1.5" style={{ background: LINE.strong }} />
          ))}
        </span>
        <span className="font-mono text-micro" style={{ color: PALETTE.ash }}>
          {title}
        </span>
      </div>

      <div className="flex items-baseline gap-3 px-5 pt-5">
        <span
          className="font-display text-title-2 tabular-nums"
          style={{ color: PALETTE.terracotta }}
        >
          {badge.value}
        </span>
        <span className="text-caption" style={{ color: PALETTE.fog }}>
          {badge.label}
        </span>
      </div>

      <ul className="mt-4 px-5 pb-5">
        {rows.map((row) => (
          <li
            key={row.name}
            className="flex items-center justify-between gap-4 py-3"
            style={{ borderTop: `1px solid ${LINE.faint}` }}
          >
            <span className="min-w-0">
              <span className="block truncate text-caption" style={{ color: PALETTE.bone }}>
                {row.name}
              </span>
              <span className="block font-mono text-micro" style={{ color: PALETTE.ash }}>
                {row.meta}
              </span>
            </span>

            <span
              className="shrink-0 px-2 py-1 font-mono text-micro"
              style={{
                color: row.state ? PALETTE.ink : PALETTE.fog,
                background: row.state ? PALETTE.terracotta : "transparent",
                border: `1px solid ${row.state ? PALETTE.terracotta : LINE.base}`,
              }}
            >
              {row.state ? "تم" : "بانتظار"}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/**
 * Two arcs, one warm and one cool, at the scale of the section.
 *
 * The alternative to a flat black band is not a gradient — it is a shape with an
 * edge you can see. These are struck from the same centre as the mark above
 * them, so the section reads as one drawing rather than as decoration.
 */
export function ArcField({ className }: { className?: string }) {
  return (
    <div aria-hidden className={`pointer-events-none absolute inset-0 ${className ?? ""}`}>
      <svg viewBox="0 0 1200 700" className="size-full" preserveAspectRatio="xMidYMid slice">
        <defs>
          <clipPath id="preview-arc-clip">
            <rect width="1200" height="700" />
          </clipPath>
        </defs>
        <g clipPath="url(#preview-arc-clip)">
          <circle cx="1010" cy="150" r="430" fill={PALETTE.petrolDeep} />
          <circle
            cx="1010"
            cy="150"
            r="430"
            fill="none"
            stroke={PALETTE.petrol}
            strokeWidth="1.5"
          />
          <circle cx="200" cy="640" r="300" fill={PALETTE.clayDeep} />
          <circle
            cx="200"
            cy="640"
            r="300"
            fill="none"
            stroke={PALETTE.terracottaDeep}
            strokeWidth="1.5"
            opacity="0.6"
          />
          <path
            d="M0 470h1200"
            stroke={LINE.faint}
            strokeWidth="1"
            strokeDasharray="10 14"
            fill="none"
          />
        </g>
      </svg>
    </div>
  );
}
