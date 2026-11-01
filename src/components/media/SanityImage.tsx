import NextImage from "next/image";
import { urlForImage } from "@cms/lib/image";
import type { SanityImage as SanityImageData } from "@cms/types";
import { cn } from "@/lib/utils";

interface SanityImageProps {
  image: SanityImageData | null | undefined;
  alt: string;
  /** Responsive sizes hint. Always set this for anything not full-bleed. */
  sizes?: string;
  /** Only for genuinely above-the-fold imagery — usually one per page. */
  priority?: boolean;
  fill?: boolean;
  quality?: number;
  className?: string;
}

/**
 * Sanity image rendered through next/image.
 *
 * Intrinsic dimensions and the blur placeholder both come from asset metadata,
 * so images reserve their space before they load and never shift the layout.
 */
export function SanityImage({
  image,
  alt,
  sizes = "100vw",
  priority = false,
  fill = false,
  quality = 90,
  className,
}: SanityImageProps) {
  if (!image?.asset?._ref) return null;

  const url = urlForImage(image).url();
  const blur = image.lqip ?? undefined;
  const width = image.dimensions?.width ?? 1920;
  const height = image.dimensions?.height ?? 1080;

  const shared = {
    src: url,
    alt,
    sizes,
    quality,
    priority,
    loading: priority ? ("eager" as const) : ("lazy" as const),
    className: cn("h-auto w-full object-cover", className),
    ...(blur ? { placeholder: "blur" as const, blurDataURL: blur } : {}),
  };

  if (fill) {
    return <NextImage {...shared} fill className={cn("object-cover", className)} />;
  }

  return <NextImage {...shared} width={width} height={height} />;
}
