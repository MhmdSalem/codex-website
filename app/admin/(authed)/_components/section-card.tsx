"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import clsx from "clsx";

type Props = {
  title: string;
  subtitle?: string;
  icon?: React.ElementType;
  defaultOpen?: boolean;
  badge?: string;
  children: React.ReactNode;
  rightSlot?: React.ReactNode;
};

export function SectionCard({
  title,
  subtitle,
  icon: Icon,
  defaultOpen = true,
  badge,
  children,
  rightSlot,
}: Props) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="admin-card overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between gap-4 p-5 text-right hover:bg-admin-surface-2/40 transition-colors"
      >
        <div className="flex items-start gap-3 min-w-0 flex-1">
          {Icon && (
            <div className="w-10 h-10 rounded-lg bg-admin-accent-soft text-admin-accent grid place-items-center shrink-0">
              <Icon className="w-5 h-5" />
            </div>
          )}
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-bold text-admin-text">{title}</h3>
              {badge && (
                <span className="text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-admin-surface-2 text-admin-muted">
                  {badge}
                </span>
              )}
            </div>
            {subtitle && (
              <p className="text-xs text-admin-muted mt-0.5 line-clamp-1">{subtitle}</p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {rightSlot}
          <ChevronDown
            className={clsx(
              "w-5 h-5 text-admin-muted transition-transform",
              open && "rotate-180",
            )}
          />
        </div>
      </button>
      {open && (
        <div className="border-t border-admin-border p-5 space-y-5">{children}</div>
      )}
    </div>
  );
}
