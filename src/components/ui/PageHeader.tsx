import type { ReactNode } from "react";

import { glowAccent } from "@/experience/build/accent";
import styles from "@/experience/build/build.module.css";
import { cn } from "@/lib/utils";

import { Container } from "./Container";
import { Section } from "./Section";

interface PageHeaderProps {
  eyebrow?: string;
  headline: string;
  description?: string | null;
  children?: ReactNode;
}

/**
 * The opening block of every page except the homepage.
 *
 * Set in the build sequence's voice so an inner page reads as another step of
 * the same program: the label as a command, the claim at the same scale and
 * glow as the homepage scenes, the description as the lead beneath it.
 */
export function PageHeader({ eyebrow, headline, description, children }: PageHeaderProps) {
  return (
    <Section spacing="hero">
      <Container>
        {eyebrow ? <div className={styles.cmd}>{eyebrow}</div> : null}
        <h1 className={cn(styles.h1, "max-w-[16ch]")}>{glowAccent(headline)}</h1>
        {description ? <p className={styles.lead}>{description}</p> : null}
        {children}
      </Container>
    </Section>
  );
}
