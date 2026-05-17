"use client";

import Link from "next/link";
import { Save, ExternalLink, Languages, Loader2, Check, AlertTriangle } from "lucide-react";
import clsx from "clsx";
import { useState, useEffect, useTransition } from "react";

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

  useEffect(() => {
    if (!isSaving && savedFlash) {
      const t = setTimeout(() => setSavedFlash(false), 1500);
      return () => clearTimeout(t);
    }
  }, [isSaving, savedFlash]);

  return (
    <div className="sticky top-16 z-30 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-4 bg-admin-bg/90 backdrop-blur-xl border-b border-admin-border mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="min-w-0">
          <h1 className="text-xl sm:text-2xl font-bold text-admin-text truncate">{title}</h1>
          {subtitle && <p className="text-xs sm:text-sm text-admin-muted mt-0.5">{subtitle}</p>}
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
            >
              تراجع
            </button>
          )}

          <button
            type="button"
            onClick={() => {
              setSavedFlash(true);
              onSave();
            }}
            disabled={!isDirty || isSaving}
            className={clsx(
              "admin-btn-primary text-xs disabled:opacity-50 disabled:cursor-not-allowed",
              isDirty && !isSaving && "animate-pulse",
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
        <div className="mt-3 flex items-center gap-2 text-xs text-yellow-400">
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>عندك تعديلات لم تُحفظ بعد</span>
        </div>
      )}
    </div>
  );
}
