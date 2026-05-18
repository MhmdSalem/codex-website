"use client";

import { useState, useTransition } from "react";
import {
  Settings as SettingsIcon,
  Power,
  ExternalLink,
  AlertTriangle,
  Loader2,
  Check,
  Construction,
} from "lucide-react";
import clsx from "clsx";
import { SectionCard } from "../_components/section-card";
import { updateSiteSettingsAction } from "./actions";
import type { SiteSettings } from "@/lib/settings/service";

type Props = {
  initial: SiteSettings;
};

export function SettingsForm({ initial }: Props) {
  const [settings, setSettings] = useState<SiteSettings>(initial);
  const [savedAt, setSavedAt] = useState<number | null>(null);
  const [pending, startTransition] = useTransition();

  const toggleMaintenance = () => {
    const next: SiteSettings = {
      ...settings,
      maintenanceMode: !settings.maintenanceMode,
    };
    setSettings(next);
    startTransition(async () => {
      try {
        const saved = await updateSiteSettingsAction({
          maintenanceMode: next.maintenanceMode,
        });
        setSettings(saved);
        setSavedAt(Date.now());
      } catch (e) {
        console.error(e);
        alert("فشل الحفظ.");
        setSettings(settings);
      }
    });
  };

  const updateMessage = (locale: "ar" | "en", value: string) => {
    setSettings((s) => ({
      ...s,
      maintenanceMessage: { ...s.maintenanceMessage, [locale]: value },
    }));
  };

  const saveMessages = () => {
    startTransition(async () => {
      try {
        const saved = await updateSiteSettingsAction({
          maintenanceMessage: settings.maintenanceMessage,
        });
        setSettings(saved);
        setSavedAt(Date.now());
      } catch (e) {
        console.error(e);
        alert("فشل الحفظ.");
      }
    });
  };

  return (
    <div className="space-y-4 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 pb-4 border-b border-admin-border/60 mb-2">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-admin-accent-soft text-admin-accent grid place-items-center">
            <SettingsIcon className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-admin-text">
              الإعدادات
            </h1>
            <p className="text-xs text-admin-muted mt-0.5">
              التحكم في حالة الموقع ووضع الصيانة
            </p>
          </div>
        </div>
        {savedAt && !pending && (
          <span className="inline-flex items-center gap-1.5 text-xs text-emerald-400">
            <Check className="w-3.5 h-3.5" />
            تم الحفظ
          </span>
        )}
        {pending && (
          <span className="inline-flex items-center gap-1.5 text-xs text-blue-400">
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
            جارٍ الحفظ...
          </span>
        )}
      </div>

      {/* Maintenance mode toggle */}
      <SectionCard
        title="وضع الصيانة"
        subtitle="إخفاء الموقع العام عن الزوار وعرض صفحة 'تحت الصيانة'"
        icon={Construction}
        badge={settings.maintenanceMode ? "مفعّل" : undefined}
      >
        <div
          className={clsx(
            "rounded-2xl border p-5 transition-colors",
            settings.maintenanceMode
              ? "border-yellow-500/30 bg-yellow-500/5"
              : "border-admin-border bg-admin-surface-2/30",
          )}
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3 flex-1 min-w-0">
              <div
                className={clsx(
                  "w-10 h-10 rounded-xl grid place-items-center shrink-0 transition-colors",
                  settings.maintenanceMode
                    ? "bg-yellow-500/15 text-yellow-400"
                    : "bg-admin-surface-3 text-admin-muted",
                )}
              >
                <Power className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <div className="font-bold text-admin-text">
                  {settings.maintenanceMode
                    ? "الموقع في وضع الصيانة حالياً"
                    : "الموقع مفتوح للزوار"}
                </div>
                <p className="text-xs text-admin-muted mt-1 leading-relaxed">
                  {settings.maintenanceMode
                    ? "أي زائر بيدخل codex-me.com هيشوف صفحة 'تحت الصيانة'. الداش بورد بيشتغل عادي وأنت كأدمن بتقدر تتصفح الموقع زي الطبيعي."
                    : "كل الزوار بيشوفوا الموقع بالشكل العادي. لما تفعّل وضع الصيانة، الموقع هيتقفل فوراً."}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={toggleMaintenance}
              disabled={pending}
              role="switch"
              aria-checked={settings.maintenanceMode}
              className={clsx(
                "relative inline-flex h-7 w-14 items-center rounded-full transition-colors shrink-0 disabled:opacity-50",
                settings.maintenanceMode
                  ? "bg-yellow-500"
                  : "bg-admin-surface-3",
              )}
            >
              <span
                className={clsx(
                  "inline-block h-5 w-5 rounded-full bg-white transition-transform shadow-md",
                  settings.maintenanceMode ? "translate-x-8" : "translate-x-1",
                )}
              />
            </button>
          </div>

          {settings.maintenanceMode && (
            <div className="mt-4 pt-4 border-t border-yellow-500/20 flex flex-wrap items-center gap-3">
              <a
                href="/ar"
                target="_blank"
                rel="noreferrer"
                className="admin-btn-secondary text-xs"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>معاينة صفحة الصيانة</span>
              </a>
              <span className="text-[11px] text-yellow-400 inline-flex items-center gap-1.5">
                <AlertTriangle className="w-3 h-3" />
                الزوار الجدد لن يتمكنوا من تصفح الموقع
              </span>
            </div>
          )}
        </div>
      </SectionCard>

      {/* Maintenance messages */}
      <SectionCard
        title="نص صفحة الصيانة"
        subtitle="الرسالة اللي بتظهر للزوار أثناء فترة الصيانة"
        icon={SettingsIcon}
        defaultOpen={false}
      >
        <div className="space-y-4">
          <div>
            <label className="admin-label">الرسالة بالعربية</label>
            <textarea
              dir="rtl"
              value={settings.maintenanceMessage.ar}
              onChange={(e) => updateMessage("ar", e.target.value)}
              rows={3}
              placeholder="نعمل على تحسينات الموقع، يرجى العودة قريباً."
              className="admin-input"
            />
          </div>
          <div>
            <label className="admin-label">Message (English)</label>
            <textarea
              dir="ltr"
              value={settings.maintenanceMessage.en}
              onChange={(e) => updateMessage("en", e.target.value)}
              rows={3}
              placeholder="We're polishing things up. We'll be back shortly."
              className="admin-input"
            />
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={saveMessages}
              disabled={pending}
              className="admin-btn-primary text-sm"
            >
              {pending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Check className="w-4 h-4" />
              )}
              <span>حفظ الرسالة</span>
            </button>
          </div>
        </div>
      </SectionCard>
    </div>
  );
}
