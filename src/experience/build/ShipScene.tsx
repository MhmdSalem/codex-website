"use client";

import { cn } from "@/lib/utils";
import { useGsapScope } from "@/motion/hooks/useGsapScope";

import { glowAccent, sceneTrigger } from "./accent";
import styles from "./build.module.css";

export interface ShipSceneProps {
  command: string;
  eyebrow: string;
  headline: string;
  lead: string;
  steps: { id: string; label: string; title: string; body: string; logs: string[] }[];
}

/**
 * Scene 05 — ship.
 *
 * The four stages as a pipeline. Pinned; each job goes from queued to running
 * to passed as the reader scrolls, with its log lines appearing one by one and
 * a progress rule filling along its foot. No stage starts before the previous
 * one has passed, which is the whole promise of the process.
 */
export function ShipScene({ command, eyebrow, headline, lead, steps }: ShipSceneProps) {
  const rootRef = useGsapScope<HTMLElement>(({ gsap, q, container }) => {
    const jobs = q("[data-job]") as HTMLElement[];

    const timeline = gsap.timeline({
      scrollTrigger: sceneTrigger(container, "+=240%"),
    });
    jobs.forEach((job, index) => {
      const at = index * 1.2;
      timeline
        .add(() => {
          job.dataset.state = "running";
        }, at)
        .to(job, { "--p": 1, duration: 1, ease: "none" }, at)
        .to(job.querySelectorAll("[data-log]"), { opacity: 1, duration: 0.25, stagger: 0.3 }, at + 0.1)
        .add(() => {
          job.dataset.state = "done";
        }, at + 1.05);
    });
    timeline.to({}, { duration: 0.6 });

    gsap.from(q("[data-rise]"), {
      y: 30,
      autoAlpha: 0,
      duration: 1.1,
      stagger: 0.1,
      scrollTrigger: { trigger: container, start: "top 75%", once: true },
    });
    gsap.from(jobs, {
      y: 40,
      autoAlpha: 0,
      duration: 1,
      stagger: 0.1,
      scrollTrigger: { trigger: container, start: "top 70%", once: true },
    });
  });

  return (
    <section ref={rootRef} id="process" aria-label={eyebrow} className={styles.scene}>
      <div className={cn(styles.wrap, styles.wrapSingle)}>
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
        </div>
        <ol className={styles.pipe}>
          {steps.map((step, index) => (
            <li key={step.id} data-job data-state="queued" className={styles.job}>
              <div className={styles.jobSt}>
                <i />
                <span>
                  {String(index + 1).padStart(2, "0")} · {step.label}
                </span>
              </div>
              <h3 className={styles.jobTitle}>{step.title}</h3>
              <p className={styles.jobBody}>{step.body}</p>
              <div className={styles.jobLog}>
                {step.logs.map((log, logIndex) => (
                  <div
                    key={logIndex}
                    data-log
                    className={cn(logIndex === step.logs.length - 1 && styles.jobOk)}
                  >
                    {logIndex === step.logs.length - 1 ? log : `› ${log}`}
                  </div>
                ))}
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
