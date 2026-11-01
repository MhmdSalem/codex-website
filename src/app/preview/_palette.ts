/**
 * The extended palette, derived from the logo.
 *
 * The mark carries exactly two colours — warm off-white and terracotta on black
 * — which is why the live site has one accent and every section looks the same.
 * A second family is needed for sections to differ without inventing a brand
 * colour, so it is derived rather than picked: PETROL is the terracotta's
 * opposite (same tone, cooled), CLAY is the terracotta darkened almost to a
 * surface. Both stay in the logo's temperature.
 *
 * Local to the preview on purpose. Nothing here touches the live tokens until a
 * direction is chosen.
 */
export const LOGO = {
  bone: "#f5f3ee",
  terracotta: "#d77758",
} as const;

export const PALETTE = {
  /** Page base — the live black, unchanged. */
  black: "#000000",
  /** One step off the base, for a quiet band. */
  void: "#08080a",

  /** The cool counterweight: terracotta's complement, deepened to a surface. */
  petrolDeep: "#0c2429",
  petrol: "#123c43",
  petrolBright: "#5aa8a3",

  /** The warm surface: the accent itself, taken almost to black. */
  clayDeep: "#170f0c",
  clay: "#2a1a14",

  terracotta: "#d77758",
  terracottaBright: "#e89b80",
  terracottaDeep: "#b8542f",

  bone: "#ece9e2",
  fog: "#a9a9b4",
  ash: "#7c7c89",
  paper: "#f1eee7",
  ink: "#0e0e12",
} as const;

/** Hairline on dark, at the two weights the framing needs. */
export const LINE = {
  faint: "rgba(236,233,226,0.08)",
  base: "rgba(236,233,226,0.14)",
  strong: "rgba(236,233,226,0.26)",
} as const;

/**
 * The claims the site is allowed to make in a metrics strip.
 *
 * Every one is checkable against the site itself. No client counts, no years of
 * experience, no satisfaction percentage — a number nobody can verify costs
 * more trust than an empty space.
 */
export const FACTS = [
  { value: "٢", label: "منتجان نشغّلهما بأنفسنا" },
  { value: "٦", label: "خدمات هندسية" },
  { value: "٥٠٬٠٠٠ ج.م", label: "أسعارنا تبدأ من" },
  { value: "يوم عمل", label: "نرد خلال" },
] as const;

export const SERVICES = [
  { id: "webPlatforms", name: "منصات الويب", line: "لوحات تحكم وبوابات وأنظمة داخلية." },
  { id: "aiSolutions", name: "الذكاء الاصطناعي", line: "مساعدون وقراءة مستندات وأتمتة." },
  { id: "mobileApps", name: "تطبيقات الجوال", line: "iOS وأندرويد بخدمة خلفية واحدة." },
  { id: "dataAnalytics", name: "البيانات والتحليلات", line: "لوحات أرقام تُتخذ منها القرارات." },
  { id: "automation", name: "الأتمتة", line: "خطوات يدوية تصبح مساراً يعمل وحده." },
  { id: "integrations", name: "التكاملات", line: "الدفع والهوية والـ ERP تعمل معاً." },
] as const;
