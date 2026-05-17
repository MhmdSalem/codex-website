"use client";

import { Plus, Trash2, ImagePlus } from "lucide-react";
import type { Locale } from "@/lib/i18n/config";
import { labelFor } from "@/lib/content/labels";

type Props = {
  path: string;
  value: unknown;
  label: string;
  locale: Locale;
  onChange: (value: unknown) => void;
  onPickMedia: (cb: (url: string) => void) => void;
};

export function ValueEditor(props: Props) {
  const { value } = props;
  if (value === null || value === undefined) return <NullField {...props} />;
  if (typeof value === "string") return <StringField {...props} value={value} />;
  if (typeof value === "number") return <NumberField {...props} value={value} />;
  if (typeof value === "boolean") return <BooleanField {...props} value={value} />;
  if (Array.isArray(value)) return <ArrayField {...props} value={value} />;
  if (typeof value === "object") return <ObjectField {...props} value={value as Record<string, unknown>} />;
  return null;
}

function NullField({ label }: Props) {
  return (
    <div>
      <span className="admin-label">{label}</span>
      <p className="text-xs text-admin-subtle">قيمة فارغة</p>
    </div>
  );
}

function StringField({
  value,
  onChange,
  label,
  path,
  onPickMedia,
}: Props & { value: string }) {
  const isMediaPath = isLikelyMediaField(path);
  const useTextarea = value.length > 80 || value.includes("\n");
  const dir = /[\u0600-\u06FF]/.test(value) ? "rtl" : "ltr";

  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <label className="text-sm font-medium text-admin-muted">{label}</label>
        <code className="text-[10px] text-admin-subtle">{path}</code>
      </div>
      {useTextarea ? (
        <textarea
          dir={dir}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="admin-input"
          rows={Math.min(8, Math.max(3, value.split("\n").length + 1))}
        />
      ) : (
        <div className="flex gap-2">
          <input
            type="text"
            dir={dir}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="admin-input"
          />
          {isMediaPath && (
            <button
              type="button"
              onClick={() => onPickMedia((url) => onChange(url))}
              className="admin-btn-secondary shrink-0"
              title="اختر من المكتبة"
            >
              <ImagePlus className="w-4 h-4" />
              <span className="hidden sm:inline">من المكتبة</span>
            </button>
          )}
        </div>
      )}
      {isMediaPath && /^\/?(uploads|public)/i.test(value) && (
        <MediaPreview url={value} />
      )}
    </div>
  );
}

function NumberField({
  value,
  onChange,
  label,
  path,
}: Props & { value: number }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <label className="text-sm font-medium text-admin-muted">{label}</label>
        <code className="text-[10px] text-admin-subtle">{path}</code>
      </div>
      <input
        type="number"
        value={Number.isFinite(value) ? value : 0}
        onChange={(e) => {
          const n = Number(e.target.value);
          onChange(Number.isFinite(n) ? n : 0);
        }}
        className="admin-input"
      />
    </div>
  );
}

function BooleanField({
  value,
  onChange,
  label,
  path,
}: Props & { value: boolean }) {
  return (
    <label className="flex items-center justify-between gap-3 cursor-pointer p-3 rounded-lg bg-admin-surface-2 border border-admin-border">
      <div>
        <div className="text-sm font-medium text-admin-text">{label}</div>
        <code className="text-[10px] text-admin-subtle">{path}</code>
      </div>
      <input
        type="checkbox"
        checked={value}
        onChange={(e) => onChange(e.target.checked)}
        className="w-5 h-5 accent-[var(--admin-accent)]"
      />
    </label>
  );
}

function ArrayField({
  value,
  onChange,
  label,
  path,
  locale,
  onPickMedia,
}: Props & { value: unknown[] }) {
  const allStrings = value.every((v) => typeof v === "string");
  const allObjects = value.every(
    (v) => v && typeof v === "object" && !Array.isArray(v),
  );

  function addItem() {
    if (allStrings) onChange([...value, ""]);
    else if (allObjects && value.length > 0) {
      const template = makeTemplate(value[0] as Record<string, unknown>);
      onChange([...value, template]);
    } else if (value.length === 0) {
      onChange([""]);
    } else {
      onChange([...value, null]);
    }
  }

  function removeItem(idx: number) {
    onChange(value.filter((_, i) => i !== idx));
  }

  function updateItem(idx: number, v: unknown) {
    onChange(value.map((it, i) => (i === idx ? v : it)));
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-sm font-medium text-admin-text">{label}</span>
          <span className="text-xs text-admin-subtle mr-2">
            ({value.length} عنصر)
          </span>
        </div>
        <button
          type="button"
          onClick={addItem}
          className="admin-btn-ghost text-admin-accent"
        >
          <Plus className="w-4 h-4" /> إضافة
        </button>
      </div>

      <div className="space-y-3 pr-3 border-r-2 border-admin-border">
        {value.map((item, idx) => {
          const itemPath = `${path}[${idx}]`;
          return (
            <div
              key={idx}
              className="bg-admin-surface-2 border border-admin-border rounded-lg p-3 space-y-2 relative"
            >
              <div className="flex items-center justify-between text-xs text-admin-subtle">
                <span>عنصر #{idx + 1}</span>
                <button
                  type="button"
                  onClick={() => removeItem(idx)}
                  className="text-red-400 hover:text-red-300 inline-flex items-center gap-1"
                  aria-label="حذف"
                >
                  <Trash2 className="w-3.5 h-3.5" /> حذف
                </button>
              </div>
              <ValueEditor
                path={itemPath}
                value={item}
                onChange={(v) => updateItem(idx, v)}
                onPickMedia={onPickMedia}
                label={`#${idx + 1}`}
                locale={locale}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ObjectField({
  value,
  onChange,
  path,
  locale,
  onPickMedia,
}: Props & { value: Record<string, unknown> }) {
  const keys = Object.keys(value);
  return (
    <div className="space-y-4">
      {keys.map((k) => {
        const childPath = path ? `${path}.${k}` : k;
        return (
          <ValueEditor
            key={k}
            path={childPath}
            value={value[k]}
            onChange={(v) => onChange({ ...value, [k]: v })}
            onPickMedia={onPickMedia}
            label={labelFor(childPath)}
            locale={locale}
          />
        );
      })}
    </div>
  );
}

function MediaPreview({ url }: { url: string }) {
  const isVideo = /\.(mp4|webm|ogv|mov)$/i.test(url);
  return (
    <div className="mt-2 rounded-lg overflow-hidden border border-admin-border bg-admin-surface-2 max-w-xs">
      {isVideo ? (
        <video src={url} controls className="w-full" />
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={url} alt="" className="w-full" />
      )}
    </div>
  );
}

function isLikelyMediaField(path: string) {
  const last = path.split(".").pop()?.replace(/\[\d+\]/g, "") ?? "";
  return /image|img|photo|picture|video|cover|thumbnail|logo|icon|media|src|url/i.test(
    last,
  );
}

function makeTemplate(sample: Record<string, unknown>): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(sample)) {
    if (typeof v === "string") out[k] = "";
    else if (typeof v === "number") out[k] = 0;
    else if (typeof v === "boolean") out[k] = false;
    else if (Array.isArray(v)) out[k] = [];
    else if (v && typeof v === "object") out[k] = makeTemplate(v as Record<string, unknown>);
    else out[k] = null;
  }
  return out;
}
