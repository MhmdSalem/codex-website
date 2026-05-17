import { cn } from "@/lib/utils";

type SectionHeadingProps = {
  label?: string;
  title: string;
  subtitle?: string;
  align?: "left" | "center";
  className?: string;
};

export function SectionHeading({
  label,
  title,
  subtitle,
  align = "center",
  className,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4",
        align === "center" && "items-center text-center mx-auto max-w-3xl",
        className,
      )}
    >
      {label && (
        <span className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.2em] text-gold">
          <span className="w-6 h-px bg-gold/50" />
          {label}
          <span className="w-6 h-px bg-gold/50" />
        </span>
      )}
      <h2 className="text-display-md font-bold text-balance">{title}</h2>
      {subtitle && (
        <p className="text-base sm:text-lg text-foreground-muted leading-relaxed text-balance max-w-2xl">
          {subtitle}
        </p>
      )}
    </div>
  );
}
