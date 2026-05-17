"use client";

import { useState } from "react";
import { Type, Hash, ToggleLeft, Eye, EyeOff, Image as ImageIcon } from "lucide-react";
import clsx from "clsx";
import { StyleControls } from "./style-controls";
import type { StyleOverride } from "@/lib/content/style-types";

type BaseProps = {
  label: string;
  description?: string;
  path: string;
  styles?: StyleOverride;
  onStyleChange?: (next: StyleOverride) => void;
  disableStyle?: boolean;
  hint?: string;
};

/* ───────── String Field ───────── */
export function TextField({
  label,
  description,
  path,
  value,
  onChange,
  styles,
  onStyleChange,
  multiline = false,
  hint,
  disableStyle = false,
}: BaseProps & {
  value: string;
  onChange: (v: string) => void;
  multiline?: boolean;
}) {
  return (
    <FieldShell
      label={label}
      description={description}
      icon={Type}
      path={path}
    >
      {multiline ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={4}
          className="admin-input"
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="admin-input"
        />
      )}
      {hint && <p className="text-[11px] text-admin-subtle mt-1">{hint}</p>}
      {!disableStyle && styles !== undefined && onStyleChange && (
        <div className="mt-2">
          <StyleControls value={styles} onChange={onStyleChange} />
        </div>
      )}
    </FieldShell>
  );
}

/* ───────── Number Field ───────── */
export function NumberField({
  label,
  description,
  path,
  value,
  onChange,
  styles,
  onStyleChange,
}: BaseProps & {
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <FieldShell label={label} description={description} icon={Hash} path={path}>
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="admin-input"
      />
      {styles !== undefined && onStyleChange && (
        <div className="mt-2">
          <StyleControls value={styles} onChange={onStyleChange} />
        </div>
      )}
    </FieldShell>
  );
}

/* ───────── Boolean Field ───────── */
export function BoolField({
  label,
  description,
  path,
  value,
  onChange,
}: BaseProps & {
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <FieldShell label={label} description={description} icon={ToggleLeft} path={path}>
      <button
        type="button"
        onClick={() => onChange(!value)}
        className={clsx(
          "relative inline-flex h-6 w-11 items-center rounded-full transition-colors",
          value ? "bg-admin-accent" : "bg-admin-surface-2",
        )}
      >
        <span
          className={clsx(
            "inline-block h-4 w-4 rounded-full bg-white transition-transform",
            value ? "translate-x-6" : "translate-x-1",
          )}
        />
      </button>
    </FieldShell>
  );
}

/* ───────── Media Field ───────── */
export function MediaField({
  label,
  description,
  path,
  value,
  onChange,
  onPick,
}: BaseProps & {
  value: string;
  onChange: (v: string) => void;
  onPick?: () => void;
}) {
  return (
    <FieldShell label={label} description={description} icon={ImageIcon} path={path}>
      <div className="flex gap-2">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="/uploads/..."
          className="admin-input flex-1"
        />
        {onPick && (
          <button type="button" onClick={onPick} className="admin-btn-secondary">
            <ImageIcon className="w-4 h-4" />
            <span className="hidden sm:inline">اختيار</span>
          </button>
        )}
      </div>
      {value && /^\/?(uploads|public)/i.test(value) && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={value.startsWith("/") ? value : `/${value}`}
          alt=""
          className="mt-2 max-h-32 rounded-lg border border-admin-border object-cover"
        />
      )}
    </FieldShell>
  );
}

/* ───────── List Field (string array) ───────── */
export function StringListField({
  label,
  description,
  path,
  value,
  onChange,
  styles,
  onStyleChange,
}: BaseProps & {
  value: string[];
  onChange: (v: string[]) => void;
}) {
  return (
    <FieldShell label={label} description={description} icon={Type} path={path}>
      <div className="space-y-2">
        {value.map((v, i) => (
          <div key={i} className="flex gap-2">
            <input
              type="text"
              value={v}
              onChange={(e) => {
                const next = [...value];
                next[i] = e.target.value;
                onChange(next);
              }}
              className="admin-input flex-1"
            />
            <button
              type="button"
              onClick={() => onChange(value.filter((_, idx) => idx !== i))}
              className="admin-btn-danger px-3"
              title="حذف"
            >
              ×
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => onChange([...value, ""])}
          className="admin-btn-ghost text-xs"
        >
          + إضافة عنصر
        </button>
      </div>
      {styles !== undefined && onStyleChange && (
        <div className="mt-2">
          <StyleControls value={styles} onChange={onStyleChange} />
        </div>
      )}
    </FieldShell>
  );
}

/* ───────── Field Shell ───────── */
function FieldShell({
  label,
  description,
  icon: Icon,
  path,
  children,
}: {
  label: string;
  description?: string;
  icon: React.ElementType;
  path: string;
  children: React.ReactNode;
}) {
  const [showPath, setShowPath] = useState(false);
  return (
    <div className="space-y-1.5">
      <div className="flex items-start justify-between gap-2">
        <label className="text-sm font-medium text-admin-text flex items-center gap-2">
          <Icon className="w-3.5 h-3.5 text-admin-muted" />
          <span>{label}</span>
        </label>
        <button
          type="button"
          onClick={() => setShowPath((v) => !v)}
          className="text-[10px] text-admin-subtle hover:text-admin-muted"
          title={showPath ? "إخفاء المسار" : "إظهار المسار التقني"}
        >
          {showPath ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
        </button>
      </div>
      {description && (
        <p className="text-xs text-admin-muted -mt-0.5">{description}</p>
      )}
      {showPath && (
        <p className="text-[10px] font-mono text-admin-subtle bg-admin-bg/40 px-2 py-1 rounded">
          {path}
        </p>
      )}
      {children}
    </div>
  );
}
