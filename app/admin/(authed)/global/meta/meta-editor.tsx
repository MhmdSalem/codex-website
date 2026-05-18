"use client";

import { useState, useTransition, useMemo } from "react";
import { Search } from "lucide-react";
import { PageToolbar } from "../../_components/page-toolbar";
import { SectionCard } from "../../_components/section-card";
import { TextField } from "../../_components/field-editor";
import { saveContentAndStyles } from "../../_actions/content-actions";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/get-dictionary";
import type { ContentStyles } from "@/lib/content/style-types";

type Props = {
  locale: Locale;
  initialData: Dictionary;
  initialStyles: ContentStyles;
};

export function MetaEditor({ locale, initialData, initialStyles }: Props) {
  const [data, setData] = useState<Dictionary>(initialData);
  const [pending, startTransition] = useTransition();

  const initialJSON = useMemo(() => JSON.stringify(initialData), [initialData]);
  const isDirty = JSON.stringify(data) !== initialJSON;

  function handleSave() {
    startTransition(async () => {
      try {
        await saveContentAndStyles({ locale, data, styles: initialStyles });
        location.reload();
      } catch {
        alert("فشل الحفظ.");
      }
    });
  }

  return (
    <div>
      <PageToolbar
        title="SEO و Meta Tags"
        subtitle={locale === "ar" ? "النسخة العربية" : "English version"}
        locale={locale}
        basePath="/admin/global/meta"
        previewHref={`/${locale}`}
        isDirty={isDirty}
        isSaving={pending}
        onSave={handleSave}
        onReset={() => setData(initialData)}
      />

      <div className="space-y-4 max-w-3xl mx-auto">
        <SectionCard
          title="Meta Tags"
          subtitle="بيانات الـ SEO اللي بتظهر في محركات البحث ومنصات السوشيال"
          icon={Search}
        >
          <TextField
            label="عنوان الصفحة (Title)"
            description="يظهر في تاب المتصفح ونتائج البحث"
            path="meta.title"
            hint="ينصح بأن يكون 50-60 حرف"
            value={data.meta.title}
            onChange={(v) =>
              setData((d) => ({ ...d, meta: { ...d.meta, title: v } }))
            }
          />
          <TextField
            label="الوصف (Description)"
            description="الوصف اللي يظهر في نتائج البحث"
            multiline
            path="meta.description"
            hint="ينصح بأن يكون 150-160 حرف"
            value={data.meta.description}
            onChange={(v) =>
              setData((d) => ({ ...d, meta: { ...d.meta, description: v } }))
            }
          />
          <TextField
            label="الكلمات المفتاحية (Keywords)"
            description="كلمات مفتاحية مفصولة بفواصل"
            path="meta.keywords"
            value={data.meta.keywords}
            onChange={(v) =>
              setData((d) => ({ ...d, meta: { ...d.meta, keywords: v } }))
            }
          />
        </SectionCard>
      </div>
    </div>
  );
}
