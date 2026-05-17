/**
 * Style override system: each content path can have a per-locale style override
 * (color, font, size, weight, etc.). Overrides are stored as a flat map
 * { "hero.titleStart": { color: "#d97757", fontSize: "5rem", ... } } and
 * injected as CSS rules at the root of the locale layout.
 */

export type FontFamilyKey = "sans" | "display" | "arabic" | "mono" | "custom";

export type StyleOverride = {
  color?: string;
  fontSize?: string;
  fontFamily?: FontFamilyKey;
  customFont?: string;
  fontWeight?: string;
  letterSpacing?: string;
  lineHeight?: string;
  textTransform?: "none" | "uppercase" | "lowercase" | "capitalize";
  fontStyle?: "normal" | "italic";
  textDecoration?: "none" | "underline" | "line-through";
  textAlign?: "start" | "center" | "end" | "justify";
};

export type ContentStyles = Record<string, StyleOverride>;

/* ──────────── Presets ──────────── */

export const FONT_FAMILY_OPTIONS: { value: FontFamilyKey; label: string; sample: string; cssVar: string }[] = [
  { value: "sans", label: "Sans (الافتراضي)", sample: "AaBb أبج", cssVar: "var(--font-inter), var(--font-arabic), system-ui" },
  { value: "display", label: "Display (للعناوين)", sample: "Display أبج", cssVar: "var(--font-display), serif" },
  { value: "arabic", label: "Arabic (Cairo)", sample: "أهلاً بكم", cssVar: "var(--font-arabic), system-ui" },
  { value: "mono", label: "Monospace", sample: "Code 123", cssVar: "ui-monospace, SFMono-Regular, Menlo, monospace" },
];

export const FONT_SIZE_PRESETS: { value: string; label: string }[] = [
  { value: "0.75rem", label: "12px (XS)" },
  { value: "0.875rem", label: "14px (SM)" },
  { value: "1rem", label: "16px (Base)" },
  { value: "1.125rem", label: "18px (LG)" },
  { value: "1.25rem", label: "20px (XL)" },
  { value: "1.5rem", label: "24px (2XL)" },
  { value: "1.875rem", label: "30px (3XL)" },
  { value: "2.25rem", label: "36px (4XL)" },
  { value: "3rem", label: "48px (5XL)" },
  { value: "3.75rem", label: "60px (6XL)" },
  { value: "4.5rem", label: "72px (7XL)" },
  { value: "6rem", label: "96px (8XL)" },
  { value: "8rem", label: "128px (9XL)" },
];

export const FONT_WEIGHT_OPTIONS: { value: string; label: string }[] = [
  { value: "300", label: "Light (300)" },
  { value: "400", label: "Regular (400)" },
  { value: "500", label: "Medium (500)" },
  { value: "600", label: "SemiBold (600)" },
  { value: "700", label: "Bold (700)" },
  { value: "800", label: "ExtraBold (800)" },
  { value: "900", label: "Black (900)" },
];

export const COLOR_PRESETS: { value: string; label: string }[] = [
  { value: "#e8e6df", label: "Foreground" },
  { value: "#d97757", label: "Brand Gold" },
  { value: "#9b9aa6", label: "Muted" },
  { value: "#22c55e", label: "Success" },
  { value: "#ef4444", label: "Danger" },
  { value: "#3b82f6", label: "Blue" },
  { value: "#a855f7", label: "Purple" },
  { value: "#fb923c", label: "Orange" },
  { value: "#facc15", label: "Yellow" },
  { value: "#ffffff", label: "White" },
  { value: "#000000", label: "Black" },
];

/* ──────────── Helpers ──────────── */

export function pathToClassName(path: string): string {
  return `cp-${path.replace(/[^a-zA-Z0-9_]/g, "_")}`;
}

export function styleOverrideToCss(style: StyleOverride): string {
  const rules: string[] = [];

  if (style.color) rules.push(`color: ${style.color} !important`);
  if (style.fontSize) rules.push(`font-size: ${style.fontSize} !important`);

  if (style.fontFamily) {
    if (style.fontFamily === "custom" && style.customFont) {
      rules.push(`font-family: ${style.customFont} !important`);
    } else {
      const opt = FONT_FAMILY_OPTIONS.find((o) => o.value === style.fontFamily);
      if (opt) rules.push(`font-family: ${opt.cssVar} !important`);
    }
  }

  if (style.fontWeight) rules.push(`font-weight: ${style.fontWeight} !important`);
  if (style.letterSpacing) rules.push(`letter-spacing: ${style.letterSpacing} !important`);
  if (style.lineHeight) rules.push(`line-height: ${style.lineHeight} !important`);
  if (style.textTransform) rules.push(`text-transform: ${style.textTransform} !important`);
  if (style.fontStyle) rules.push(`font-style: ${style.fontStyle} !important`);
  if (style.textDecoration) rules.push(`text-decoration: ${style.textDecoration} !important`);
  if (style.textAlign) rules.push(`text-align: ${style.textAlign} !important`);

  return rules.join("; ");
}

export function generateStylesheet(styles: ContentStyles | null | undefined): string {
  if (!styles) return "";
  const blocks: string[] = [];

  for (const [path, style] of Object.entries(styles)) {
    if (!style || Object.keys(style).length === 0) continue;
    const css = styleOverrideToCss(style);
    if (!css) continue;
    const cls = pathToClassName(path);
    blocks.push(`.${cls}, [data-cp="${path}"] { ${css} }`);
  }

  return blocks.join("\n");
}

export function isStyleEmpty(style: StyleOverride | undefined | null): boolean {
  if (!style) return true;
  return Object.values(style).every((v) => v === undefined || v === null || v === "");
}
