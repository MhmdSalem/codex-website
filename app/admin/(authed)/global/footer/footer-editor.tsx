"use client";

import { useState, useTransition, useMemo, useCallback } from "react";
import { Footprints, Link2, Layers } from "lucide-react";
import { PageToolbar } from "../../_components/page-toolbar";
import { SectionCard } from "../../_components/section-card";
import { TextField } from "../../_components/field-editor";
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

export function FooterEditor({ locale, initialData, initialStyles }: Props) {
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
      } catch {
        alert("فشل الحفظ.");
      }
    });
  }

  return (
    <div>
      <PageToolbar
        title="الفوتر"
        subtitle={locale === "ar" ? "النسخة العربية" : "English version"}
        locale={locale}
        basePath="/admin/global/footer"
        previewHref={`/${locale}`}
        isDirty={isDirty}
        isSaving={pending}
        onSave={handleSave}
        onReset={() => {
          setData(initialData);
          setStyles(initialStyles);
        }}
      />

      <div className="space-y-4 max-w-3xl">
        <SectionCard title="نص الترويسة" icon={Footprints}>
          <RichTextField
            label="الشعار/الوصف القصير (Tagline)"
            description="الجملة التعريفية اللي بتظهر تحت اللوجو في الفوتر"
            path="footer.tagline"
            value={data.footer.tagline}
            onChange={(v) =>
              setData((d) => ({ ...d, footer: { ...d.footer, tagline: v } }))
            }
            toolbar="simple"
            styles={styleFor("footer.tagline")}
            onStyleChange={(s) => setStyle("footer.tagline", s)}
          />
          <TextField
            label="نص الـ 'صُنع في'"
            path="footer.madeIn"
            value={data.footer.madeIn}
            onChange={(v) =>
              setData((d) => ({ ...d, footer: { ...d.footer, madeIn: v } }))
            }
            styles={styleFor("footer.madeIn")}
            onStyleChange={(s) => setStyle("footer.madeIn", s)}
          />
        </SectionCard>

        <SectionCard title="عمود روابط الموقع" icon={Link2}>
          <TextField
            label="عنوان العمود"
            path="footer.nav.title"
            value={data.footer.nav.title}
            onChange={(v) =>
              setData((d) => ({
                ...d,
                footer: { ...d.footer, nav: { ...d.footer.nav, title: v } },
              }))
            }
            styles={styleFor("footer.nav.title")}
            onStyleChange={(s) => setStyle("footer.nav.title", s)}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <TextField
              label="الرئيسية"
              path="footer.nav.home"
              value={data.footer.nav.home}
              onChange={(v) =>
                setData((d) => ({
                  ...d,
                  footer: { ...d.footer, nav: { ...d.footer.nav, home: v } },
                }))
              }
            />
            <TextField
              label="الخدمات"
              path="footer.nav.services"
              value={data.footer.nav.services}
              onChange={(v) =>
                setData((d) => ({
                  ...d,
                  footer: { ...d.footer, nav: { ...d.footer.nav, services: v } },
                }))
              }
            />
            <TextField
              label="من نحن"
              path="footer.nav.about"
              value={data.footer.nav.about}
              onChange={(v) =>
                setData((d) => ({
                  ...d,
                  footer: { ...d.footer, nav: { ...d.footer.nav, about: v } },
                }))
              }
            />
            <TextField
              label="اتصل بنا"
              path="footer.nav.contact"
              value={data.footer.nav.contact}
              onChange={(v) =>
                setData((d) => ({
                  ...d,
                  footer: { ...d.footer, nav: { ...d.footer.nav, contact: v } },
                }))
              }
            />
          </div>
        </SectionCard>

        <SectionCard title="عمود الخدمات" icon={Layers}>
          <TextField
            label="عنوان العمود"
            path="footer.services.title"
            value={data.footer.services.title}
            onChange={(v) =>
              setData((d) => ({
                ...d,
                footer: {
                  ...d.footer,
                  services: { ...d.footer.services, title: v },
                },
              }))
            }
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <TextField
              label="نظام التسجيل"
              path="footer.services.registration"
              value={data.footer.services.registration}
              onChange={(v) =>
                setData((d) => ({
                  ...d,
                  footer: {
                    ...d.footer,
                    services: { ...d.footer.services, registration: v },
                  },
                }))
              }
            />
            <TextField
              label="إدارة الورش"
              path="footer.services.workshops"
              value={data.footer.services.workshops}
              onChange={(v) =>
                setData((d) => ({
                  ...d,
                  footer: {
                    ...d.footer,
                    services: { ...d.footer.services, workshops: v },
                  },
                }))
              }
            />
            <TextField
              label="النماذج"
              path="footer.services.forms"
              value={data.footer.services.forms}
              onChange={(v) =>
                setData((d) => ({
                  ...d,
                  footer: {
                    ...d.footer,
                    services: { ...d.footer.services, forms: v },
                  },
                }))
              }
            />
            <TextField
              label="التسويق"
              path="footer.services.marketing"
              value={data.footer.services.marketing}
              onChange={(v) =>
                setData((d) => ({
                  ...d,
                  footer: {
                    ...d.footer,
                    services: { ...d.footer.services, marketing: v },
                  },
                }))
              }
            />
          </div>
        </SectionCard>

        <SectionCard title="عمود التواصل" icon={Footprints}>
          <TextField
            label="عنوان العمود"
            path="footer.contact.title"
            value={data.footer.contact.title}
            onChange={(v) =>
              setData((d) => ({
                ...d,
                footer: {
                  ...d.footer,
                  contact: { ...d.footer.contact, title: v },
                },
              }))
            }
          />
        </SectionCard>

        <SectionCard title="الـ Legal والحقوق" icon={Footprints}>
          <TextField
            label="جميع الحقوق محفوظة"
            path="footer.legal.rights"
            value={data.footer.legal.rights}
            onChange={(v) =>
              setData((d) => ({
                ...d,
                footer: {
                  ...d.footer,
                  legal: { ...d.footer.legal, rights: v },
                },
              }))
            }
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <TextField
              label="سياسة الخصوصية"
              path="footer.legal.privacy"
              value={data.footer.legal.privacy}
              onChange={(v) =>
                setData((d) => ({
                  ...d,
                  footer: {
                    ...d.footer,
                    legal: { ...d.footer.legal, privacy: v },
                  },
                }))
              }
            />
            <TextField
              label="الشروط والأحكام"
              path="footer.legal.terms"
              value={data.footer.legal.terms}
              onChange={(v) =>
                setData((d) => ({
                  ...d,
                  footer: {
                    ...d.footer,
                    legal: { ...d.footer.legal, terms: v },
                  },
                }))
              }
            />
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
