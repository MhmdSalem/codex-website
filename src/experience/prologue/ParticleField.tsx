"use client";

import { forwardRef, useImperativeHandle, useRef } from "react";

import { stageTuning } from "./config";
import type { PointerState, StageState } from "./state";
import { useIsomorphicLayoutEffect } from "@/motion/hooks/useIsomorphicLayoutEffect";

export interface ParticleFieldHandle {
  /** Called once per frame by the stage, after the master timeline has run. */
  render: (state: StageState, pointer: PointerState, delta: number) => void;
}

interface Particle {
  /** CSS pixels. */
  x: number;
  y: number;
  /** Pixels per second. */
  vx: number;
  vy: number;
  /** Depth, 0.3 (far) to 1 (near). Drives size, speed and base brightness. */
  depth: number;
  radius: number;
  alpha: number;
}

interface ParticleFieldProps {
  className?: string;
  lowPower?: boolean;
}

/**
 * Dust in an unlit room.
 *
 * A 2D canvas rather than WebGL: there is no lighting model and no geometry
 * here, so 90 pre-rendered sprites cost a fraction of a GPU context and keep
 * Three.js off a route that does not need it.
 *
 * The reveal is the point. Particles inside the pointer's light are bright;
 * everything else stays nearly invisible, so the visitor has to move the light
 * to discover that the void has any volume at all.
 */
export const ParticleField = forwardRef<ParticleFieldHandle, ParticleFieldProps>(
  function ParticleField({ className, lowPower = false }, ref) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const contextRef = useRef<CanvasRenderingContext2D | null>(null);
    const spriteRef = useRef<HTMLCanvasElement | null>(null);
    const particlesRef = useRef<Particle[]>([]);
    const sizeRef = useRef({ width: 0, height: 0, ratio: 1 });

    useIsomorphicLayoutEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const context = canvas.getContext("2d", { alpha: true });
      if (!context) return;
      contextRef.current = context;

      // One pre-rendered soft dot, drawn many times. Building a radial gradient
      // per particle per frame is the usual reason a field like this stutters.
      const sprite = document.createElement("canvas");
      const spriteSize = 64;
      sprite.width = spriteSize;
      sprite.height = spriteSize;
      const spriteContext = sprite.getContext("2d");
      if (spriteContext) {
        const half = spriteSize / 2;
        // A bright core with a fast falloff and a long faint halo. A gentle
        // gradient reads as bokeh; dust needs a point of light in the middle.
        const gradient = spriteContext.createRadialGradient(half, half, 0, half, half, half);
        gradient.addColorStop(0, "rgba(236, 233, 226, 1)");
        gradient.addColorStop(0.12, "rgba(236, 233, 226, 0.62)");
        gradient.addColorStop(0.3, "rgba(236, 233, 226, 0.16)");
        gradient.addColorStop(0.6, "rgba(236, 233, 226, 0.03)");
        gradient.addColorStop(1, "rgba(236, 233, 226, 0)");
        spriteContext.fillStyle = gradient;
        spriteContext.fillRect(0, 0, spriteSize, spriteSize);
      }
      spriteRef.current = sprite;

      const seed = () => {
        const { width, height } = sizeRef.current;
        const count = lowPower ? stageTuning.particleCountLow : stageTuning.particleCount;

        particlesRef.current = Array.from({ length: count }, () => {
          const depth = 0.3 + Math.random() * 0.7;
          return {
            x: Math.random() * width,
            y: Math.random() * height,
            // Slow enough to read as suspended rather than falling.
            vx: (Math.random() - 0.5) * 5 * depth,
            vy: (Math.random() - 0.5) * 5 * depth - 1.5 * depth,
            depth,
            radius: 0.6 + depth * 1.1,
            alpha: 0.1 + Math.random() * 0.3,
          };
        });
      };

      const resize = () => {
        const ratio = Math.min(window.devicePixelRatio || 1, stageTuning.maxPixelRatio);
        const width = canvas.clientWidth;
        const height = canvas.clientHeight;
        if (width === 0 || height === 0) return;

        const changed = width !== sizeRef.current.width || height !== sizeRef.current.height;
        sizeRef.current = { width, height, ratio };

        canvas.width = Math.round(width * ratio);
        canvas.height = Math.round(height * ratio);
        context.setTransform(ratio, 0, 0, ratio, 0, 0);

        if (changed || particlesRef.current.length === 0) seed();
      };

      resize();
      window.addEventListener("resize", resize, { passive: true });

      return () => {
        window.removeEventListener("resize", resize);
        contextRef.current = null;
        spriteRef.current = null;
        particlesRef.current = [];
      };
    }, [lowPower]);

    useImperativeHandle(
      ref,
      (): ParticleFieldHandle => ({
        render(state, pointer, delta) {
          const context = contextRef.current;
          const sprite = spriteRef.current;
          if (!context || !sprite) return;

          const { width, height } = sizeRef.current;
          context.clearRect(0, 0, width, height);

          if (state.particles <= 0.001) return;

          // Additive blending: overlapping dust accumulates into a soft haze
          // instead of stacking into hard discs.
          context.globalCompositeOperation = "lighter";

          const radius = stageTuning.discoverRadius;
          const reveal = pointer.engaged ? state.light : 0;
          const margin = 40;

          for (const particle of particlesRef.current) {
            particle.x += particle.vx * delta;
            particle.y += particle.vy * delta;

            // Wrap rather than respawn, so the field never visibly repopulates.
            if (particle.x < -margin) particle.x = width + margin;
            else if (particle.x > width + margin) particle.x = -margin;
            if (particle.y < -margin) particle.y = height + margin;
            else if (particle.y > height + margin) particle.y = -margin;

            const dx = particle.x - pointer.x;
            const dy = particle.y - pointer.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            const near = distance < radius ? 1 - distance / radius : 0;
            // Squared falloff keeps the pool's edge soft and its centre bright.
            const lit = near * near * reveal;

            const alpha = particle.alpha * state.particles * (0.16 + lit * 1.6);
            if (alpha <= 0.002) continue;

            // Lit motes swell very slightly, the way dust does when it crosses
            // a beam. Anything more would read as a hover effect.
            const size = particle.radius * (5 + lit * 2);
            context.globalAlpha = Math.min(alpha, 1);
            context.drawImage(sprite, particle.x - size / 2, particle.y - size / 2, size, size);
          }

          context.globalAlpha = 1;
          context.globalCompositeOperation = "source-over";
        },
      }),
      [],
    );

    return <canvas ref={canvasRef} className={className} aria-hidden="true" />;
  },
);
