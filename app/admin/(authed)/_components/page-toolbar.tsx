"use client";

import Link from "next/link";
import {
  Save,
  ExternalLink,
  Languages,
  Loader2,
  Check,
  AlertTriangle,
  RotateCcw,
  RefreshCw,
} from "lucide-react";
import clsx from "clsx";
import { useState, useEffect, useTransition } from "react";
import { resetLocaleToDefaultsAction } from "../_actions/content-actions";

type Props = {
  title: string;
  subtitle?: string;
  locale: "ar" | "en";
  basePath: string;
  previewHref?: string;
  isDirty: boolean;
  isSaving: boolean;
  onSave: () => void;
  onReset: () => void;
};

export function PageToolbar({
  title,
  subtitle,
  locale,
  basePath,
  previewHref,
  isDirty,
  isSaving,
  onSave,
  onReset,
}: Props) {
  const otherLocale = locale === "ar" ? "en" : "ar";
  const [savedFlash, setSavedFlash] = useState(false);
  const [resetting, startResetTransition] = useTransition();

  useEffect(() => {
    if (!isSaving && savedFlash) {
      const t = setTimeout(() => setSavedFlash(false), 1500);
      return () => clearTimeout(t);
    }
  }, [isSaving, savedFlash]);

  function handleResetLocale() {
    const langName = locale === "ar" ? "العربية" : "الإنجليزية";
    const ok = window.confirm(
      `هل تريد إعادة تعيين كل محتوى اللغة ${langName} للقيم الافتراضية؟\n\n` +
        "هذا سيمسح كل التعديلات المحفوظة في هذه اللغة ويعيد النصوص الأصلية.\n" +
        "هذا الإجراء لا يمكن التراجع عنه.",
    );
    if (!ok) return;
    startResetTransition(async () => {
      try {
        await resetLocaleToDefaultsAction(locale);
        location.reload();
      } catch (e) {
        console.error(e);
        alert("فشل إعادة التعيين.");
      }
    });
  }

  return (
    <div className="sticky top-16 z-30 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-4 bg-admin-bg/90 backdrop-blur-xl border-b border-admin-border/60 mb-6 shadow-sm">
      <div className="max-w-4xl mx-auto flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="min-w-0 flex items-center gap-3">
          {/* Live status pill */}
          <div
            className={clsx(
              "flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-colors",
              isSaving
                ? "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                : isDirty
                  ? "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20"
                  : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
            )}
          >
            <span
              className={clsx(
                "w-1.5 h-1.5 rounded-full",
                isSaving
                  ? "bg-blue-400 animate-pulse"
                  : isDirty
                    ? "bg-yellow-400 animate-pulse"
                    : "bg-emerald-400",
              )}
            />
            {isSaving ? "جارٍ الحفظ" : isDirty ? "غير محفوظ" : "محفوظ"}
          </div>
          <div className="min-w-0">
            <h1 className="text-xl sm:text-2xl font-bold text-admin-text truncate leading-tight">
              {title}
            </h1>
            {subtitle && (
              <p className="text-xs text-admin-muted mt-0.5">{subtitle}</p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Link
            href={`${basePath}?locale=${otherLocale}`}
            className="admin-btn-secondary text-xs"
            title="تبديل اللغة"
          >
            <Languages className="w-4 h-4" />
            <span>{locale === "ar" ? "English" : "العربية"}</span>
          </Link>

          {previewHref && (
            <a
              href={previewHref}
              target="_blank"
              rel="noreferrer"
              className="admin-btn-secondary text-xs"
            >
              <ExternalLink className="w-4 h-4" />
              <span className="hidden sm:inline">معاينة</span>
            </a>
          )}

          {isDirty && !isSaving && (
            <button
              type="button"
              onClick={onReset}
              className="admin-btn-ghost text-xs"
              title="إلغاء التعديلات والعودة للنسخة المحفوظة"
            >
              <RotateCcw className="w-4 h-4" />
              <span className="hidden sm:inline">تراجع</span>
            </button>
          )}

          <button
            type="button"
            onClick={handleResetLocale}
            disabled={resetting}
            className="admin-btn-ghost text-xs text-yellow-400 hover:text-yellow-300"
            title={`إعادة تعيين كل محتوى ${locale === "ar" ? "العربي" : "الإنجليزي"} للقيم الافتراضية`}
          >
            {resetting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <RefreshCw className="w-4 h-4" />
            )}
            <span className="hidden sm:inline">
              {resetting ? "جارٍ التصفير..." : "تصفير اللغة"}
            </span>
          </button>

          <button
            type="button"
            onClick={() => {
              setSavedFlash(true);
              onSave();
            }}
            disabled={!isDirty || isSaving}
            className={clsx(
              "admin-btn-primary text-xs disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-admin-accent/20",
              isDirty && !isSaving && "ring-2 ring-admin-accent/40",
            )}
          >
            {isSaving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : !isDirty && savedFlash ? (
              <Check className="w-4 h-4" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            <span>
              {isSaving
                ? "جارٍ الحفظ..."
                : !isDirty && savedFlash
                  ? "تم الحفظ"
                  : isDirty
                    ? "حفظ التغييرات"
                    : "محفوظ"}
            </span>
          </button>
        </div>
      </div>

      {isDirty && (
        <div className="max-w-4xl mx-auto mt-3 flex items-center gap-2 text-xs text-yellow-400">
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>عندك تعديلات لم تُحفظ بعد — اضغط حفظ التغييرات</span>
        </div>
      )}
    </div>
  );
}
