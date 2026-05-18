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
    <div
      className={clsx(
        "admin-card overflow-hidden transition-all",
        open && "shadow-lg shadow-black/20",
      )}
    >
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={clsx(
          "w-full flex items-center justify-between gap-4 p-5 text-right transition-colors",
          open
            ? "bg-admin-surface-2/30"
            : "hover:bg-admin-surface-2/40",
        )}
      >
        <div className="flex items-start gap-3 min-w-0 flex-1">
          {Icon && (
            <div
              className={clsx(
                "w-11 h-11 rounded-xl grid place-items-center shrink-0 transition-all",
                open
                  ? "bg-admin-accent text-white shadow-md shadow-admin-accent/30"
                  : "bg-admin-accent-soft text-admin-accent",
              )}
            >
              <Icon className="w-5 h-5" />
            </div>
          )}
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-bold text-admin-text text-base">{title}</h3>
              {badge && (
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-admin-bg/60 text-admin-accent border border-admin-accent/20">
                  {badge}
                </span>
              )}
            </div>
            {subtitle && (
              <p className="text-xs text-admin-muted mt-1 line-clamp-1">
                {subtitle}
              </p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {rightSlot}
          <span
            className={clsx(
              "w-7 h-7 grid place-items-center rounded-lg transition-all",
              open
                ? "bg-admin-accent-soft text-admin-accent"
                : "text-admin-muted",
            )}
          >
            <ChevronDown
              className={clsx(
                "w-4 h-4 transition-transform",
                open && "rotate-180",
              )}
            />
          </span>
        </div>
      </button>
      {open && (
        <div className="border-t border-admin-border/60 p-5 space-y-5 bg-admin-bg/20">
          {children}
        </div>
      )}
    </div>
  );
}
