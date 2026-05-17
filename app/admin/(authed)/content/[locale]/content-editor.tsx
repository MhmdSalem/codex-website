"use client";

import { useMemo, useState, useTransition } from "react";
import { ChevronDown, Save, RotateCcw, AlertCircle, Check } from "lucide-react";
import clsx from "clsx";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/get-dictionary";
import { SECTION_ORDER, labelFor } from "@/lib/content/labels";
import { saveContentAction } from "./actions";
import { ValueEditor } from "./field-renderers";
import { MediaPicker } from "./media-picker";

type Status =
  | { kind: "idle" }
  | { kind: "saving" }
  | { kind: "ok" }
  | { kind: "error"; message: string };

export function ContentEditor({
  locale,
  initialData,
}: {
  locale: Locale;
  initialData: Dictionary;
}) {
  const [data, setData] = useState<Record<string, unknown>>(
    () => structuredClone(initialData) as unknown as Record<string, unknown>,
  );
  const [openSection, setOpenSection] = useState<string>("hero");
  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const [pickerOpen, setPickerOpen] = useState(false);
  const [pickerTarget, setPickerTarget] = useState<{
    onPick: (url: string) => void;
  } | null>(null);

  const isDirty = useMemo(
    () => JSON.stringify(data) !== JSON.stringify(initialData),
    [data, initialData],
  );

  function updatePath(path: string, value: unknown) {
    setData((prev) => setIn(prev, path, value));
    if (status.kind !== "idle") setStatus({ kind: "idle" });
  }

  function reset() {
    if (!confirm("هتفقد كل التعديلات اللي عملتها. متأكد؟")) return;
    setData(structuredClone(initialData) as unknown as Record<string, unknown>);
    setStatus({ kind: "idle" });
  }

  function save() {
    setStatus({ kind: "saving" });
    startTransition(async () => {
      const res = await saveContentAction(locale, JSON.stringify(data));
      if (res.ok) {
        setStatus({ kind: "ok" });
        setTimeout(() => setStatus({ kind: "idle" }), 2500);
      } else {
        setStatus({ kind: "error", message: res.error });
      }
    });
  }

  function openMediaPicker(onPick: (url: string) => void) {
    setPickerTarget({ onPick });
    setPickerOpen(true);
  }

  function handlePicked(url: string) {
    pickerTarget?.onPick(url);
    setPickerOpen(false);
    setPickerTarget(null);
  }

  return (
    <>
      {/* Sticky save bar */}
      <div className="sticky top-16 z-20 -mx-4 sm:-mx-6 lg:-mx-8 bg-admin-bg/90 backdrop-blur border-y border-admin-border px-4 sm:px-6 lg:px-8 py-3 mb-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-sm">
            {isDirty ? (
              <span className="inline-flex items-center gap-1.5 text-amber-400">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                تغييرات غير محفوظة
              </span>
            ) : (
              <span className="text-admin-muted">لا توجد تغييرات</span>
            )}
            {status.kind === "ok" && (
              <span className="inline-flex items-center gap-1 text-green-400">
                <Check className="w-4 h-4" /> تم الحفظ
              </span>
            )}
            {status.kind === "error" && (
              <span className="inline-flex items-center gap-1 text-red-400">
                <AlertCircle className="w-4 h-4" /> خطأ: {status.message}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={reset}
              disabled={!isDirty || isPending}
              className="admin-btn-ghost"
            >
              <RotateCcw className="w-4 h-4" />
              <span className="hidden sm:inline">استرجاع</span>
            </button>
            <button
              type="button"
              onClick={save}
              disabled={!isDirty || isPending}
              className="admin-btn-primary"
            >
              <Save className="w-4 h-4" />
              {isPending ? "جارٍ الحفظ..." : "حفظ التغييرات"}
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {SECTION_ORDER.map(({ key, label }) => {
          if (!(key in data)) return null;
          const open = openSection === key;
          return (
            <div key={key} className="admin-card overflow-hidden">
              <button
                type="button"
                onClick={() => setOpenSection(open ? "" : key)}
                className="w-full flex items-center justify-between p-4 hover:bg-admin-surface-2 transition-colors"
              >
                <div className="flex items-center gap-3 text-right">
                  <span className="text-base font-semibold text-admin-text">
                    {label}
                  </span>
                  <span className="text-xs text-admin-subtle">{key}</span>
                </div>
                <ChevronDown
                  className={clsx(
                    "w-5 h-5 text-admin-muted transition-transform",
                    open && "rotate-180",
                  )}
                />
              </button>
              {open && (
                <div className="p-5 border-t border-admin-border space-y-4">
                  <ValueEditor
                    path={key}
                    value={data[key]}
                    onChange={(v) => updatePath(key, v)}
                    onPickMedia={openMediaPicker}
                    label={labelFor(key)}
                    locale={locale}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {pickerOpen && (
        <MediaPicker
          onPick={handlePicked}
          onClose={() => {
            setPickerOpen(false);
            setPickerTarget(null);
          }}
        />
      )}
    </>
  );
}

function setIn(obj: Record<string, unknown>, path: string, value: unknown) {
  const segs = path
    .replace(/\[(\d+)\]/g, ".$1")
    .split(".")
    .filter(Boolean);
  const next = structuredClone(obj);
  let cur: unknown = next;
  for (let i = 0; i < segs.length - 1; i += 1) {
    const key = segs[i];
    const ck = isNumeric(key) ? Number(key) : key;
    cur = (cur as Record<string | number, unknown>)[ck];
  }
  const lastRaw = segs[segs.length - 1];
  const lk = isNumeric(lastRaw) ? Number(lastRaw) : lastRaw;
  (cur as Record<string | number, unknown>)[lk] = value;
  return next;
}

function isNumeric(s: string) {
  return /^\d+$/.test(s);
}
