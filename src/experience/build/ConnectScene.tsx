"use client";

import { Arrow } from "@/components/ui/Arrow";
import { Button } from "@/components/ui/Button";
import { pointer } from "@/experience/caret/pointer";
import { modulePaths } from "@/experience/hero/ModuleGlyph";
import type { ModuleId } from "@/experience/hero/scene";
import { useGsapScope } from "@/motion/hooks/useGsapScope";

import { glowAccent, sceneTrigger } from "./accent";
import styles from "./build.module.css";
import { CORE_BOX, CORE_DISC_RADIUS } from "./Core";
import { coreTarget } from "./coreTarget";

export interface ConnectSceneProps {
  command: string;
  eyebrow: string;
  headline: string;
  lead: string;
  services: { id: string; name: string }[];
  cta: { label: string; href: string };
}

/** Where the core sits in the graph's 700×520 box, and how big its disc is there. */
const HUB = { x: 350, y: 260, r: 54 };
const SLOTS = [
  { x: 150, y: 110 },
  { x: 550, y: 110 },
  { x: 90, y: 300 },
  { x: 610, y: 300 },
  { x: 200, y: 450 },
  { x: 500, y: 450 },
];

/* The timeline, in scrubbed seconds. */
const ARRIVE = 1.0;
const STEP = 0.4;
const HOLD = 0.9;
const LEAVE = 0.7;
const GROWN = ARRIVE + 0.7 + STEP * (SLOTS.length - 1) + 0.3;
const END = GROWN + HOLD + LEAVE;

function edgePath(to: { x: number; y: number }): string {
  const cx = (HUB.x + to.x) / 2 + (to.y - HUB.y) * 0.25;
  const cy = (HUB.y + to.y) / 2 - (to.x - HUB.x) * 0.25;
  return `M${HUB.x} ${HUB.y} Q ${cx} ${cy} ${to.x} ${to.y}`;
}

/**
 * Scene 04 — connect.
 *
 * The six capabilities as a graph around the core — the same core that drifts
 * behind every page. As the scene arrives it calls the core to the hub of the
 * graph and sizes it to fit; then, as the reader scrolls, each edge draws out
 * of it, its node lights and packets start to run. At the end the edges draw
 * back in, the nodes fade, and the core is released to carry on its way.
 */
