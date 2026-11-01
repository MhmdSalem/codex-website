"use client";

import { Logo } from "@/components/ui/Logo";
import { useGsapScope } from "@/motion/hooks/useGsapScope";

import styles from "./build.module.css";
import { coreTarget } from "./coreTarget";

/** Radii of the rings around the mark, innermost first. */
export const CORE_RINGS = [
  { r: 104, dash: "2 10", width: 1.2, opacity: 0.9, speed: 48 },
  { r: 150, dash: "40 18", width: 1, opacity: 0.55, speed: -70 },
  { r: 204, dash: "1 7", width: 1.4, opacity: 0.45, speed: 95 },
  { r: 262, dash: "120 40", width: 0.8, opacity: 0.35, speed: -130 },
] as const;

/** The disc at the centre, in the same 600-unit box as the rings. */
export const CORE_DISC_RADIUS = 78;
export const CORE_BOX = 600;

/** Beads riding the rings: [ring index, angle in degrees]. */
const BEADS: readonly [number, number][] = [
  [0, 20],
  [1, 140],
  [1, 300],
  [2, 75],
  [2, 250],
  [3, 10],
  [3, 190],
];

/** How far the core wanders across the viewport, as a fraction of its width. */
const SWAY = 0.28;

const mix = (from: number, to: number, amount: number) => from + (to - from) * amount;

/**
 * The core, behind every page.
 *
 * The mark sits still at the centre of a glowing disc while rings of light
 * turn around it, each at its own pace and the alternate ones the other way.
 * As the reader scrolls the whole system drifts from one side of the viewport
 * to the other and back, and turns a little further. A scene can call it:
 * while {@link coreTarget} has a blend above zero the core leaves its drift
 * and sits where that scene asks, at the size it asks.
 */
export function Core() {
  const rootRef = useGsapScope<HTMLDivElement>(({ gsap, q, capability }) => {
    const rings = q("[data-ring]");
    const system = q("[data-system]")[0] as HTMLElement | undefined;
    const wheel = q("[data-wheel]")[0] as HTMLElement | undefined;
    if (!system || !wheel) return;

    if (!capability.isLowPower) {
      rings.forEach((ring, index) => {
        const speed = CORE_RINGS[index]?.speed ?? 60;
        gsap.to(ring, {
          rotation: speed > 0 ? "+=360" : "-=360",
          duration: Math.abs(speed),
          ease: "none",
          repeat: -1,
          transformOrigin: "50% 50%",
        });
      });
    }

    const setX = gsap.quickSetter(system, "x", "px");
    const setY = gsap.quickSetter(system, "y", "px");
    const setScale = gsap.quickSetter(system, "scale");
    const setRotate = gsap.quickSetter(wheel, "rotation", "deg");
    let current = 0;
    let blend = 0;

    const tick = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const progress = max > 0 ? window.scrollY / max : 0;
      current += (progress - current) * 0.08;
      blend += (coreTarget.blend - blend) * 0.12;

      // Its own drift…
      const driftX = Math.sin(current * Math.PI * 2.5) * window.innerWidth * SWAY;
      const driftY = Math.cos(current * Math.PI * 1.5) * 40;
      // …and the place a scene asked for, as an offset from the viewport centre.
      const targetX = coreTarget.x - window.innerWidth / 2;
      const targetY = coreTarget.y - window.innerHeight / 2;

      setX(mix(driftX, targetX, blend));
      setY(mix(driftY, targetY, blend));
      setScale(mix(1, coreTarget.scale, blend));
      setRotate(current * 540);
    };
    gsap.ticker.add(tick);
    return () => gsap.ticker.remove(tick);
  });

  return (
    <div ref={rootRef} className={styles.core} aria-hidden="true">
      <div data-system className={styles.coreSystem}>
        <div className={styles.coreGlow} />
        <svg
          data-wheel
          className={styles.coreRings}
          viewBox={`0 0 ${CORE_BOX} ${CORE_BOX}`}
          focusable="false"
        >
          {CORE_RINGS.map((ring, index) => (
            <g key={index} data-ring>
              <circle
                cx={CORE_BOX / 2}
                cy={CORE_BOX / 2}
                r={ring.r}
                fill="none"
                stroke="currentColor"
                strokeWidth={ring.width}
                strokeDasharray={ring.dash}
                strokeLinecap="round"
                opacity={ring.opacity}
              />
              {BEADS.filter(([ringIndex]) => ringIndex === index).map(([, angle]) => {
                const radians = (angle * Math.PI) / 180;
                return (
                  <circle
                    key={angle}
                    className={styles.coreBead}
                    cx={CORE_BOX / 2 + Math.cos(radians) * ring.r}
                    cy={CORE_BOX / 2 + Math.sin(radians) * ring.r}
                    r={index === 0 ? 4 : 3}
                  />
                );
              })}
            </g>
          ))}
          <circle cx={CORE_BOX / 2} cy={CORE_BOX / 2} r={CORE_DISC_RADIUS} className={styles.coreDisc} />
        </svg>
        <div className={styles.coreMark}>
          <Logo className="h-[clamp(1.5rem,3.2vw,2.75rem)]" />
        </div>
      </div>
    </div>
  );
}
