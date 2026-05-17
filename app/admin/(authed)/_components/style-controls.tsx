"use client";

import { useState } from "react";
import {
  Palette,
  Type,
  ALargeSmall,
  Bold,
  AlignCenter,
  RotateCcw,
  ChevronDown,
} from "lucide-react";
import clsx from "clsx";
import {
  COLOR_PRESETS,
  FONT_FAMILY_OPTIONS,
  FONT_SIZE_PRESETS,
  FONT_WEIGHT_OPTIONS,
  isStyleEmpty,
  type StyleOverride,
} from "@/lib/content/style-types";

type Props = {
  value: StyleOverride;
  onChange: (next: StyleOverride) => void;
  showAdvanced?: boolean;
};

export function StyleControls({ value, onChange, showAdvanced = true }: Props) {
  const [open, setOpen] = useState(false);
  const empty = isStyleEmpty(value);

  function patch(p: Partial<StyleOverride>) {
    onChange({ ...value, ...p });
  }

  function reset() {
    onChange({});
  }

  return (
    <div className="rounded-xl border border-admin-border bg-admin-bg/40">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between gap-2 px-3 py-2 text-xs text-admin-muted hover:text-admin-text transition-colors"
      >
        <span className="flex items-center gap-2">
          <Palette className="w-3.5 h-3.5" />
          <span>تنسيق وستايل</span>
          {!empty && (
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-admin-accent-soft text-admin-accent">
              مُعدَّل
            </span>
          )}
        </span>
        <ChevronDown className={clsx("w-4 h-4 transition-transform", open && "rotate-180")} />
      </button>

      {open && (
        <div className="border-t border-admin-border p-3 space-y-3">
          {/* Color */}
          <ColorRow
            label="لون النص"
            value={value.color}
            onChange={(color) => patch({ color: color || undefined })}
          />

          {/* Font Size */}
          <SelectRow
            icon={ALargeSmall}
            label="حجم الخط"
            value={value.fontSize ?? ""}
            onChange={(v) => patch({ fontSize: v || undefined })}
            options={[{ value: "", label: "افتراضي" }, ...FONT_SIZE_PRESETS]}
            allowCustom
            customPlaceholder="مثال: 2.5rem"
          />

          {/* Font Family */}
          <SelectRow
            icon={Type}
            label="نوع الخط"
            value={value.fontFamily ?? ""}
            onChange={(v) => patch({ fontFamily: (v || undefined) as StyleOverride["fontFamily"] })}
            options={[
              { value: "", label: "افتراضي" },
              ...FONT_FAMILY_OPTIONS.map((o) => ({ value: o.value, label: o.label })),
            ]}
          />

          {/* Custom font input when custom selected */}
          {value.fontFamily === "custom" && (
            <div>
              <label className="admin-label text-xs">اسم الخط المخصّص (CSS)</label>
              <input
                type="text"
                placeholder='مثال: "Cairo", sans-serif'
                value={value.customFont ?? ""}
                onChange={(e) => patch({ customFont: e.target.value })}
                className="admin-input text-sm"
              />
            </div>
          )}

          {/* Font Weight */}
          <SelectRow
            icon={Bold}
            label="سُمك الخط"
            value={value.fontWeight ?? ""}
            onChange={(v) => patch({ fontWeight: v || undefined })}
            options={[{ value: "", label: "افتراضي" }, ...FONT_WEIGHT_OPTIONS]}
          />

          {showAdvanced && (
            <>
              {/* Letter Spacing */}
              <SelectRow
                label="تباعد الحروف"
                value={value.letterSpacing ?? ""}
                onChange={(v) => patch({ letterSpacing: v || undefined })}
                options={[
                  { value: "", label: "افتراضي" },
                  { value: "-0.05em", label: "ضيق جداً (-0.05em)" },
                  { value: "-0.025em", label: "ضيق (-0.025em)" },
                  { value: "0", label: "عادي (0)" },
                  { value: "0.025em", label: "واسع (0.025em)" },
                  { value: "0.05em", label: "أوسع (0.05em)" },
                  { value: "0.1em", label: "واسع جداً (0.1em)" },
                  { value: "0.2em", label: "أقصى (0.2em)" },
                ]}
                allowCustom
                customPlaceholder="مثال: 0.05em"
              />

              {/* Line Height */}
              <SelectRow
                label="ارتفاع السطر"
                value={value.lineHeight ?? ""}
                onChange={(v) => patch({ lineHeight: v || undefined })}
                options={[
                  { value: "", label: "افتراضي" },
                  { value: "1", label: "1 (متلاصق)" },
                  { value: "1.1", label: "1.1" },
                  { value: "1.25", label: "1.25" },
                  { value: "1.5", label: "1.5 (طبيعي)" },
                  { value: "1.75", label: "1.75" },
                  { value: "2", label: "2 (مريح)" },
                ]}
                allowCustom
                customPlaceholder="مثال: 1.4"
              />

              {/* Text Transform */}
              <SelectRow
                label="حالة الأحرف"
                value={value.textTransform ?? ""}
                onChange={(v) =>
                  patch({ textTransform: (v || undefined) as StyleOverride["textTransform"] })
                }
                options={[
                  { value: "", label: "افتراضي" },
                  { value: "none", label: "بدون تحويل" },
                  { value: "uppercase", label: "UPPERCASE" },
                  { value: "lowercase", label: "lowercase" },
                  { value: "capitalize", label: "Capitalize" },
                ]}
              />

              {/* Font Style */}
              <SelectRow
                label="ميل الخط"
                value={value.fontStyle ?? ""}
                onChange={(v) =>
                  patch({ fontStyle: (v || undefined) as StyleOverride["fontStyle"] })
                }
                options={[
                  { value: "", label: "افتراضي" },
                  { value: "normal", label: "عادي" },
                  { value: "italic", label: "مائل (Italic)" },
                ]}
              />

              {/* Text Decoration */}
              <SelectRow
                label="زخرفة النص"
                value={value.textDecoration ?? ""}
                onChange={(v) =>
                  patch({ textDecoration: (v || undefined) as StyleOverride["textDecoration"] })
                }
                options={[
                  { value: "", label: "افتراضي" },
                  { value: "none", label: "بدون" },
                  { value: "underline", label: "خط سفلي" },
                  { value: "line-through", label: "خط في المنتصف" },
                ]}
              />

              {/* Text Align */}
              <SelectRow
                icon={AlignCenter}
                label="محاذاة النص"
                value={value.textAlign ?? ""}
                onChange={(v) =>
                  patch({ textAlign: (v || undefined) as StyleOverride["textAlign"] })
                }
                options={[
                  { value: "", label: "افتراضي" },
                  { value: "start", label: "بداية" },
                  { value: "center", label: "وسط" },
                  { value: "end", label: "نهاية" },
                  { value: "justify", label: "ممدود" },
                ]}
              />
            </>
          )}

          <button
            type="button"
            onClick={reset}
            disabled={empty}
            className="admin-btn-ghost w-full justify-center text-xs disabled:opacity-30"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>إعادة لقيم افتراضية</span>
          </button>
        </div>
      )}
    </div>
  );
}