export function ConnectScene({
  command,
  eyebrow,
  headline,
  lead,
  services,
  cta,
}: ConnectSceneProps) {
  const rootRef = useGsapScope<HTMLElement>(({ gsap, q, container, capability }) => {
    const edges = q("[data-edge]") as SVGPathElement[];
    const flows = q("[data-flow]");
    const nodes = q("[data-node]");
    const graph = q("[data-graph]")[0] as HTMLElement | undefined;
    const hub = q("[data-hub]")[0] as SVGCircleElement | undefined;

    const lengths = edges.map((edge) => edge.getTotalLength());
    edges.forEach((edge, index) => {
      gsap.set(edge, { strokeDasharray: lengths[index], strokeDashoffset: lengths[index] });
    });

    const timeline = gsap.timeline({
      scrollTrigger: sceneTrigger(container, "+=260%"),
      defaults: { ease: "none" },
    });
    // The core travels in.
    timeline.to({}, { duration: ARRIVE });
    // The services grow out of it.
    edges.forEach((edge, index) => {
      const at = ARRIVE + index * STEP;
      timeline
        .to(edge, { strokeDashoffset: 0, duration: 0.7, ease: "power1.inOut" }, at)
        .to(nodes[index] ?? [], { opacity: 1, duration: 0.3 }, at + 0.5)
        .to(flows[index] ?? [], { opacity: 1, duration: 0.3 }, at + 0.7);
    });
    // They hold, then fold back, and the core is let go.
    timeline
      .to(flows, { opacity: 0, duration: 0.3 }, GROWN + HOLD)
      .to(nodes, { opacity: 0, duration: 0.4, stagger: 0.04 }, GROWN + HOLD)
      .to(
        edges,
        {
          strokeDashoffset: (index: number) => lengths[index] ?? 0,
          duration: LEAVE,
          ease: "power1.inOut",
        },
        GROWN + HOLD,
      )
      .to({}, { duration: 0.3 });

    gsap.from(q("[data-rise]"), {
      y: 30,
      autoAlpha: 0,
      duration: 1.1,
      stagger: 0.1,
      scrollTrigger: { trigger: container, start: "top 75%", once: true },
    });

    // Every frame while the scene is anywhere near: where the hub is on screen,
    // how big it is, and how strongly the core should be held there.
    const tick = () => {
      if (!hub) return;
      const time = timeline.time();
      const trigger = timeline.scrollTrigger;
      const near = trigger ? trigger.progress > 0 && trigger.progress < 1 : false;
      const arriving = Math.min(1, time / ARRIVE);
      const leaving = Math.min(1, Math.max(0, (END - time) / LEAVE));
      coreTarget.blend = near ? arriving * leaving : 0;

      if (coreTarget.blend > 0) {
        const rect = hub.getBoundingClientRect();
        coreTarget.x = rect.left + rect.width / 2;
        coreTarget.y = rect.top + rect.height / 2;
        // Size the core's disc to the hub: both are circles, so one ratio does it.
        const system = document.querySelector<HTMLElement>("[data-system]");
        const systemWidth = system?.offsetWidth ?? CORE_BOX;
        const discOnScreen = (CORE_DISC_RADIUS / CORE_BOX) * systemWidth;
        coreTarget.scale = rect.width / 2 / discOnScreen;
      }

      if (graph && !capability.isCoarsePointer) {
        const px = pointer.active ? pointer.cx / window.innerWidth - 0.5 : 0;
        const py = pointer.active ? pointer.cy / window.innerHeight - 0.5 : 0;
        graph.style.transform = `perspective(1200px) rotateY(${(px * -8).toFixed(2)}deg) rotateX(${(py * 6).toFixed(2)}deg)`;
      }
    };
    gsap.ticker.add(tick);

    return () => {
      gsap.ticker.remove(tick);
      coreTarget.blend = 0;
    };
  });

  return (
    <section ref={rootRef} id="capabilities" aria-label={eyebrow} className={styles.scene}>
      <div className={styles.wrap}>
        <div>
          <div data-rise className={styles.cmd}>
            {command}
          </div>
          <h2 data-rise className={styles.h2}>
            {glowAccent(headline)}
          </h2>
          <p data-rise className={styles.lead}>
            {lead}
          </p>
          <div data-rise className={styles.ctas}>
            <Button href={cta.href} variant="outline" size="sm">
              {cta.label}
              <Arrow />
            </Button>
          </div>
        </div>

        <svg
          data-graph
          className={styles.graph}
          viewBox="0 0 700 520"
          aria-hidden="true"
          focusable="false"
        >
          {/* The hub is the core itself, behind the page; this only marks where. */}
          <circle data-hub cx={HUB.x} cy={HUB.y} r={HUB.r} fill="none" stroke="none" />
          <g>
            {SLOTS.map((slot, index) => (
              <g key={index}>
                <path data-edge className={styles.edge} d={edgePath(slot)} />
                <path data-flow className={styles.flow} d={edgePath(slot)} />
              </g>
            ))}
          </g>
          <g>
            {services.slice(0, SLOTS.length).map((service, index) => {
              const slot = SLOTS[index]!;
              return (
                <g key={service.id} data-node className={styles.node}>
                  <circle cx={slot.x} cy={slot.y} r="34" />
                  {service.id in modulePaths ? (
                    <svg
                      className={styles.nodeIcon}
                      viewBox="0 0 24 24"
                      x={slot.x - 16}
                      y={slot.y - 16}
                      width="32"
                      height="32"
                    >
                      <path d={modulePaths[service.id as ModuleId]} />
                    </svg>
                  ) : null}
                  <text className={styles.nodeText} x={slot.x} y={slot.y + 56}>
                    {service.name}
                  </text>
                </g>
              );
            })}
          </g>
        </svg>
      </div>
    </section>
  );
}
