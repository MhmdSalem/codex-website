"use client";

import { useState, useTransition, useMemo, useCallback } from "react";
import { Info, Heart } from "lucide-react";
import { PageToolbar } from "../../_components/page-toolbar";
import { SectionCard } from "../../_components/section-card";
import { TextField } from "../../_components/field-editor";
import {
  RichTextField,
  RichTextListField,
} from "../../_components/rich-text-field";
import { saveContentAndStyles } from "../../_actions/content-actions";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/get-dictionary";
import type { ContentStyles, StyleOverride } from "@/lib/content/style-types";

type Props = {
  locale: Locale;
  initialData: Dictionary;
  initialStyles: ContentStyles;
};

export function AboutEditor({ locale, initialData, initialStyles }: Props) {
  const [data, setData] = useState<Dictionary>(initialData);
  const [styles, setStyles] = useState<ContentStyles>(initialStyles);
  const [pending, startTransition] = useTransition();

  const initialJSON = useMemo(
    () => JSON.stringify({ data: initialData, styles: initialStyles }),
    [initialData, initialStyles],
  );
  const isDirty = JSON.stringify({ data, styles }) !== initialJSON;

  const setStyle = useCallback((path: string, override: StyleOverride) => {
    setStyles((prev) => {
      const next = { ...prev };
      if (!override || Object.keys(override).length === 0) delete next[path];
      else next[path] = override;
      return next;
    });
  }, []);
  const styleFor = (path: string): StyleOverride => styles[path] ?? {};

  function handleSave() {
    startTransition(async () => {
      try {
        await saveContentAndStyles({ locale, data, styles });
        location.reload();
      } catch (e) {
        console.error(e);
        alert("فشل الحفظ.");
      }
    });
  }

  return (
    <div>
      <PageToolbar
        title="من نحن"
        subtitle={locale === "ar" ? "النسخة العربية" : "English version"}
        locale={locale}
        basePath="/admin/pages/about"
        previewHref={`/${locale}/about`}
        isDirty={isDirty}
        isSaving={pending}
        onSave={handleSave}
        onReset={() => {
          setData(initialData);
          setStyles(initialStyles);
        }}
      />

      <div className="space-y-4 max-w-4xl">
        <SectionCard title="رأس الصفحة" subtitle="القسم العلوي" icon={Info}>
          <TextField
            label="عنوان القسم"
            path="about.sectionLabel"
            value={data.about.sectionLabel}
            onChange={(v) =>
              setData((d) => ({ ...d, about: { ...d.about, sectionLabel: v } }))
            }
            styles={styleFor("about.sectionLabel")}
            onStyleChange={(s) => setStyle("about.sectionLabel", s)}
          />
          <TextField
            label="العنوان الرئيسي"
            path="about.title"
            value={data.about.title}
            onChange={(v) =>
              setData((d) => ({ ...d, about: { ...d.about, title: v } }))
            }
            styles={styleFor("about.title")}
            onStyleChange={(s) => setStyle("about.title", s)}
          />
          <RichTextListField
            label="فقرات القصة"
            description="كل فقرة محرّر مستقل ينفع تنسيقها بالكامل (Bold, قوائم، روابط...)"
            path="about.paragraphs"
            value={data.about.paragraphs}
            onChange={(v) =>
              setData((d) => ({ ...d, about: { ...d.about, paragraphs: v } }))
            }
            toolbar="rich"
            styles={styleFor("about.paragraphs")}
            onStyleChange={(s) => setStyle("about.paragraphs", s)}
          />
        </SectionCard>

        <SectionCard title="القيم" subtitle="القيم اللي تميز الشركة" icon={Heart}>
          <TextField
            label="عنوان قسم القيم"
            path="about.values.title"
            value={data.about.values.title}
            onChange={(v) =>
              setData((d) => ({
                ...d,
                about: {
                  ...d.about,
                  values: { ...d.about.values, title: v },
                },
              }))
            }
            styles={styleFor("about.values.title")}
            onStyleChange={(s) => setStyle("about.values.title", s)}
          />
          <div className="space-y-3">
            {data.about.values.items.map((item, i) => (
              <div
                key={i}
                className="rounded-xl border border-admin-border bg-admin-bg/40 p-4 space-y-3"
              >
                <span className="text-xs font-bold text-admin-accent">
                  قيمة #{i + 1}
                </span>
                <TextField
                  label="العنوان"
                  path={`about.values.items.${i}.title`}
                  value={item.title}
                  onChange={(v) =>
                    setData((d) => {
                      const next = [...d.about.values.items];
                      next[i] = { ...next[i], title: v };
                      return {
                        ...d,
                        about: {
                          ...d.about,
                          values: { ...d.about.values, items: next },
                        },
                      };
                    })
                  }
                  styles={styleFor(`about.values.items.${i}.title`)}
                  onStyleChange={(s) =>
                    setStyle(`about.values.items.${i}.title`, s)
                  }
                />
                <RichTextField
                  label="الوصف"
                  path={`about.values.items.${i}.description`}
                  value={item.description}
                  onChange={(v) =>
                    setData((d) => {
                      const next = [...d.about.values.items];
                      next[i] = { ...next[i], description: v };
                      return {
                        ...d,
                        about: {
                          ...d.about,
                          values: { ...d.about.values, items: next },
                        },
                      };
                    })
                  }
                  toolbar="simple"
                  styles={styleFor(`about.values.items.${i}.description`)}
                  onStyleChange={(s) =>
                    setStyle(`about.values.items.${i}.description`, s)
                  }
                />
              </div>
            ))}
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
