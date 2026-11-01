"use client";

import { useEffect, useRef, useState } from "react";
import { useMotionCapability } from "@/motion/hooks/useMotionPreference";
import { cn } from "@/lib/utils";

interface LazyVideoProps {
  src: string;
  poster?: string;
  className?: string;
  /** Decorative background video: muted, looping, no controls. */
  ambient?: boolean;
}

/**
 * A video that costs nothing until it is nearly on screen.
 *
 * The `src` is withheld until the element enters a 200px pre-roll margin, so
 * off-screen video never competes for bandwidth with the initial render.
 * Ambient video does not autoplay under reduced motion — it holds its poster
 * frame and exposes controls instead.
 */
export function LazyVideo({ src, poster, className, ambient = true }: LazyVideoProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [shouldLoad, setShouldLoad] = useState(false);
  const { prefersReducedMotion, isLowPower } = useMotionCapability();

  useEffect(() => {
    const element = containerRef.current;
    if (!element || shouldLoad) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setShouldLoad(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px" },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [shouldLoad]);

  const autoplay = ambient && !prefersReducedMotion;

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !shouldLoad || !autoplay) return;

    // Autoplay can still be refused (low power mode, data saver); the poster
    // remains visible in that case, which is an acceptable outcome.
    void video.play().catch(() => undefined);
  }, [shouldLoad, autoplay]);

  return (
    <div ref={containerRef} className={cn("relative overflow-hidden", className)}>
      <video
        ref={videoRef}
        poster={poster}
        muted={autoplay}
        loop={ambient}
        playsInline
        controls={!autoplay}
        preload={isLowPower ? "none" : "metadata"}
        aria-hidden={ambient ? true : undefined}
        className="h-full w-full object-cover"
        {...(shouldLoad ? { src } : {})}
      />
    </div>
  );
}
