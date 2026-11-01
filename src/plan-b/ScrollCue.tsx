import { cn } from "@/lib/utils";

import styles from "./scene.module.css";

/** The one instruction the opening frame needs. */
export function ScrollCue({ label }: { label: string }) {
  return (
    <div aria-hidden="true" className="flex flex-col items-center gap-3">
      <span className="font-mono text-micro tracking-widest text-white/45 uppercase">{label}</span>
      <span className="flex h-6 w-4 items-start justify-center rounded-full border border-white/25 pt-1">
        <span className={cn(styles.cueDot, "size-1 rounded-full bg-accent")} />
      </span>
    </div>
  );
}
