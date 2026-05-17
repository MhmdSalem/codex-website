import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

type LogoProps = {
  locale: string;
  className?: string;
  variant?: "default" | "compact" | "large";
};

const SIZE_MAP = {
  compact: { width: 36, height: 12 },
  default: { width: 110, height: 36 },
  large: { width: 180, height: 60 },
} as const;

export function Logo({ locale, className, variant = "default" }: LogoProps) {
  const { width, height } = SIZE_MAP[variant];

  return (
    <Link
      href={`/${locale}`}
      className={cn(
        "group inline-flex items-center select-none shrink-0",
        className,
      )}
      aria-label="Codex"
    >
      <Image
        src="/codex-logo.png"
        alt="Codex"
        width={width * 2}
        height={height * 2}
        priority
        className="h-auto w-auto transition-opacity duration-300 group-hover:opacity-90"
        style={{ height: `${height}px`, width: "auto" }}
      />
    </Link>
  );
}
