"use client";

import { useState, useTransition, useMemo, useCallback } from "react";
import {
  Sparkles,
  Layers,
  BarChart3,
  ListChecks,
  Award,
  Megaphone,
} from "lucide-react";
import { PageToolbar } from "../../_components/page-toolbar";
import { SectionCard } from "../../_components/section-card";
import {
  TextField,
  StringListField,
  NumberField,
} from "../../_components/field-editor";
import { RichTextField } from "../../_components/rich-text-field";
import { TitleComposer } from "../../_components/title-composer";
import { saveContentAndStyles } from "../../_actions/content-actions";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/get-dictionary";
import type { ContentStyles, StyleOverride } from "@/lib/content/style-types";

type Props = {
  locale: Locale;
  initialData: Dictionary;
  initialStyles: ContentStyles;
};

export function HomeEditor({ locale, initialData, initialStyles }: Props) {
  const [data, setData] = useState<Dictionary>(initialData);
  const [styles, setStyles] = useState<ContentStyles>(initialStyles);
  const [pending, startTransition] = useTransition();

  const initialJSON = useMemo(
    () => JSON.stringify({ data: initialData, styles: initialStyles }),
    [initialData, initialStyles],
  );
  const isDirty = JSON.stringify({ data, styles }) !== initialJSON;

  const setField = useCallback((updater: (prev: Dictionary) => Dictionary) => {
    setData(updater);
  }, []);

  const setStyle = useCallback((path: string, override: StyleOverride) => {
    setStyles((prev) => {
      const next = { ...prev };
      if (!override || Object.keys(override).length === 0) {
        delete next[path];
      } else {
        next[path] = override;
      }
      return next;
    });
  }, []);

  const styleFor = (path: string): StyleOverride => styles[path] ?? {};

  function handleSave() {
    startTransition(async () => {
      try {
        await saveContentAndStyles({ locale, data, styles });
        location.reload();
      } catch (err) {
        console.error(err);
        alert("فشل الحفظ. حاول مرة أخرى.");
      }
    });
  }

  function handleReset() {
    setData(initialData);
    setStyles(initialStyles);
  }

  return (
    <div>
      <PageToolbar
        title="الصفحة الرئيسية"
        subtitle={locale === "ar" ? "النسخة العربية" : "English version"}
        locale={locale}
        basePath="/admin/pages/home"
        previewHref={`/${locale}`}
        isDirty={isDirty}
        isSaving={pending}
        onSave={handleSave}
        onReset={handleReset}
      />

      <div className="space-y-4 max-w-4xl">
        {/* Hero Section */}
        <SectionCard
          title="القسم الأول — Hero"
          subtitle="الصورة الكبيرة في أعلى الصفحة"
          icon={Sparkles}
          badge="01"
        >
          <TextField
            label="نص العنوان الصغير (Eyebrow)"
            description="النص الصغير فوق العنوان الرئيسي"
            path="hero.eyebrow"
            value={data.hero.eyebrow}
            onChange={(v) =>
              setField((d) => ({ ...d, hero: { ...d.hero, eyebrow: v } }))
            }
            styles={styleFor("hero.eyebrow")}
            onStyleChange={(s) => setStyle("hero.eyebrow", s)}
          />

          <TitleComposer
            label="العنوان الرئيسي"
            description="اكتب العنوان كاملاً مع الجزء المميز بين [[ ]]"
            basePath="hero"
            start={data.hero.titleStart}
            highlight={data.hero.titleHighlight}
            end={data.hero.titleEnd}
            onChange={({ start, highlight, end }) =>
              setField((d) => ({
                ...d,
                hero: {
                  ...d.hero,
                  titleStart: start,
                  titleHighlight: highlight,
                  titleEnd: end,
                },
              }))
            }
            startStyles={styleFor("hero.titleStart")}
            highlightStyles={styleFor("hero.titleHighlight")}
            endStyles={styleFor("hero.titleEnd")}
            onStartStyleChange={(s) => setStyle("hero.titleStart", s)}
            onHighlightStyleChange={(s) => setStyle("hero.titleHighlight", s)}
            onEndStyleChange={(s) => setStyle("hero.titleEnd", s)}
          />

          <RichTextField
            label="الوصف (Subtitle)"
            description="فقرة كاملة تحت العنوان — تقدر تنسّقها بـ Bold/Italic/قوائم"
            path="hero.subtitle"
            value={data.hero.subtitle}
            onChange={(v) =>
              setField((d) => ({ ...d, hero: { ...d.hero, subtitle: v } }))
            }
            placeholder="اكتب وصف قصير عن الشركة أو الخدمة..."
            toolbar="simple"
            styles={styleFor("hero.subtitle")}
            onStyleChange={(s) => setStyle("hero.subtitle", s)}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <TextField
              label="زر أساسي"
              path="hero.ctaPrimary"
              value={data.hero.ctaPrimary}
              onChange={(v) =>
                setField((d) => ({ ...d, hero: { ...d.hero, ctaPrimary: v } }))
              }
            />
            <TextField
              label="زر ثانوي"
              path="hero.ctaSecondary"
              value={data.hero.ctaSecondary}
              onChange={(v) =>
                setField((d) => ({ ...d, hero: { ...d.hero, ctaSecondary: v } }))
              }
            />
          </div>

          <TextField
            label="نص التمرير (Scroll Hint)"
            path="hero.scrollHint"
            value={data.hero.scrollHint}
            onChange={(v) =>
              setField((d) => ({ ...d, hero: { ...d.hero, scrollHint: v } }))
            }
            styles={styleFor("hero.scrollHint")}
            onStyleChange={(s) => setStyle("hero.scrollHint", s)}
          />

          <StringListField
            label="الشريط المتحرك (Marquee)"
            description="الكلمات اللي بتمر أسفل الـ Hero"
            path="hero.marquee"
            value={data.hero.marquee}
            onChange={(v) =>
              setField((d) => ({ ...d, hero: { ...d.hero, marquee: v } }))
            }
          />
        </SectionCard>

        {/* Services Preview */}
        <SectionCard
          title="القسم الثاني — معاينة الخدمات"
          subtitle="الـ Bento Grid لأبرز الخدمات"
          icon={Layers}
          badge="02"
        >
          <TextField
            label="عنوان القسم (Section Label)"
            path="servicesPreview.sectionLabel"
            value={data.servicesPreview.sectionLabel}
            onChange={(v) =>
              setField((d) => ({
                ...d,
                servicesPreview: { ...d.servicesPreview, sectionLabel: v },
              }))
            }
            styles={styleFor("servicesPreview.sectionLabel")}
            onStyleChange={(s) => setStyle("servicesPreview.sectionLabel", s)}
          />

          <TextField
            label="العنوان"
            path="servicesPreview.title"
            value={data.servicesPreview.title}
            onChange={(v) =>
              setField((d) => ({
                ...d,
                servicesPreview: { ...d.servicesPreview, title: v },
              }))
            }
            styles={styleFor("servicesPreview.title")}
            onStyleChange={(s) => setStyle("servicesPreview.title", s)}
          />

          <RichTextField
            label="الوصف"
            path="servicesPreview.subtitle"
            value={data.servicesPreview.subtitle}
            onChange={(v) =>
              setField((d) => ({
                ...d,
                servicesPreview: { ...d.servicesPreview, subtitle: v },
              }))
            }
            toolbar="simple"
            styles={styleFor("servicesPreview.subtitle")}
            onStyleChange={(s) => setStyle("servicesPreview.subtitle", s)}
          />

          <TextField
            label="نص زر 'شاهد كل الخدمات'"
            path="servicesPreview.viewAll"
            value={data.servicesPreview.viewAll}
            onChange={(v) =>
              setField((d) => ({
                ...d,
                servicesPreview: { ...d.servicesPreview, viewAll: v },
              }))
            }
          />

          <div className="space-y-3">
            <h4 className="font-bold text-admin-text text-sm">عناصر الخدمات</h4>
            {data.servicesPreview.items.map((item, i) => (
              <div
                key={i}
                className="rounded-xl border border-admin-border bg-admin-bg/40 p-4 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-admin-accent">
                    خدمة #{i + 1}
                  </span>
                </div>
                <TextField
                  label="العنوان"
                  path={`servicesPreview.items.${i}.title`}
                  value={item.title}
                  onChange={(v) =>
                    setField((d) => {
                      const next = [...d.servicesPreview.items];
                      next[i] = { ...next[i], title: v };
                      return {
                        ...d,
                        servicesPreview: { ...d.servicesPreview, items: next },
                      };
                    })
                  }
                  styles={styleFor(`servicesPreview.items.${i}.title`)}
                  onStyleChange={(s) =>
                    setStyle(`servicesPreview.items.${i}.title`, s)
                  }
                />
                <RichTextField
                  label="الوصف"
                  path={`servicesPreview.items.${i}.description`}
                  value={item.description}
                  onChange={(v) =>
                    setField((d) => {
                      const next = [...d.servicesPreview.items];
                      next[i] = { ...next[i], description: v };
                      return {
                        ...d,
                        servicesPreview: { ...d.servicesPreview, items: next },
                      };
                    })
                  }
                  toolbar="simple"
                  styles={styleFor(`servicesPreview.items.${i}.description`)}
                  onStyleChange={(s) =>
                    setStyle(`servicesPreview.items.${i}.description`, s)
                  }
                />
                <TextField
                  label="الشارة (Badge)"
                  path={`servicesPreview.items.${i}.badge`}
                  value={item.badge}
                  onChange={(v) =>
                    setField((d) => {
                      const next = [...d.servicesPreview.items];
                      next[i] = { ...next[i], badge: v };
                      return {
                        ...d,
                        servicesPreview: { ...d.servicesPreview, items: next },
                      };
                    })
                  }
                />
              </div>
            ))}
          </div>
        </SectionCard>

        {/* Big Stats */}
        <SectionCard
          title="القسم الثالث — الإحصائيات الكبيرة"
          icon={BarChart3}
          badge="03"
        >
          <TextField
            label="عنوان القسم"
            path="bigStats.sectionLabel"
            value={data.bigStats.sectionLabel}
            onChange={(v) =>
              setField((d) => ({
                ...d,
                bigStats: { ...d.bigStats, sectionLabel: v },
              }))
            }
            styles={styleFor("bigStats.sectionLabel")}
            onStyleChange={(s) => setStyle("bigStats.sectionLabel", s)}
          />
          <TextField
            label="العنوان الرئيسي"
            path="bigStats.title"
            value={data.bigStats.title}
            onChange={(v) =>
              setField((d) => ({ ...d, bigStats: { ...d.bigStats, title: v } }))
            }
            styles={styleFor("bigStats.title")}
            onStyleChange={(s) => setStyle("bigStats.title", s)}
          />
          <RichTextField
            label="الوصف"
            path="bigStats.subtitle"
            value={data.bigStats.subtitle}
            onChange={(v) =>
              setField((d) => ({ ...d, bigStats: { ...d.bigStats, subtitle: v } }))
            }
            toolbar="simple"
            styles={styleFor("bigStats.subtitle")}
            onStyleChange={(s) => setStyle("bigStats.subtitle", s)}
          />

          <div className="space-y-3">
            <h4 className="font-bold text-admin-text text-sm">الأرقام</h4>
            {data.bigStats.items.map((item, i) => (
              <div
                key={i}
                className="rounded-xl border border-admin-border bg-admin-bg/40 p-4 grid grid-cols-1 sm:grid-cols-3 gap-3"
              >
                <NumberField
                  label="الرقم"
                  path={`bigStats.items.${i}.value`}
                  value={item.value}
                  onChange={(v) =>
                    setField((d) => {
                      const next = [...d.bigStats.items];
                      next[i] = { ...next[i], value: v };
                      return { ...d, bigStats: { ...d.bigStats, items: next } };
                    })
                  }
                  styles={styleFor(`bigStats.items.${i}.value`)}
                  onStyleChange={(s) =>
                    setStyle(`bigStats.items.${i}.value`, s)
                  }
                />
                <TextField
                  label="اللاحقة (Suffix)"
                  hint="مثل: + أو %"
                  path={`bigStats.items.${i}.suffix`}
                  value={item.suffix}
                  onChange={(v) =>
                    setField((d) => {
                      const next = [...d.bigStats.items];
                      next[i] = { ...next[i], suffix: v };
                      return { ...d, bigStats: { ...d.bigStats, items: next } };
                    })
                  }
                />
                <TextField
                  label="التسمية"
                  path={`bigStats.items.${i}.label`}
                  value={item.label}
                  onChange={(v) =>
                    setField((d) => {
                      const next = [...d.bigStats.items];
                      next[i] = { ...next[i], label: v };
                      return { ...d, bigStats: { ...d.bigStats, items: next } };
                    })
                  }
                  styles={styleFor(`bigStats.items.${i}.label`)}
                  onStyleChange={(s) =>
                    setStyle(`bigStats.items.${i}.label`, s)
                  }
                />
              </div>
            ))}
          </div>
        </SectionCard>

        {/* Process */}
        <SectionCard
          title="القسم الرابع — كيف نعمل"
          icon={ListChecks}
          badge="04"
        >
          <TextField
            label="عنوان القسم"
            path="process.sectionLabel"
            value={data.process.sectionLabel}
            onChange={(v) =>
              setField((d) => ({ ...d, process: { ...d.process, sectionLabel: v } }))
            }
            styles={styleFor("process.sectionLabel")}
            onStyleChange={(s) => setStyle("process.sectionLabel", s)}
          />
          <TextField
            label="العنوان الرئيسي"
            path="process.title"
            value={data.process.title}
            onChange={(v) =>
              setField((d) => ({ ...d, process: { ...d.process, title: v } }))
            }
            styles={styleFor("process.title")}
            onStyleChange={(s) => setStyle("process.title", s)}
          />
          <RichTextField
            label="الوصف"
            path="process.subtitle"
            value={data.process.subtitle}
            onChange={(v) =>
              setField((d) => ({ ...d, process: { ...d.process, subtitle: v } }))
            }
            toolbar="simple"
            styles={styleFor("process.subtitle")}
            onStyleChange={(s) => setStyle("process.subtitle", s)}
          />

          <div className="space-y-3">
            <h4 className="font-bold text-admin-text text-sm">الخطوات</h4>
            {data.process.steps.map((step, i) => (
              <div
                key={i}
                className="rounded-xl border border-admin-border bg-admin-bg/40 p-4 space-y-3"
              >
                <div className="flex items-center gap-2 text-xs font-bold text-admin-accent">
                  <span>الخطوة {step.number}</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <TextField
                    label="الرقم"
                    path={`process.steps.${i}.number`}
                    value={step.number}
                    onChange={(v) =>
                      setField((d) => {
                        const next = [...d.process.steps];
                        next[i] = { ...next[i], number: v };
                        return { ...d, process: { ...d.process, steps: next } };
                      })
                    }
                  />
                  <div className="sm:col-span-2">
                    <TextField
                      label="العنوان"
                      path={`process.steps.${i}.title`}
                      value={step.title}
                      onChange={(v) =>
                        setField((d) => {
                          const next = [...d.process.steps];
                          next[i] = { ...next[i], title: v };
                          return { ...d, process: { ...d.process, steps: next } };
                        })
                      }
                      styles={styleFor(`process.steps.${i}.title`)}
                      onStyleChange={(s) =>
                        setStyle(`process.steps.${i}.title`, s)
                      }
                    />
                  </div>
                </div>
                <RichTextField
                  label="الوصف"
                  path={`process.steps.${i}.description`}
                  value={step.description}
                  onChange={(v) =>
                    setField((d) => {
                      const next = [...d.process.steps];
                      next[i] = { ...next[i], description: v };
                      return { ...d, process: { ...d.process, steps: next } };
                    })
                  }
                  toolbar="simple"
                  styles={styleFor(`process.steps.${i}.description`)}
                  onStyleChange={(s) =>
                    setStyle(`process.steps.${i}.description`, s)
                  }
                />
              </div>
            ))}
          </div>
        </SectionCard>

        {/* Why Us */}
        <SectionCard
          title="القسم الخامس — لماذا نحن"
          icon={Award}
          badge="05"
        >
          <TextField
            label="عنوان القسم"
            path="whyUs.sectionLabel"
            value={data.whyUs.sectionLabel}
            onChange={(v) =>
              setField((d) => ({ ...d, whyUs: { ...d.whyUs, sectionLabel: v } }))
            }
            styles={styleFor("whyUs.sectionLabel")}
            onStyleChange={(s) => setStyle("whyUs.sectionLabel", s)}
          />
          <TextField
            label="العنوان الرئيسي"
            path="whyUs.title"
            value={data.whyUs.title}
            onChange={(v) =>
              setField((d) => ({ ...d, whyUs: { ...d.whyUs, title: v } }))
            }
            styles={styleFor("whyUs.title")}
            onStyleChange={(s) => setStyle("whyUs.title", s)}
          />
          <RichTextField
            label="الوصف"
            path="whyUs.subtitle"
            value={data.whyUs.subtitle}
            onChange={(v) =>
              setField((d) => ({ ...d, whyUs: { ...d.whyUs, subtitle: v } }))
            }
            toolbar="simple"
            styles={styleFor("whyUs.subtitle")}
            onStyleChange={(s) => setStyle("whyUs.subtitle", s)}
          />

          <div className="space-y-3">
            <h4 className="font-bold text-admin-text text-sm">الميزات</h4>
            {data.whyUs.items.map((item, i) => (
              <div
                key={i}
                className="rounded-xl border border-admin-border bg-admin-bg/40 p-4 space-y-3"
              >
                <span className="text-xs font-bold text-admin-accent">
                  ميزة #{i + 1}
                </span>
                <TextField
                  label="العنوان"
                  path={`whyUs.items.${i}.title`}
                  value={item.title}
                  onChange={(v) =>
                    setField((d) => {
                      const next = [...d.whyUs.items];
                      next[i] = { ...next[i], title: v };
                      return { ...d, whyUs: { ...d.whyUs, items: next } };
                    })
                  }
                  styles={styleFor(`whyUs.items.${i}.title`)}
                  onStyleChange={(s) => setStyle(`whyUs.items.${i}.title`, s)}
                />
                <RichTextField
                  label="الوصف"
                  path={`whyUs.items.${i}.description`}
                  value={item.description}
                  onChange={(v) =>
                    setField((d) => {
                      const next = [...d.whyUs.items];
                      next[i] = { ...next[i], description: v };
                      return { ...d, whyUs: { ...d.whyUs, items: next } };
                    })
                  }
                  toolbar="simple"
                  styles={styleFor(`whyUs.items.${i}.description`)}
                  onStyleChange={(s) =>
                    setStyle(`whyUs.items.${i}.description`, s)
                  }
                />
              </div>
            ))}
          </div>
        </SectionCard>

        {/* CTA */}
        <SectionCard
          title="القسم السادس — Call to Action"
          icon={Megaphone}
          badge="06"
        >
          <TextField
            label="العنوان"
            path="cta.title"
            value={data.cta.title}
            onChange={(v) =>
              setField((d) => ({ ...d, cta: { ...d.cta, title: v } }))
            }
            styles={styleFor("cta.title")}
            onStyleChange={(s) => setStyle("cta.title", s)}
          />
          <RichTextField
            label="الوصف"
            path="cta.subtitle"
            value={data.cta.subtitle}
            onChange={(v) =>
              setField((d) => ({ ...d, cta: { ...d.cta, subtitle: v } }))
            }
            toolbar="simple"
            styles={styleFor("cta.subtitle")}
            onStyleChange={(s) => setStyle("cta.subtitle", s)}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <TextField
              label="زر أساسي"
              path="cta.primary"
              value={data.cta.primary}
              onChange={(v) =>
                setField((d) => ({ ...d, cta: { ...d.cta, primary: v } }))
              }
            />
            <TextField
              label="زر ثانوي"
              path="cta.secondary"
              value={data.cta.secondary}
              onChange={(v) =>
                setField((d) => ({ ...d, cta: { ...d.cta, secondary: v } }))
              }
            />
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
