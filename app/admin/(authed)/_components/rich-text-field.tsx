"use client";

import { useEffect, useRef } from "react";
import { useQuill } from "react-quilljs";
import { TextCursor, Eye, EyeOff, Plus, Trash2, GripVertical } from "lucide-react";
import { useState } from "react";
import "quill/dist/quill.snow.css";
import { StyleControls } from "./style-controls";
import type { StyleOverride } from "@/lib/content/style-types";

const EMPTY = "<p><br></p>";

type Props = {
  label: string;
  description?: string;
  path: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  /** Toolbar preset. "rich" = full toolbar, "simple" = bold/italic/lists, "minimal" = bold/italic only */
  toolbar?: "rich" | "simple" | "minimal" | "none";
  styles?: StyleOverride;
  onStyleChange?: (next: StyleOverride) => void;
  disableStyle?: boolean;
  /** Min height in pixels. Default 160. */
  minHeight?: number;
};

const TOOLBARS: Record<NonNullable<Props["toolbar"]>, unknown> = {
  rich: [
    [{ header: [false, 2, 3, 4] }],
    ["bold", "italic", "underline", "strike"],
    [{ list: "ordered" }, { list: "bullet" }],
    [{ align: [] }],
    ["blockquote"],
    ["link"],
    ["clean"],
  ],
  simple: [
    ["bold", "italic", "underline"],
    [{ list: "ordered" }, { list: "bullet" }],
    ["link", "clean"],
  ],
  minimal: [["bold", "italic"], ["clean"]],
  none: false,
};

