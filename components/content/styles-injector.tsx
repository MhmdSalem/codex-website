import { generateStylesheet, type ContentStyles } from "@/lib/content/style-types";

/**
 * Injects content style overrides as a single <style> tag.
 * Place this inside <body> (or <head>) of the locale layout so the rules
 * cascade onto sections that opt-in via class `cp-<path>` or attribute
 * `data-cp="<path>"`.
 */
export function StylesInjector({ styles }: { styles: ContentStyles | null | undefined }) {
  const css = generateStylesheet(styles);
  if (!css) return null;
  return (
    <style
      data-codex-content-styles=""
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: css }}
    />
  );
}
