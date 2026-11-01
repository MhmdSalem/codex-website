import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

import styles from "./build.module.css";

interface WindowProps {
  /** Shown in the title bar, monospace. */
  title: string;
  /** Short status at the trailing end of the bar, in the positive colour. */
  status?: string;
  children: ReactNode;
  className?: string;
}

/**
 * A window with the editor chrome and whatever the page puts inside — a
 * terminal, a form, a product interface. Server-renderable; the pages give the
 * contents `data-reveal` where they should rise into view.
 */
export function Window({ title, status, children, className }: WindowProps) {
  return (
    <div className={cn(styles.win, className)}>
      <div className={styles.winBar}>
        <i className={styles.winDot} />
        <i className={styles.winDot} />
        <i className={styles.winDot} />
        <span className={styles.winFile}>{title}</span>
        {status ? <em className={styles.winLang}>{status}</em> : null}
      </div>
      {children}
    </div>
  );
}

export type TerminalLine =
  | { kind: "cmd"; text: string }
  | { kind: "ok"; text: string }
  | { kind: "info"; text: string }
  | { kind: "dim"; text: string };

/**
 * Terminal output, one line at a time: a command, then what it printed.
 * Each line reveals on its own so a list reads as output arriving.
 */
export function Terminal({ title, lines, status }: { title: string; lines: TerminalLine[]; status?: string }) {
  return (
    <Window title={title} status={status}>
      <div className={styles.winBody}>
        {lines.map((line, index) => (
          <div key={index} data-reveal className={styles.termRow}>
            {line.kind === "cmd" ? (
              <>
                <span className={styles.termDim}>$</span>
                <code>{line.text}</code>
              </>
            ) : line.kind === "ok" ? (
              <>
                <span className={styles.termOk}>✓</span>
                <span>{line.text}</span>
              </>
            ) : line.kind === "info" ? (
              <>
                <span className={styles.termWarn}>→</span>
                <span>{line.text}</span>
              </>
            ) : (
              <>
                <span className={styles.termDim}>#</span>
                <span className={styles.termDim}>{line.text}</span>
              </>
            )}
          </div>
        ))}
      </div>
    </Window>
  );
}
