import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

import styles from "./build.module.css";
import type { CodeLine, TokenKind } from "./code";

const tokenClass: Record<TokenKind, string> = {
  k: styles.tk!,
  f: styles.tf!,
  s: styles.ts!,
  n: styles.tn!,
  c: styles.tc!,
  p: styles.tp!,
  v: styles.tv!,
};

/** One tokenised line as coloured spans. */
export function CodeTokens({ line }: { line: CodeLine }) {
  if (line.length === 0) return <>{" "}</>;
  return (
    <>
      {line.map((token, index) => (
        <span key={index} className={tokenClass[token.kind]}>
          {token.text}
        </span>
      ))}
    </>
  );
}

interface EditorWindowProps {
  file: string;
  lang: string;
  children: ReactNode;
  className?: string;
  /** Marks the window for the scene that animates it. */
  dataAttr?: Record<string, string>;
}

/**
 * The editor chrome: three dots, a filename and a language badge. The body is
 * whatever the scene puts in it, so the hero can type into it and the build
 * scene can step through it.
 */
export function EditorWindow({ file, lang, children, className, dataAttr }: EditorWindowProps) {
  return (
    <div className={cn(styles.win, className)} {...dataAttr}>
      <div className={styles.winBar}>
        <i className={styles.winDot} />
        <i className={styles.winDot} />
        <i className={styles.winDot} />
        <span className={styles.winFile}>{file}</span>
        <em className={styles.winLang} data-editor-lang>
          {lang}
        </em>
      </div>
      {children}
    </div>
  );
}
