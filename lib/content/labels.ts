/**
 * Friendly Arabic labels for known content paths.
 * Used by the dynamic content editor to make forms readable.
 * If a path is not listed here, the editor falls back to the raw key.
 */
export const FIELD_LABELS: Record<string, string> = {
  // Meta
  "meta": "إعدادات SEO وميتا",
  "meta.title": "عنوان الصفحة (Title)",
  "meta.description": "وصف الصفحة (Description)",
  "meta.keywords": "الكلمات المفتاحية",

  // Nav
  "nav": "شريط التنقل",
  "nav.home": "الرئيسية",
  "nav.services": "الخدمات",
  "nav.about": "من نحن",
  "nav.contact": "اتصل بنا",
  "nav.cta": "زر الـ CTA",

  // Hero
  "hero": "القسم الرئيسي (Hero)",
  "hero.badge": "البادج العلوي",
  "hero.eyebrow": "عنوان فرعي صغير",
  "hero.titleStart": "بداية العنوان",
  "hero.titleHighlight": "الكلمة المميزة بالعنوان",
  "hero.titleEnd": "نهاية العنوان",
  "hero.subtitle": "الوصف تحت العنوان",
  "hero.ctaPrimary": "زر الإجراء الرئيسي",
  "hero.ctaSecondary": "زر الإجراء الثانوي",
  "hero.scrollHint": "نص التمرير للأسفل",
  "hero.marquee": "كلمات الشريط المتحرك",
  "hero.stats": "إحصائيات الـ Hero",
  "hero.stats.systems": "اسم: الأنظمة",
  "hero.stats.systemsValue": "قيمة: الأنظمة",
  "hero.stats.clients": "اسم: العملاء",
  "hero.stats.clientsValue": "قيمة: العملاء",
  "hero.stats.uptime": "اسم: وقت التشغيل",
  "hero.stats.uptimeValue": "قيمة: وقت التشغيل",

  // Services Preview
  "servicesPreview": "ملخص الخدمات (الصفحة الرئيسية)",
  "servicesPreview.sectionLabel": "تسمية القسم",
  "servicesPreview.title": "عنوان القسم",
  "servicesPreview.subtitle": "وصف القسم",
  "servicesPreview.items": "قائمة الخدمات",
  "servicesPreview.items.title": "اسم الخدمة",
  "servicesPreview.items.description": "وصف الخدمة",
  "servicesPreview.items.badge": "حالة الخدمة (متاح/قريباً)",
  "servicesPreview.viewAll": "زر عرض الكل",

  // Why Us
  "whyUs": "قسم لماذا نحن",
  "whyUs.sectionLabel": "تسمية القسم",
  "whyUs.title": "العنوان",
  "whyUs.subtitle": "الوصف",
  "whyUs.items": "ميزاتنا",
  "whyUs.items.title": "عنوان الميزة",
  "whyUs.items.description": "وصف الميزة",

  // CTA
  "cta": "بانر الدعوة للإجراء",
  "cta.title": "العنوان",
  "cta.subtitle": "الوصف",
  "cta.primary": "الزر الرئيسي",
  "cta.secondary": "الزر الثانوي",

  // Process
  "process": "خطوات العمل",
  "process.sectionLabel": "تسمية القسم",
  "process.title": "العنوان",
  "process.subtitle": "الوصف",
  "process.steps": "الخطوات",
  "process.steps.number": "رقم الخطوة",
  "process.steps.title": "عنوان الخطوة",
  "process.steps.description": "وصف الخطوة",

  // Big Stats
  "bigStats": "الأرقام الكبيرة",
  "bigStats.sectionLabel": "تسمية القسم",
  "bigStats.title": "العنوان",
  "bigStats.subtitle": "الوصف",
  "bigStats.items": "الأرقام",
  "bigStats.items.value": "الرقم",
  "bigStats.items.suffix": "اللاحقة (مثل +، %)",
  "bigStats.items.label": "التسمية",

  // About
  "about": "صفحة من نحن",
  "about.sectionLabel": "تسمية القسم",
  "about.title": "العنوان",
  "about.paragraphs": "فقرات التعريف",
  "about.values": "قيمنا",
  "about.values.title": "عنوان القيم",
  "about.values.items": "القيم",
  "about.values.items.title": "اسم القيمة",
  "about.values.items.description": "وصف القيمة",

  // Services (full)
  "services": "صفحة الخدمات",
  "services.sectionLabel": "تسمية القسم",
  "services.title": "العنوان",
  "services.subtitle": "الوصف",
  "services.detailed": "تفاصيل الخدمات",
  "services.detailed.title": "اسم الخدمة",
  "services.detailed.tagline": "العنوان الفرعي",
  "services.detailed.description": "الوصف",
  "services.detailed.features": "المميزات",
  "services.detailed.status": "الحالة (available / soon)",
  "services.pricing": "خطط الأسعار",
  "services.pricing.title": "عنوان الأسعار",
  "services.pricing.subtitle": "وصف الأسعار",
  "services.pricing.starter": "خطة Starter",
  "services.pricing.pro": "خطة Pro",
  "services.pricing.enterprise": "خطة Enterprise",
  "services.pricing.starter.name": "اسم الخطة",
  "services.pricing.starter.priceLabel": "مقدمة السعر",
  "services.pricing.starter.priceValue": "السعر",
  "services.pricing.starter.period": "الفترة",
  "services.pricing.starter.description": "الوصف",
  "services.pricing.starter.features": "المميزات",
  "services.pricing.starter.cta": "نص الزر",
  "services.pricing.pro.name": "اسم الخطة",
  "services.pricing.pro.priceLabel": "مقدمة السعر",
  "services.pricing.pro.priceValue": "السعر",
  "services.pricing.pro.period": "الفترة",
  "services.pricing.pro.description": "الوصف",
  "services.pricing.pro.features": "المميزات",
  "services.pricing.pro.cta": "نص الزر",
  "services.pricing.pro.featured": "خطة مميزة؟",
  "services.pricing.enterprise.name": "اسم الخطة",
  "services.pricing.enterprise.priceLabel": "مقدمة السعر",
  "services.pricing.enterprise.priceValue": "السعر",
  "services.pricing.enterprise.period": "الفترة",
  "services.pricing.enterprise.description": "الوصف",
  "services.pricing.enterprise.features": "المميزات",
  "services.pricing.enterprise.cta": "نص الزر",

  // Contact
  "contact": "صفحة التواصل",
  "contact.sectionLabel": "تسمية القسم",
  "contact.title": "العنوان",
  "contact.subtitle": "الوصف",
  "contact.form": "نموذج التواصل",
  "contact.form.name": "تسمية: الاسم",
  "contact.form.namePlaceholder": "Placeholder: الاسم",
  "contact.form.email": "تسمية: البريد",
  "contact.form.emailPlaceholder": "Placeholder: البريد",
  "contact.form.phone": "تسمية: الموبايل",
  "contact.form.phonePlaceholder": "Placeholder: الموبايل",
  "contact.form.company": "تسمية: الشركة",
  "contact.form.companyPlaceholder": "Placeholder: الشركة",
  "contact.form.service": "تسمية: الخدمة",
  "contact.form.serviceOptions": "خيارات الخدمات",
  "contact.form.serviceOptions.registration": "خيار: التسجيل",
  "contact.form.serviceOptions.workshops": "خيار: ورش العمل",
  "contact.form.serviceOptions.forms": "خيار: النماذج",
  "contact.form.serviceOptions.marketing": "خيار: التسويق",
  "contact.form.serviceOptions.other": "خيار: أخرى",
  "contact.form.message": "تسمية: الرسالة",
  "contact.form.messagePlaceholder": "Placeholder: الرسالة",
  "contact.form.submit": "زر الإرسال",
  "contact.form.submitting": "نص أثناء الإرسال",
  "contact.form.success": "رسالة نجاح",
  "contact.form.error": "رسالة خطأ",
  "contact.direct": "وسائل التواصل المباشرة",
  "contact.direct.title": "العنوان",
  "contact.direct.email": "تسمية: البريد",
  "contact.direct.phone": "تسمية: التليفون",
  "contact.direct.whatsapp": "تسمية: واتساب",
  "contact.direct.location": "تسمية: الموقع",
  "contact.direct.locationValue": "نص الموقع",

  "contact.info": "بيانات التواصل الفعلية",
  "contact.info.email": "البريد الإلكتروني",
  "contact.info.phone": "رقم التليفون",
  "contact.info.whatsapp": "رقم واتساب",

  // Footer
  "footer": "الفوتر",
  "footer.tagline": "العبارة التعريفية",
  "footer.nav": "روابط الموقع",
  "footer.nav.title": "عنوان القائمة",
  "footer.nav.home": "الرئيسية",
  "footer.nav.services": "الخدمات",
  "footer.nav.about": "من نحن",
  "footer.nav.contact": "اتصل بنا",
  "footer.services": "روابط الخدمات",
  "footer.services.title": "عنوان القائمة",
  "footer.services.registration": "التسجيل",
  "footer.services.workshops": "ورش العمل",
  "footer.services.forms": "النماذج",
  "footer.services.marketing": "التسويق",
  "footer.contact": "روابط التواصل",
  "footer.contact.title": "العنوان",
  "footer.legal": "نصوص قانونية",
  "footer.legal.rights": "حقوق الملكية",
  "footer.legal.privacy": "سياسة الخصوصية",
  "footer.legal.terms": "الشروط والأحكام",
  "footer.madeIn": "صُنع بإتقان",

  // Common
  "common": "نصوص مشتركة",
  "common.learnMore": "اعرف أكثر",
  "common.getStarted": "ابدأ الآن",
  "common.contactUs": "تواصل معنا",
  "common.available": "متاح الآن",
  "common.soon": "قريباً",
};

