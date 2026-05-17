"use client";

import { useState, useTransition, useMemo } from "react";
import { Palette, Trash2, AlertCircle } from "lucide-react";
import { PageToolbar } from "../_components/page-toolbar";
import { SectionCard } from "../_components/section-card";
import { StyleControls } from "../_components/style-controls";
import { saveAllStylesAction } from "./actions";
import type { Locale } from "@/lib/i18n/config";
import type { ContentStyles, StyleOverride } from "@/lib/content/style-types";

const PATH_LABELS: Record<string, string> = {
  "hero.eyebrow": "Hero — العنوان الصغير",
  "hero.titleStart": "Hero — بداية العنوان",
  "hero.titleHighlight": "Hero — الكلمة المميزة",
  "hero.titleEnd": "Hero — نهاية العنوان",
  "hero.subtitle": "Hero — الوصف",
  "hero.scrollHint": "Hero — تلميح التمرير",
  "servicesPreview.sectionLabel": "خدماتنا — تسمية القسم",
  "servicesPreview.title": "خدماتنا — العنوان",
  "servicesPreview.subtitle": "خدماتنا — الوصف",
  "bigStats.sectionLabel": "إحصائيات — تسمية القسم",
  "bigStats.title": "إحصائيات — العنوان",
  "bigStats.subtitle": "إحصائيات — الوصف",
  "process.sectionLabel": "كيف نعمل — تسمية القسم",
  "process.title": "كيف نعمل — العنوان",
  "process.subtitle": "كيف نعمل — الوصف",
  "whyUs.sectionLabel": "لماذا نحن — تسمية القسم",
  "whyUs.title": "لماذا نحن — العنوان",
  "whyUs.subtitle": "لماذا نحن — الوصف",
  "cta.title": "CTA — العنوان",
  "cta.subtitle": "CTA — الوصف",
  "about.sectionLabel": "من نحن — تسمية القسم",
  "about.title": "من نحن — العنوان",
  "services.title": "الخدمات — العنوان",
  "contact.title": "تواصل — العنوان",
};

function labelFor(path: string): string {
  return PATH_LABELS[path] ?? path;
}

type Props = {
  locale: Locale;
  initialStyles: ContentStyles;
};

export function StylesOverview({ locale, initialStyles }: Props) {
  const [styles, setStyles] = useState<ContentStyles>(initialStyles);
  const [pending, startTransition] = useTransition();

  const initialJSON = useMemo(() => JSON.stringify(initialStyles), [initialStyles]);
  const isDirty = JSON.stringify(styles) !== initialJSON;

  const entries = Object.entries(styles).filter(
    ([, s]) => s && Object.keys(s).length > 0,
  );

  function handleSave() {
    startTransition(async () => {
      try {
        await saveAllStylesAction(locale, styles);
        location.reload();
      } catch {
        alert("فشل الحفظ.");
      }
    });
  }

  function clearAll() {
    if (confirm("متأكد إنك عايز تمسح كل التنسيقات المخصّصة؟")) {
      setStyles({});
    }
  }

  function clearOne(path: string) {
    setStyles((prev) => {
      const next = { ...prev };
      delete next[path];
      return next;
    });
  }

  function updateOne(path: string, override: StyleOverride) {
    setStyles((prev) => {
      const next = { ...prev };
      if (!override || Object.keys(override).length === 0) delete next[path];
      else next[path] = override;
      return next;
    });
  }

  return (
    <div>
      <PageToolbar
        title="الألوان والخطوط"
        subtitle={
          locale === "ar"
            ? "كل التنسيقات المخصصة المطبقة على النسخة العربية"
            : "All custom style overrides for English"
        }
        locale={locale}
        basePath="/admin/styles"
        isDirty={isDirty}
        isSaving={pending}
        onSave={handleSave}
        onReset={() => setStyles(initialStyles)}
      />

      <div className="space-y-4 max-w-4xl">
        <div className="admin-card p-5 flex items-start gap-3">
          <div className="w-10 h-10 rounded-lg bg-admin-accent-soft text-admin-accent grid place-items-center shrink-0">
            <Palette className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-admin-text">إدارة التنسيقات</h3>
            <p className="text-sm text-admin-muted mt-1">
              هتلاقي هنا كل العناصر اللي عدّلت تنسيقها (لون، حجم، خط) من صفحات التحرير. تقدر تعدّل أو تمسح أي تنسيق منها.
            </p>
            <p className="text-xs text-admin-subtle mt-2">
              💡 لإضافة تنسيق جديد، روح للصفحة المعنية واستخدم زر "تنسيق وستايل" تحت كل حقل.
            </p>
          </div>
          {entries.length > 0 && (
            <button
              type="button"
              onClick={clearAll}
              className="admin-btn-danger text-xs"
            >
              <Trash2 className="w-4 h-4" />
              <span>مسح الكل</span>
            </button>
          )}
        </div>

        {entries.length === 0 ? (
          <div className="admin-card p-12 text-center">
            <AlertCircle className="w-12 h-12 text-admin-subtle mx-auto mb-3" />
            <h3 className="font-bold text-admin-text mb-1">
              مفيش تنسيقات مخصصة لسه
            </h3>
            <p className="text-sm text-admin-muted">
              ادخل على أي صفحة وعدّل تنسيق حقل عشان تشوفه هنا.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {entries.map(([path, override]) => (
              <SectionCard
                key={path}
                title={labelFor(path)}
                subtitle={path}
                defaultOpen={false}
                rightSlot={
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      clearOne(path);
                    }}
                    className="admin-btn-danger text-xs px-2 py-1"
                    title="حذف هذا التنسيق"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                }
              >
                <StyleControls
                  value={override}
                  onChange={(s) => updateOne(path, s)}
                />
              </SectionCard>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
