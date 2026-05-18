"use client";

import { useState } from "react";
import { Heading1, Eye, EyeOff, Wand2 } from "lucide-react";
import clsx from "clsx";
import { StyleControls } from "./style-controls";
import type { StyleOverride } from "@/lib/content/style-types";
import { cn } from "@/lib/utils";

/**
 * Title Composer
 * --------------
 * The Hero title is intentionally split into 3 parts so the middle phrase
 * (`titleHighlight`) can be styled with the gold gradient + underline animation.
 * Editing those 3 strings in 3 separate fields feels disconnected.
 *
 * This component shows:
 *   ┌─ Live preview (matches the public hero look) ─┐
 *   │  نبتكر  [أنظمة برمجية]  تُغيّر طريقة عمل أعمالك │
 *   └────────────────────────────────────────────────┘
 *   3 small inputs (start / highlight / end) underneath, OR
 *   a "smart" single textarea where the highlight is wrapped in [[ ]].
 */
type Props = {
  label: string;
  description?: string;
  basePath: string;          // "hero"
  start: string;
  highlight: string;
  end: string;
  onChange: (next: { start: string; highlight: string; end: string }) => void;
  startStyles?: StyleOverride;
  highlightStyles?: StyleOverride;
  endStyles?: StyleOverride;
  onStartStyleChange?: (s: StyleOverride) => void;
  onHighlightStyleChange?: (s: StyleOverride) => void;
  onEndStyleChange?: (s: StyleOverride) => void;
};

