import DOMPurify from "isomorphic-dompurify";
import { cn } from "@/lib/utils";

/**
 * Safely renders HTML produced by the admin Rich Text editor (Quill).
 * - Strips scripts, event handlers, and disallowed tags
 * - Falls back to plain text when the input has no HTML
 *
 * Two ways to use:
 *
 *   1. As a wrapping element:
 *      <RichText html={t.hero.subtitle} as="p" className="..." />
 *
 *   2. As props you spread into an existing element (e.g. framer-motion):
 *      <motion.p className="..." {...htmlProps(t.hero.subtitle)} />
 */
type Props = {
  html: string | undefined | null;
  /** Tag to wrap the output in. Defaults to <div>. Use "span" for inline. */
  as?: keyof JSX.IntrinsicElements;
  className?: string;
  /** When true, render the value as plain text (no HTML). */
  plain?: boolean;
};

const ALLOWED_TAGS = [
  "p",
  "br",
  "span",
  "strong",
  "em",
  "u",
  "s",
  "b",
  "i",
  "a",
  "ul",
  "ol",
  "li",
  "blockquote",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "code",
  "pre",
  "mark",
  "small",
  "sup",
  "sub",
];

const ALLOWED_ATTR = ["href", "target", "rel", "class", "style"];

function sanitize(html: string): string {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS,
    ALLOWED_ATTR,
    ALLOW_DATA_ATTR: false,
  });
}

function looksLikeHtml(value: string): boolean {
  return /<\/?[a-z][\s\S]*?>/i.test(value);
}

export function RichText({ html, as: Tag = "div", className, plain }: Props) {
  const value = (html ?? "").trim();

  if (!value) return null;

  if (plain || !looksLikeHtml(value)) {
    return <Tag className={cn("rich-text", className)}>{value}</Tag>;
  }

  const safe = sanitize(value);

  return (
    <Tag
      className={cn("rich-text", className)}
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: safe }}
    />
  );
}

/**
 * Returns props you can spread into an element to render the value safely.
 * - If the value is HTML-ish, returns `dangerouslySetInnerHTML`
 * - Otherwise, returns plain `children`
 *
 * Useful when you must keep an existing wrapper component (e.g. `motion.p`)
 * but still want to support rich-text content from the admin.
 */
export function htmlProps(value: string | null | undefined):
  | { children: React.ReactNode }
  | { dangerouslySetInnerHTML: { __html: string } } {
  const v = (value ?? "").trim();
  if (!v) return { children: null };
  if (looksLikeHtml(v)) {
    return { dangerouslySetInnerHTML: { __html: sanitize(v) } };
  }
  return { children: v };
}
