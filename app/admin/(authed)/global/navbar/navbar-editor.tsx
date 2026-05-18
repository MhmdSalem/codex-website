"use client";

import { useState, useTransition, useMemo, useCallback } from "react";
import { Navigation } from "lucide-react";
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

export function NavbarEditor({ locale, initialData, initialStyles }: Props) {
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

  function setNav<K extends keyof Dictionary["nav"]>(k: K, v: Dictionary["nav"][K]) {
    setData((d) => ({ ...d, nav: { ...d.nav, [k]: v } }));
  }

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
        title="القائمة العلوية (Navbar)"
        subtitle={locale === "ar" ? "النسخة العربية" : "English version"}
        locale={locale}
        basePath="/admin/global/navbar"
        previewHref={`/${locale}`}
        isDirty={isDirty}
        isSaving={pending}
        onSave={handleSave}
        onReset={() => {
          setData(initialData);
          setStyles(initialStyles);
        }}
      />

      <div className="space-y-4 max-w-3xl mx-auto">
        <SectionCard title="روابط القائمة" icon={Navigation}>
          <TextField
            label="الرئيسية"
            path="nav.home"
            value={data.nav.home}
            onChange={(v) => setNav("home", v)}
            styles={styleFor("nav.home")}
            onStyleChange={(s) => setStyle("nav.home", s)}
          />
          <TextField
            label="الخدمات"
            path="nav.services"
            value={data.nav.services}
            onChange={(v) => setNav("services", v)}
            styles={styleFor("nav.services")}
            onStyleChange={(s) => setStyle("nav.services", s)}
          />
          <TextField
            label="من نحن"
            path="nav.about"
            value={data.nav.about}
            onChange={(v) => setNav("about", v)}
            styles={styleFor("nav.about")}
            onStyleChange={(s) => setStyle("nav.about", s)}
          />
          <TextField
            label="تواصل معنا"
            path="nav.contact"
            value={data.nav.contact}
            onChange={(v) => setNav("contact", v)}
            styles={styleFor("nav.contact")}
            onStyleChange={(s) => setStyle("nav.contact", s)}
          />
          <TextField
            label="زر CTA"
            description="الزر الذهبي على اليسار في القائمة"
            path="nav.cta"
            value={data.nav.cta}
            onChange={(v) => setNav("cta", v)}
            styles={styleFor("nav.cta")}
            onStyleChange={(s) => setStyle("nav.cta", s)}
          />
        </SectionCard>
      </div>
    </div>
  );
}
