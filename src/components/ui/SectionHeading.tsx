import type { ReactNode } from "react";

import { glowAccent } from "@/experience/build/accent";
import styles from "@/experience/build/build.module.css";
import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  eyebrow: string;
  /** `*marked*` words are set in the accent. */
  headline: string;
  lead?: string;
  /** Rendered under the lead — usually a call to action. */
  children?: ReactNode;
  className?: string;
}

/**
 * The opening of a section on an inner page: the label as a command, the
 * claim at the build sequence's scale, the paragraph as its lead.
 */
export function SectionHeading({
  eyebrow,
  headline,
  lead,
  children,
  className,
}: SectionHeadingProps) {
  return (
    <div className={cn("max-w-[60rem]", className)}>
      <div data-reveal className={styles.cmd}>
        {eyebrow}
      </div>
      <h2 data-reveal className={styles.h2}>
        {glowAccent(headline)}
      </h2>
      {lead ? (
        <p data-reveal className={styles.lead}>
          {lead}
        </p>
      ) : null}
      {children}
    </div>
  );
}