export function TitleComposer({
  label,
  description,
  basePath,
  start,
  highlight,
  end,
  onChange,
  startStyles,
  highlightStyles,
  endStyles,
  onStartStyleChange,
  onHighlightStyleChange,
  onEndStyleChange,
}: Props) {
  const [mode, setMode] = useState<"smart" | "split">("smart");
  const [showPath, setShowPath] = useState(false);

  // Smart mode: the user types in one big box and wraps the highlighted
  // phrase with [[ ... ]]. We parse it on every keystroke.
  const smartValue = `${start}${start && (highlight || end) ? " " : ""}[[${highlight}]]${(highlight || start) && end ? " " : ""}${end}`.trim();

  function handleSmartChange(raw: string) {
    const m = raw.match(/^([\s\S]*?)\[\[([\s\S]*?)\]\]([\s\S]*)$/);
    if (m) {
      onChange({
        start: m[1].trim(),
        highlight: m[2].trim(),
        end: m[3].trim(),
      });
    } else {
      // No highlight markers — put everything in `start`
      onChange({ start: raw.trim(), highlight: "", end: "" });
    }
  }

  return (
    <div className="space-y-3 rounded-xl border border-admin-border bg-admin-bg/40 p-4">
      <div className="flex items-start justify-between gap-2">
        <div className="space-y-1">
          <label className="text-sm font-bold text-admin-text flex items-center gap-2">
            <Heading1 className="w-4 h-4 text-admin-accent" />
            <span>{label}</span>
            <span className="text-[10px] uppercase tracking-wider text-admin-accent/80 bg-admin-accent-soft px-1.5 py-0.5 rounded">
              Title Composer
            </span>
          </label>
          {description && (
            <p className="text-xs text-admin-muted">{description}</p>
          )}
        </div>
        <button
          type="button"
          onClick={() => setShowPath((v) => !v)}
          className="text-[10px] text-admin-subtle hover:text-admin-muted shrink-0"
          title={showPath ? "إخفاء المسارات" : "إظهار المسارات التقنية"}
        >
          {showPath ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
        </button>
      </div>

      {/* Live preview */}
      <div className="rounded-lg border border-admin-border bg-admin-surface px-4 py-5 text-center">
        <p className="text-[10px] uppercase tracking-[0.25em] text-admin-subtle mb-2">
          معاينة مباشرة
        </p>
        <div
          className="text-2xl sm:text-3xl font-extrabold leading-tight"
          dir="auto"
        >
          <span className="text-admin-text">{start}</span>{" "}
          <span
            className="bg-gradient-to-r from-admin-accent via-yellow-400 to-admin-accent bg-clip-text text-transparent italic"
          >
            {highlight}
          </span>{" "}
          <span className="text-admin-text">{end}</span>
        </div>
      </div>

      {/* Mode toggle */}
      <div className="flex items-center justify-between gap-2">
        <div className="inline-flex rounded-lg border border-admin-border p-0.5 bg-admin-surface">
          <button
            type="button"
            onClick={() => setMode("smart")}
            className={clsx(
              "px-3 py-1.5 text-xs font-medium rounded-md transition-colors flex items-center gap-1.5",
              mode === "smart"
                ? "bg-admin-accent-soft text-admin-accent"
                : "text-admin-muted hover:text-admin-text",
            )}
          >
            <Wand2 className="w-3.5 h-3.5" />
            تحرير ذكي
          </button>
          <button
            type="button"
            onClick={() => setMode("split")}
            className={clsx(
              "px-3 py-1.5 text-xs font-medium rounded-md transition-colors",
              mode === "split"
                ? "bg-admin-accent-soft text-admin-accent"
                : "text-admin-muted hover:text-admin-text",
            )}
          >
            تحرير مفصّل
          </button>
        </div>

        <p className="text-[11px] text-admin-subtle">
          {mode === "smart"
            ? "اكتب العنوان كاملاً وضع الكلمة المميزة بين [[ و ]]"
            : "حرّر الأجزاء الثلاثة منفصلة"}
        </p>
      </div>

      {/* Editor */}
      {mode === "smart" ? (
        <div>
          <textarea
            value={smartValue}
            onChange={(e) => handleSmartChange(e.target.value)}
            rows={3}
            placeholder="نبتكر [[أنظمة برمجية]] تُغيّر طريقة عمل أعمالك"
            className="admin-input font-medium text-base"
            dir="auto"
          />
          <p className="text-[11px] text-admin-subtle mt-1.5 leading-relaxed">
            💡 الجزء بين <code className="bg-admin-bg/60 px-1 py-0.5 rounded text-admin-accent">[[ ]]</code> هيظهر باللون الذهبي مع الإيطاليك.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <SubField
            label="بداية العنوان"
            path={`${basePath}.titleStart`}
            value={start}
            onChange={(v) => onChange({ start: v, highlight, end })}
            showPath={showPath}
          />
          <SubField
            label="الكلمة المميزة (ذهبية)"
            path={`${basePath}.titleHighlight`}
            value={highlight}
            onChange={(v) => onChange({ start, highlight: v, end })}
            showPath={showPath}
            highlight
          />
          <SubField
            label="نهاية العنوان"
            path={`${basePath}.titleEnd`}
            value={end}
            onChange={(v) => onChange({ start, highlight, end: v })}
            showPath={showPath}
          />
        </div>
      )}

      {/* Style controls per-part — collapsible */}
      <details className="group">
        <summary className="cursor-pointer list-none flex items-center gap-2 text-xs text-admin-muted hover:text-admin-text">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-admin-accent" />
          تنسيق الأجزاء (لون، خط، حجم...)
          <span className="text-admin-subtle group-open:hidden">▼</span>
          <span className="text-admin-subtle hidden group-open:inline">▲</span>
        </summary>
        <div className="mt-3 space-y-3">
          {onStartStyleChange && startStyles !== undefined && (
            <StyleSection title="بداية العنوان">
              <StyleControls value={startStyles} onChange={onStartStyleChange} />
            </StyleSection>
          )}
          {onHighlightStyleChange && highlightStyles !== undefined && (
            <StyleSection title="الكلمة المميزة">
              <StyleControls
                value={highlightStyles}
                onChange={onHighlightStyleChange}
              />
            </StyleSection>
          )}
          {onEndStyleChange && endStyles !== undefined && (
            <StyleSection title="نهاية العنوان">
              <StyleControls value={endStyles} onChange={onEndStyleChange} />
            </StyleSection>
          )}
        </div>
      </details>
    </div>
  );
}

function SubField({
  label,
  path,
  value,
  onChange,
  showPath,
  highlight,
}: {
  label: string;
  path: string;
  value: string;
  onChange: (v: string) => void;
  showPath: boolean;
  highlight?: boolean;
}) {
  return (
    <div className="space-y-1">
      <label
        className={cn(
          "text-xs font-medium",
          highlight ? "text-admin-accent" : "text-admin-muted",
        )}
      >
        {label}
      </label>
      {showPath && (
        <p className="text-[10px] font-mono text-admin-subtle bg-admin-bg/40 px-2 py-0.5 rounded">
          {path}
        </p>
      )}
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        dir="auto"
        className={cn(
          "admin-input",
          highlight && "border-admin-accent/40 focus:border-admin-accent",
        )}
      />
    </div>
  );
}

function StyleSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-lg border border-admin-border bg-admin-surface p-3 space-y-2">
      <p className="text-[11px] font-medium text-admin-muted">{title}</p>
      {children}
    </div>
  );
}
