import { cn } from "@/lib/utils";

type SectionLabelProps = {
  children: React.ReactNode;
  className?: string;
};

export function SectionLabel({ children, className }: SectionLabelProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-3 text-label text-gold uppercase",
        className,
      )}
    >
      <span className="w-10 h-px bg-gradient-to-r from-transparent via-gold to-transparent" />
      <span>{children}</span>
    </div>
  );
}
