"use client";

import { useState, useTransition } from "react";
import { Copy, Check, Trash2, Search, FileVideo, ImageIcon } from "lucide-react";
import { deleteMediaAction, updateMediaAltAction } from "./actions";

export type MediaItem = {
  id: string;
  url: string;
  type: "image" | "video" | "other";
  mimeType: string;
  filename: string;
  originalName: string;
  size: number;
  alt: string;
  createdAt: string;
};

export function MediaGrid({ initialItems }: { initialItems: MediaItem[] }) {
  const [filter, setFilter] = useState<"all" | "image" | "video">("all");
  const [search, setSearch] = useState("");
  const [items, setItems] = useState(initialItems);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  const filtered = items.filter((m) => {
    if (filter !== "all" && m.type !== filter) return false;
    if (search && !`${m.originalName} ${m.alt}`.toLowerCase().includes(search.toLowerCase()))
      return false;
    return true;
  });

  function copy(url: string, id: string) {
    void navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  }

  function onDelete(id: string) {
    if (!confirm("متأكد إنك عاوز تحذف الملف ده؟")) return;
    startTransition(async () => {
      const fd = new FormData();
      fd.append("id", id);
      await deleteMediaAction(fd);
      setItems((prev) => prev.filter((m) => m.id !== id));
    });
  }

  function onUpdateAlt(id: string, alt: string) {
    startTransition(async () => {
      const fd = new FormData();
      fd.append("id", id);
      fd.append("alt", alt);
      await updateMediaAltAction(fd);
      setItems((prev) => prev.map((m) => (m.id === id ? { ...m, alt } : m)));
    });
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-admin-subtle" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="ابحث بالاسم أو الوصف..."
            className="admin-input pr-10"
          />
        </div>
        <div className="inline-flex bg-admin-surface border border-admin-border rounded-lg p-1">
          {(["all", "image", "video"] as const).map((k) => (
            <button
              key={k}
              type="button"
              onClick={() => setFilter(k)}
              className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                filter === k
                  ? "bg-admin-accent text-white"
                  : "text-admin-muted hover:text-admin-text"
              }`}
            >
              {k === "all" ? "الكل" : k === "image" ? "صور" : "فيديوهات"}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="admin-card p-12 text-center text-admin-muted">
          <p>لا توجد ملفات.</p>
          <p className="text-xs mt-1 text-admin-subtle">ارفع صورة أو فيديو من الأعلى للبدء.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
          {filtered.map((m) => (
            <div key={m.id} className="admin-card overflow-hidden group">
              <div className="aspect-square relative bg-admin-bg overflow-hidden">
                {m.type === "image" ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={m.url}
                    alt={m.alt || m.originalName}
                    className="w-full h-full object-cover"
                  />
                ) : m.type === "video" ? (
                  <video
                    src={m.url}
                    className="w-full h-full object-cover"
                    muted
                    playsInline
                  />
                ) : (
                  <div className="w-full h-full grid place-items-center text-admin-subtle">
                    <FileVideo className="w-10 h-10" />
                  </div>
                )}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-end justify-center gap-2 p-2 opacity-0 group-hover:opacity-100">
                  <button
                    type="button"
                    onClick={() => copy(m.url, m.id)}
                    className="p-2 rounded-md bg-admin-bg/80 backdrop-blur text-admin-text hover:text-admin-accent"
                    aria-label="نسخ الرابط"
                  >
                    {copiedId === m.id ? (
                      <Check className="w-4 h-4 text-green-400" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => onDelete(m.id)}
                    className="p-2 rounded-md bg-admin-bg/80 backdrop-blur text-red-400 hover:text-red-300"
                    aria-label="حذف"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <span className="absolute top-2 right-2 text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-admin-bg/80 backdrop-blur text-admin-text">
                  {m.type === "image" ? (
                    <ImageIcon className="w-3 h-3 inline" />
                  ) : (
                    <FileVideo className="w-3 h-3 inline" />
                  )}
                </span>
              </div>
              <div className="p-2 space-y-1.5">
                <input
                  type="text"
                  defaultValue={m.alt}
                  placeholder="نص بديل (alt)"
                  onBlur={(e) => {
                    if (e.target.value !== m.alt) onUpdateAlt(m.id, e.target.value);
                  }}
                  className="w-full text-xs bg-admin-bg border border-admin-border rounded px-2 py-1 text-admin-text placeholder:text-admin-subtle focus:outline-none focus:border-admin-accent"
                />
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] text-admin-subtle truncate" dir="ltr">
                    {m.originalName}
                  </span>
                  <span className="text-[10px] text-admin-subtle whitespace-nowrap">
                    {formatSize(m.size)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}