export function RichTextField({
  label,
  description,
  path,
  value,
  onChange,
  placeholder,
  toolbar = "simple",
  styles,
  onStyleChange,
  disableStyle = false,
  minHeight = 160,
}: Props) {
  const [showPath, setShowPath] = useState(false);
  const lastPropValue = useRef(value);
  const initialised = useRef(false);

  const { quill, quillRef } = useQuill({
    placeholder,
    modules: { toolbar: TOOLBARS[toolbar] },
    formats: [
      "header",
      "bold",
      "italic",
      "underline",
      "strike",
      "list",
      "bullet",
      "align",
      "blockquote",
      "link",
    ],
    theme: "snow",
  });

  // First-mount: paste the initial HTML value, then wire up text-change.
  useEffect(() => {
    if (!quill || initialised.current) return;
    initialised.current = true;

    const initial = value || "";
    if (initial) {
      quill.clipboard.dangerouslyPasteHTML(0, initial, "silent");
      quill.setSelection(0, 0, "silent");
    }
    lastPropValue.current = initial;

    const handler = () => {
      const html = quill.root.innerHTML;
      const next = html === EMPTY ? "" : html;
      lastPropValue.current = next;
      onChange(next);
    };

    quill.on("text-change", handler);
    return () => {
      quill.off("text-change", handler);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quill]);

  // External value changes (e.g. reset/locale switch) — repopulate without
  // looping back to onChange.
  useEffect(() => {
    if (!quill || !initialised.current) return;
    if ((value || "") === lastPropValue.current) return;

    lastPropValue.current = value || "";
    quill.clipboard.dangerouslyPasteHTML(0, value || "", "silent");
  }, [value, quill]);

  return (
    <div className="space-y-1.5">
      <div className="flex items-start justify-between gap-2">
        <label className="text-sm font-medium text-admin-text flex items-center gap-2">
          <TextCursor className="w-3.5 h-3.5 text-admin-muted" />
          <span>{label}</span>
          <span className="text-[10px] uppercase tracking-wider text-admin-accent/80 bg-admin-accent-soft px-1.5 py-0.5 rounded">
            Rich Text
          </span>
        </label>
        <button
          type="button"
          onClick={() => setShowPath((v) => !v)}
          className="text-[10px] text-admin-subtle hover:text-admin-muted"
          title={showPath ? "إخفاء المسار" : "إظهار المسار التقني"}
        >
          {showPath ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
        </button>
      </div>
      {description && (
        <p className="text-xs text-admin-muted -mt-0.5">{description}</p>
      )}
      {showPath && (
        <p className="text-[10px] font-mono text-admin-subtle bg-admin-bg/40 px-2 py-1 rounded">
          {path}
        </p>
      )}

      <div className="rich-editor-shell" data-toolbar={toolbar}>
        <div ref={quillRef} style={{ minHeight }} />
      </div>

      {!disableStyle && styles !== undefined && onStyleChange && (
        <div className="mt-2">
          <StyleControls value={styles} onChange={onStyleChange} />
        </div>
      )}
    </div>
  );
}

/* ───────── Rich Text List (paragraphs editor) ───────── */
type ListProps = {
  label: string;
  description?: string;
  path: string;
  value: string[];
  onChange: (v: string[]) => void;
  toolbar?: "rich" | "simple" | "minimal" | "none";
  /** Style override applied to ALL paragraphs in the list (single key). */
  styles?: StyleOverride;
  onStyleChange?: (next: StyleOverride) => void;
};

export function RichTextListField({
  label,
  description,
  path,
  value,
  onChange,
  toolbar = "simple",
  styles,
  onStyleChange,
}: ListProps) {
  function update(i: number, v: string) {
    const next = [...value];
    next[i] = v;
    onChange(next);
  }
  function remove(i: number) {
    onChange(value.filter((_, idx) => idx !== i));
  }
  function add() {
    onChange([...value, ""]);
  }
  function move(from: number, to: number) {
    if (to < 0 || to >= value.length) return;
    const next = [...value];
    const [item] = next.splice(from, 1);
    next.splice(to, 0, item);
    onChange(next);
  }

  return (
    <div className="space-y-2.5">
      <div className="flex items-start justify-between gap-2">
        <div className="space-y-0.5">
          <label className="text-sm font-bold text-admin-text flex items-center gap-2">
            <TextCursor className="w-3.5 h-3.5 text-admin-muted" />
            <span>{label}</span>
            <span className="text-[10px] uppercase tracking-wider text-admin-accent/80 bg-admin-accent-soft px-1.5 py-0.5 rounded">
              {value.length} فقرة
            </span>
          </label>
          {description && (
            <p className="text-xs text-admin-muted">{description}</p>
          )}
        </div>
      </div>

      <div className="space-y-3">
        {value.map((paragraph, i) => (
          <div
            key={i}
            className="rounded-xl border border-admin-border bg-admin-bg/30 p-3 space-y-2 relative"
          >
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5">
                <GripVertical className="w-3.5 h-3.5 text-admin-subtle" />
                <span className="text-[11px] font-bold text-admin-accent">
                  فقرة {i + 1}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => move(i, i - 1)}
                  disabled={i === 0}
                  className="text-admin-muted hover:text-admin-text disabled:opacity-30 disabled:cursor-not-allowed text-xs px-1.5 py-1"
                  title="نقل لأعلى"
                >
                  ↑
                </button>
                <button
                  type="button"
                  onClick={() => move(i, i + 1)}
                  disabled={i === value.length - 1}
                  className="text-admin-muted hover:text-admin-text disabled:opacity-30 disabled:cursor-not-allowed text-xs px-1.5 py-1"
                  title="نقل لأسفل"
                >
                  ↓
                </button>
                <button
                  type="button"
                  onClick={() => remove(i)}
                  className="text-red-400 hover:text-red-300 px-1.5 py-1"
                  title="حذف الفقرة"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
            <ParagraphEditor
              value={paragraph}
              onChange={(v) => update(i, v)}
              toolbar={toolbar}
              path={`${path}.${i}`}
            />
          </div>
        ))}

        <button
          type="button"
          onClick={add}
          className="w-full rounded-xl border border-dashed border-admin-border hover:border-admin-accent/50 hover:bg-admin-accent-soft py-3 px-4 text-sm font-medium text-admin-muted hover:text-admin-accent transition-all flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4" />
          إضافة فقرة جديدة
        </button>
      </div>

      {styles !== undefined && onStyleChange && (
        <div className="mt-2">
          <p className="text-[11px] text-admin-subtle mb-1">
            تنسيق مشترك لكل الفقرات:
          </p>
          <StyleControls value={styles} onChange={onStyleChange} />
        </div>
      )}
    </div>
  );
}

/* Internal: a single paragraph editor without the wrapping label/path UI. */
function ParagraphEditor({
  value,
  onChange,
  toolbar,
  path,
}: {
  value: string;
  onChange: (v: string) => void;
  toolbar: NonNullable<Props["toolbar"]>;
  path: string;
}) {
  const lastPropValue = useRef(value);
  const initialised = useRef(false);

  const { quill, quillRef } = useQuill({
    modules: { toolbar: TOOLBARS[toolbar] },
    formats: [
      "header",
      "bold",
      "italic",
      "underline",
      "strike",
      "list",
      "bullet",
      "align",
      "blockquote",
      "link",
    ],
    theme: "snow",
  });

  useEffect(() => {
    if (!quill || initialised.current) return;
    initialised.current = true;

    if (value) {
      quill.clipboard.dangerouslyPasteHTML(0, value, "silent");
      quill.setSelection(0, 0, "silent");
    }
    lastPropValue.current = value;

    const handler = () => {
      const html = quill.root.innerHTML;
      const next = html === EMPTY ? "" : html;
      lastPropValue.current = next;
      onChange(next);
    };
    quill.on("text-change", handler);
    return () => {
      quill.off("text-change", handler);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quill]);

  useEffect(() => {
    if (!quill || !initialised.current) return;
    if ((value || "") === lastPropValue.current) return;
    lastPropValue.current = value || "";
    quill.clipboard.dangerouslyPasteHTML(0, value || "", "silent");
  }, [value, quill]);

  return (
    <div
      className="rich-editor-shell"
      data-toolbar={toolbar}
      data-path={path}
    >
      <div ref={quillRef} style={{ minHeight: 120 }} />
    </div>
  );
}