/* ───────── Sub-components ───────── */

function ColorRow({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string | undefined;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className="admin-label text-xs">{label}</label>
      <div className="flex items-center gap-2">
        <input
          type="color"
          value={value ?? "#e8e6df"}
          onChange={(e) => onChange(e.target.value)}
          className="h-9 w-12 rounded border border-admin-border bg-transparent cursor-pointer p-0"
        />
        <input
          type="text"
          placeholder="#d97757"
          value={value ?? ""}
          onChange={(e) => onChange(e.target.value)}
          className="admin-input text-sm flex-1"
        />
        {value && (
          <button
            type="button"
            onClick={() => onChange("")}
            className="text-xs text-admin-muted hover:text-admin-text px-2"
          >
            مسح
          </button>
        )}
      </div>
      <div className="mt-2 flex flex-wrap gap-1.5">
        {COLOR_PRESETS.map((c) => (
          <button
            key={c.value}
            type="button"
            title={c.label}
            onClick={() => onChange(c.value)}
            className={clsx(
              "w-6 h-6 rounded-md border-2 transition-all",
              value === c.value ? "border-admin-accent scale-110" : "border-admin-border hover:scale-110",
            )}
            style={{ backgroundColor: c.value }}
          />
        ))}
      </div>
    </div>
  );
}

function SelectRow({
  icon: Icon,
  label,
  value,
  onChange,
  options,
  allowCustom = false,
  customPlaceholder,
}: {
  icon?: React.ElementType;
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  allowCustom?: boolean;
  customPlaceholder?: string;
}) {
  const isCustom = allowCustom && value && !options.some((o) => o.value === value);
  const [showCustom, setShowCustom] = useState(isCustom);

  return (
    <div>
      <label className="admin-label text-xs flex items-center gap-1.5">
        {Icon && <Icon className="w-3 h-3" />}
        <span>{label}</span>
      </label>
      <div className="flex items-center gap-2">
        <select
          value={isCustom || showCustom ? "__custom__" : value}
          onChange={(e) => {
            if (e.target.value === "__custom__") {
              setShowCustom(true);
            } else {
              setShowCustom(false);
              onChange(e.target.value);
            }
          }}
          className="admin-input text-sm flex-1"
        >
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
          {allowCustom && <option value="__custom__">مخصّص…</option>}
        </select>
      </div>
      {(isCustom || showCustom) && (
        <input
          type="text"
          placeholder={customPlaceholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="admin-input text-sm mt-2"
        />
      )}
    </div>
  );
}