/**
 * Returns a friendly label for a path. Falls back to the last segment.
 * Path uses dot notation, with [n] for arrays. We strip the indexes when looking up
 * so that "hero.marquee[0]" reuses "hero.marquee" if a leaf label exists,
 * otherwise we display the raw last segment.
 */
export function labelFor(path: string): string {
  if (FIELD_LABELS[path]) return FIELD_LABELS[path];
  const stripped = path.replace(/\[\d+\]/g, "");
  if (FIELD_LABELS[stripped]) return FIELD_LABELS[stripped];
  // segment-level fallback
  const segs = stripped.split(".");
  const last = segs[segs.length - 1];
  return last;
}

/**
 * Friendly title for top-level sections (used in tabs).
 */
export const SECTION_ORDER: Array<{ key: string; label: string }> = [
  { key: "hero", label: "Hero — البطل" },
  { key: "servicesPreview", label: "ملخص الخدمات" },
  { key: "bigStats", label: "أرقام كبيرة" },
  { key: "process", label: "كيف نعمل" },
  { key: "whyUs", label: "لماذا نحن" },
  { key: "cta", label: "بانر CTA" },
  { key: "services", label: "صفحة الخدمات" },
  { key: "about", label: "صفحة من نحن" },
  { key: "contact", label: "صفحة التواصل" },
  { key: "footer", label: "الفوتر" },
  { key: "nav", label: "شريط التنقل" },
  { key: "common", label: "نصوص مشتركة" },
  { key: "meta", label: "SEO وميتا" },
];
