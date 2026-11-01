import { useTranslations } from "next-intl";

/** First focusable element on every page — keyboard users skip the header. */
export function SkipLink() {
  const t = useTranslations("nav");

  return (
    <a href="#main" className="sr-only-focusable">
      {t("skipToContent")}
    </a>
  );
}
