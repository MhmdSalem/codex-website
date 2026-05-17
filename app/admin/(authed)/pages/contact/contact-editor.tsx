"use client";

import { useState, useTransition, useMemo, useCallback } from "react";
import { Mail, FileText, Phone } from "lucide-react";
import { PageToolbar } from "../../_components/page-toolbar";
import { SectionCard } from "../../_components/section-card";
import { TextField } from "../../_components/field-editor";
import { saveContentAndStyles } from "../../_actions/content-actions";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/get-dictionary";
import type { ContentStyles, StyleOverride } from "@/lib/content/style-types";

type Props = {
  locale: Locale;
  initialData: Dictionary;
  initialStyles: ContentStyles;
};

export function ContactEditor({ locale, initialData, initialStyles }: Props) {
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

  function setForm<K extends keyof Dictionary["contact"]["form"]>(key: K, v: Dictionary["contact"]["form"][K]) {
    setData((d) => ({
      ...d,
      contact: { ...d.contact, form: { ...d.contact.form, [key]: v } },
    }));
  }

  function setServiceOption<K extends keyof Dictionary["contact"]["form"]["serviceOptions"]>(
    key: K,
    v: Dictionary["contact"]["form"]["serviceOptions"][K],
  ) {
    setData((d) => ({
      ...d,
      contact: {
        ...d.contact,
        form: {
          ...d.contact.form,
          serviceOptions: { ...d.contact.form.serviceOptions, [key]: v },
        },
      },
    }));
  }

  return (
    <div>
      <PageToolbar
        title="تواصل معنا"
        subtitle={locale === "ar" ? "النسخة العربية" : "English version"}
        locale={locale}
        basePath="/admin/pages/contact"
        previewHref={`/${locale}/contact`}
        isDirty={isDirty}
        isSaving={pending}
        onSave={handleSave}
        onReset={() => {
          setData(initialData);
          setStyles(initialStyles);
        }}
      />

      <div className="space-y-4 max-w-4xl">
        <SectionCard title="رأس الصفحة" icon={Mail}>
          <TextField
            label="عنوان القسم"
            path="contact.sectionLabel"
            value={data.contact.sectionLabel}
            onChange={(v) =>
              setData((d) => ({
                ...d,
                contact: { ...d.contact, sectionLabel: v },
              }))
            }
            styles={styleFor("contact.sectionLabel")}
            onStyleChange={(s) => setStyle("contact.sectionLabel", s)}
          />
          <TextField
            label="العنوان الرئيسي"
            path="contact.title"
            value={data.contact.title}
            onChange={(v) =>
              setData((d) => ({ ...d, contact: { ...d.contact, title: v } }))
            }
            styles={styleFor("contact.title")}
            onStyleChange={(s) => setStyle("contact.title", s)}
          />
          <TextField
            label="الوصف"
            multiline
            path="contact.subtitle"
            value={data.contact.subtitle}
            onChange={(v) =>
              setData((d) => ({ ...d, contact: { ...d.contact, subtitle: v } }))
            }
            styles={styleFor("contact.subtitle")}
            onStyleChange={(s) => setStyle("contact.subtitle", s)}
          />
        </SectionCard>

        <SectionCard
          title="نموذج التواصل"
          subtitle="نصوص الحقول والأزرار"
          icon={FileText}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <TextField
              label="الاسم"
              path="contact.form.name"
              value={data.contact.form.name}
              onChange={(v) => setForm("name", v)}
            />
            <TextField
              label="placeholder الاسم"
              path="contact.form.namePlaceholder"
              value={data.contact.form.namePlaceholder}
              onChange={(v) => setForm("namePlaceholder", v)}
            />
            <TextField
              label="البريد"
              path="contact.form.email"
              value={data.contact.form.email}
              onChange={(v) => setForm("email", v)}
            />
            <TextField
              label="placeholder البريد"
              path="contact.form.emailPlaceholder"
              value={data.contact.form.emailPlaceholder}
              onChange={(v) => setForm("emailPlaceholder", v)}
            />
            <TextField
              label="التليفون"
              path="contact.form.phone"
              value={data.contact.form.phone}
              onChange={(v) => setForm("phone", v)}
            />
            <TextField
              label="placeholder التليفون"
              path="contact.form.phonePlaceholder"
              value={data.contact.form.phonePlaceholder}
              onChange={(v) => setForm("phonePlaceholder", v)}
            />
            <TextField
              label="الشركة"
              path="contact.form.company"
              value={data.contact.form.company}
              onChange={(v) => setForm("company", v)}
            />
            <TextField
              label="placeholder الشركة"
              path="contact.form.companyPlaceholder"
              value={data.contact.form.companyPlaceholder}
              onChange={(v) => setForm("companyPlaceholder", v)}
            />
            <TextField
              label="الخدمة"
              path="contact.form.service"
              value={data.contact.form.service}
              onChange={(v) => setForm("service", v)}
            />
            <TextField
              label="الرسالة"
              path="contact.form.message"
              value={data.contact.form.message}
              onChange={(v) => setForm("message", v)}
            />
            <TextField
              label="placeholder الرسالة"
              path="contact.form.messagePlaceholder"
              value={data.contact.form.messagePlaceholder}
              onChange={(v) => setForm("messagePlaceholder", v)}
            />
            <TextField
              label="زر الإرسال"
              path="contact.form.submit"
              value={data.contact.form.submit}
              onChange={(v) => setForm("submit", v)}
            />
            <TextField
              label="نص أثناء الإرسال"
              path="contact.form.submitting"
              value={data.contact.form.submitting}
              onChange={(v) => setForm("submitting", v)}
            />
            <TextField
              label="رسالة النجاح"
              path="contact.form.success"
              value={data.contact.form.success}
              onChange={(v) => setForm("success", v)}
            />
            <TextField
              label="رسالة الخطأ"
              path="contact.form.error"
              value={data.contact.form.error}
              onChange={(v) => setForm("error", v)}
            />
          </div>

          <div className="mt-4 space-y-3">
            <h4 className="text-sm font-bold text-admin-text">خيارات الخدمة في الـ dropdown</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <TextField
                label="نظام التسجيل"
                path="contact.form.serviceOptions.registration"
                value={data.contact.form.serviceOptions.registration}
                onChange={(v) => setServiceOption("registration", v)}
              />
              <TextField
                label="إدارة الورش"
                path="contact.form.serviceOptions.workshops"
                value={data.contact.form.serviceOptions.workshops}
                onChange={(v) => setServiceOption("workshops", v)}
              />
              <TextField
                label="النماذج"
                path="contact.form.serviceOptions.forms"
                value={data.contact.form.serviceOptions.forms}
                onChange={(v) => setServiceOption("forms", v)}
              />
              <TextField
                label="التسويق"
                path="contact.form.serviceOptions.marketing"
                value={data.contact.form.serviceOptions.marketing}
                onChange={(v) => setServiceOption("marketing", v)}
              />
              <TextField
                label="استشارة أخرى"
                path="contact.form.serviceOptions.other"
                value={data.contact.form.serviceOptions.other}
                onChange={(v) => setServiceOption("other", v)}
              />
            </div>
          </div>
        </SectionCard>

        <SectionCard title="التواصل المباشر" icon={Phone}>
          <TextField
            label="عنوان قسم التواصل المباشر"
            path="contact.direct.title"
            value={data.contact.direct.title}
            onChange={(v) =>
              setData((d) => ({
                ...d,
                contact: {
                  ...d.contact,
                  direct: { ...d.contact.direct, title: v },
                },
              }))
            }
            styles={styleFor("contact.direct.title")}
            onStyleChange={(s) => setStyle("contact.direct.title", s)}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <TextField
              label="تسمية البريد"
              path="contact.direct.email"
              value={data.contact.direct.email}
              onChange={(v) =>
                setData((d) => ({
                  ...d,
                  contact: {
                    ...d.contact,
                    direct: { ...d.contact.direct, email: v },
                  },
                }))
              }
            />
            <TextField
              label="تسمية التليفون"
              path="contact.direct.phone"
              value={data.contact.direct.phone}
              onChange={(v) =>
                setData((d) => ({
                  ...d,
                  contact: {
                    ...d.contact,
                    direct: { ...d.contact.direct, phone: v },
                  },
                }))
              }
            />
            <TextField
              label="تسمية واتساب"
              path="contact.direct.whatsapp"
              value={data.contact.direct.whatsapp}
              onChange={(v) =>
                setData((d) => ({
                  ...d,
                  contact: {
                    ...d.contact,
                    direct: { ...d.contact.direct, whatsapp: v },
                  },
                }))
              }
            />
            <TextField
              label="تسمية الموقع"
              path="contact.direct.location"
              value={data.contact.direct.location}
              onChange={(v) =>
                setData((d) => ({
                  ...d,
                  contact: {
                    ...d.contact,
                    direct: { ...d.contact.direct, location: v },
                  },
                }))
              }
            />
            <TextField
              label="قيمة الموقع"
              path="contact.direct.locationValue"
              value={data.contact.direct.locationValue}
              onChange={(v) =>
                setData((d) => ({
                  ...d,
                  contact: {
                    ...d.contact,
                    direct: { ...d.contact.direct, locationValue: v },
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
