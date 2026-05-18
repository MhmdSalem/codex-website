"use client";

import { useState, useTransition, useMemo, useCallback } from "react";
import { Briefcase, ListOrdered, DollarSign } from "lucide-react";
import { PageToolbar } from "../../_components/page-toolbar";
import { SectionCard } from "../../_components/section-card";
import {
  TextField,
  StringListField,
  BoolField,
} from "../../_components/field-editor";
import { RichTextField } from "../../_components/rich-text-field";
import { saveContentAndStyles } from "../../_actions/content-actions";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/get-dictionary";
import type { ContentStyles, StyleOverride } from "@/lib/content/style-types";

type Props = {
  locale: Locale;
  initialData: Dictionary;
  initialStyles: ContentStyles;
};

const PLAN_KEYS = ["starter", "pro", "enterprise"] as const;
const PLAN_LABELS: Record<string, string> = {
  starter: "الباقة الأساسية (Starter)",
  pro: "الباقة المتقدمة (Pro)",
  enterprise: "الباقة المؤسسية (Enterprise)",
};

export function ServicesEditor({ locale, initialData, initialStyles }: Props) {
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
        title="الخدمات"
        subtitle={locale === "ar" ? "النسخة العربية" : "English version"}
        locale={locale}
        basePath="/admin/pages/services"
        previewHref={`/${locale}/services`}
        isDirty={isDirty}
        isSaving={pending}
        onSave={handleSave}
        onReset={() => {
          setData(initialData);
          setStyles(initialStyles);
        }}
      />

      <div className="space-y-4 max-w-4xl">
        <SectionCard title="رأس الصفحة" icon={Briefcase}>
          <TextField
            label="عنوان القسم"
            path="services.sectionLabel"
            value={data.services.sectionLabel}
            onChange={(v) =>
              setData((d) => ({
                ...d,
                services: { ...d.services, sectionLabel: v },
              }))
            }
            styles={styleFor("services.sectionLabel")}
            onStyleChange={(s) => setStyle("services.sectionLabel", s)}
          />
          <TextField
            label="العنوان الرئيسي"
            path="services.title"
            value={data.services.title}
            onChange={(v) =>
              setData((d) => ({ ...d, services: { ...d.services, title: v } }))
            }
            styles={styleFor("services.title")}
            onStyleChange={(s) => setStyle("services.title", s)}
          />
          <RichTextField
            label="الوصف"
            path="services.subtitle"
            value={data.services.subtitle}
            onChange={(v) =>
              setData((d) => ({
                ...d,
                services: { ...d.services, subtitle: v },
              }))
            }
            toolbar="simple"
            styles={styleFor("services.subtitle")}
            onStyleChange={(s) => setStyle("services.subtitle", s)}
          />
        </SectionCard>

        <SectionCard
          title="الخدمات التفصيلية"
          subtitle="كل خدمة بتفاصيلها وميزاتها"
          icon={ListOrdered}
        >
          <div className="space-y-3">
            {data.services.detailed.map((svc, i) => (
              <div
                key={i}
                className="rounded-xl border border-admin-border bg-admin-bg/40 p-4 space-y-3"
              >
                <span className="text-xs font-bold text-admin-accent">
                  خدمة #{i + 1}
                </span>
                <TextField
                  label="العنوان"
                  path={`services.detailed.${i}.title`}
                  value={svc.title}
                  onChange={(v) =>
                    setData((d) => {
                      const next = [...d.services.detailed];
                      next[i] = { ...next[i], title: v };
                      return { ...d, services: { ...d.services, detailed: next } };
                    })
                  }
                  styles={styleFor(`services.detailed.${i}.title`)}
                  onStyleChange={(s) =>
                    setStyle(`services.detailed.${i}.title`, s)
                  }
                />
                <TextField
                  label="العنوان الفرعي (Tagline)"
                  path={`services.detailed.${i}.tagline`}
                  value={svc.tagline}
                  onChange={(v) =>
                    setData((d) => {
                      const next = [...d.services.detailed];
                      next[i] = { ...next[i], tagline: v };
                      return { ...d, services: { ...d.services, detailed: next } };
                    })
                  }
                  styles={styleFor(`services.detailed.${i}.tagline`)}
                  onStyleChange={(s) =>
                    setStyle(`services.detailed.${i}.tagline`, s)
                  }
                />
                <RichTextField
                  label="الوصف"
                  path={`services.detailed.${i}.description`}
                  value={svc.description}
                  onChange={(v) =>
                    setData((d) => {
                      const next = [...d.services.detailed];
                      next[i] = { ...next[i], description: v };
                      return { ...d, services: { ...d.services, detailed: next } };
                    })
                  }
                  toolbar="rich"
                  styles={styleFor(`services.detailed.${i}.description`)}
                  onStyleChange={(s) =>
                    setStyle(`services.detailed.${i}.description`, s)
                  }
                />
                <StringListField
                  label="المميزات"
                  path={`services.detailed.${i}.features`}
                  value={svc.features}
                  onChange={(v) =>
                    setData((d) => {
                      const next = [...d.services.detailed];
                      next[i] = { ...next[i], features: v };
                      return { ...d, services: { ...d.services, detailed: next } };
                    })
                  }
                />
                <div>
                  <label className="admin-label">الحالة</label>
                  <select
                    value={svc.status}
                    onChange={(e) =>
                      setData((d) => {
                        const next = [...d.services.detailed];
                        next[i] = { ...next[i], status: e.target.value };
                        return { ...d, services: { ...d.services, detailed: next } };
                      })
                    }
                    className="admin-input"
                  >
                    <option value="available">متاح الآن</option>
                    <option value="soon">قريباً</option>
                  </select>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard
          title="باقات الاشتراك"
          subtitle="الأسعار والخطط المتاحة"
          icon={DollarSign}
        >
          <TextField
            label="عنوان قسم الأسعار"
            path="services.pricing.title"
            value={data.services.pricing.title}
            onChange={(v) =>
              setData((d) => ({
                ...d,
                services: {
                  ...d.services,
                  pricing: { ...d.services.pricing, title: v },
                },
              }))
            }
            styles={styleFor("services.pricing.title")}
            onStyleChange={(s) => setStyle("services.pricing.title", s)}
          />
          <RichTextField
            label="وصف قسم الأسعار"
            path="services.pricing.subtitle"
            value={data.services.pricing.subtitle}
            onChange={(v) =>
              setData((d) => ({
                ...d,
                services: {
                  ...d.services,
                  pricing: { ...d.services.pricing, subtitle: v },
                },
              }))
            }
            toolbar="simple"
            styles={styleFor("services.pricing.subtitle")}
            onStyleChange={(s) => setStyle("services.pricing.subtitle", s)}
          />

          {PLAN_KEYS.map((key) => {
            const plan = data.services.pricing[key];
            return (
              <div
                key={key}
                className="rounded-xl border border-admin-border bg-admin-bg/40 p-4 space-y-3"
              >
                <h4 className="font-bold text-admin-text">{PLAN_LABELS[key]}</h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <TextField
                    label="اسم الباقة"
                    path={`services.pricing.${key}.name`}
                    value={plan.name}
                    onChange={(v) =>
                      setData((d) => ({
                        ...d,
                        services: {
                          ...d.services,
                          pricing: {
                            ...d.services.pricing,
                            [key]: { ...plan, name: v },
                          },
                        },
                      }))
                    }
                    styles={styleFor(`services.pricing.${key}.name`)}
                    onStyleChange={(s) =>
                      setStyle(`services.pricing.${key}.name`, s)
                    }
                  />
                  <TextField
                    label="نص قبل السعر (priceLabel)"
                    path={`services.pricing.${key}.priceLabel`}
                    value={plan.priceLabel}
                    onChange={(v) =>
                      setData((d) => ({
                        ...d,
                        services: {
                          ...d.services,
                          pricing: {
                            ...d.services.pricing,
                            [key]: { ...plan, priceLabel: v },
                          },
                        },
                      }))
                    }
                  />
                  <TextField
                    label="السعر (priceValue)"
                    path={`services.pricing.${key}.priceValue`}
                    value={plan.priceValue}
                    onChange={(v) =>
                      setData((d) => ({
                        ...d,
                        services: {
                          ...d.services,
                          pricing: {
                            ...d.services.pricing,
                            [key]: { ...plan, priceValue: v },
                          },
                        },
                      }))
                    }
                    styles={styleFor(`services.pricing.${key}.priceValue`)}
                    onStyleChange={(s) =>
                      setStyle(`services.pricing.${key}.priceValue`, s)
                    }
                  />
                  <TextField
                    label="الفترة (مثل: شهرياً)"
                    path={`services.pricing.${key}.period`}
                    value={plan.period}
                    onChange={(v) =>
                      setData((d) => ({
                        ...d,
                        services: {
                          ...d.services,
                          pricing: {
                            ...d.services.pricing,
                            [key]: { ...plan, period: v },
                          },
                        },
                      }))
                    }
                  />
                </div>

                <RichTextField
                  label="الوصف"
                  path={`services.pricing.${key}.description`}
                  value={plan.description}
                  onChange={(v) =>
                    setData((d) => ({
                      ...d,
                      services: {
                        ...d.services,
                        pricing: {
                          ...d.services.pricing,
                          [key]: { ...plan, description: v },
                        },
                      },
                    }))
                  }
                  toolbar="simple"
                />

                <StringListField
                  label="المميزات"
                  path={`services.pricing.${key}.features`}
                  value={plan.features}
                  onChange={(v) =>
                    setData((d) => ({
                      ...d,
                      services: {
                        ...d.services,
                        pricing: {
                          ...d.services.pricing,
                          [key]: { ...plan, features: v },
                        },
                      },
                    }))
                  }
                />

                <TextField
                  label="نص الزر"
                  path={`services.pricing.${key}.cta`}
                  value={plan.cta}
                  onChange={(v) =>
                    setData((d) => ({
                      ...d,
                      services: {
                        ...d.services,
                        pricing: {
                          ...d.services.pricing,
                          [key]: { ...plan, cta: v },
                        },
                      },
                    }))
                  }
                />

                {key === "pro" && (
                  <BoolField
                    label="باقة مميزة (الأكثر شعبية)"
                    description="إظهار شارة 'الأكثر شعبية' على الباقة"
                    path="services.pricing.pro.featured"
                    value={Boolean(
                      (data.services.pricing.pro as { featured?: boolean }).featured,
                    )}
                    onChange={(v) =>
                      setData((d) => ({
                        ...d,
                        services: {
                          ...d.services,
                          pricing: {
                            ...d.services.pricing,
                            pro: {
                              ...d.services.pricing.pro,
                              featured: v,
                            },
                          },
                        },
                      }))
                    }
                  />
                )}
              </div>
            );
          })}
        </SectionCard>
      </div>
    </div>
  );
}
