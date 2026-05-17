"use client";

import { useEffect, useState } from "react";
import { X, Search, Loader2, FileVideo, ImageIcon } from "lucide-react";
import type { MediaItem } from "../../media/media-grid";

export function MediaPicker({
  onPick,
  onClose,
}: {
  onPick: (url: string) => void;
  onClose: () => void;
}) {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "image" | "video">("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    void fetch("/api/admin/media")
      .then((r) => r.json())
      .then((d: { items: MediaItem[] }) => setItems(d.items ?? []))
      .finally(() => setLoading(false));
  }, []);

  const filtered = items.filter((m) => {
    if (filter !== "all" && m.type !== filter) return false;
    if (
      search &&
      !`${m.originalName} ${m.alt}`.toLowerCase().includes(search.toLowerCase())
    )
      return false;
    return true;
  });

  return (
    <div
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm grid place-items-center p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-admin-bg border border-admin-border rounded-2xl w-full max-w-5xl max-h-[85vh] flex flex-col overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-admin-border">
          <h2 className="text-lg font-bold text-admin-text">اختر من المكتبة</h2>
          <button
            type="button"
            onClick={onClose}
            className="admin-btn-ghost"
            aria-label="إغلاق"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-4 border-b border-admin-border flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-admin-subtle" />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="ابحث..."
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
        <div className="flex-1 overflow-y-auto p-4">
          {loading ? (
            <div className="grid place-items-center py-12">
              <Loader2 className="w-6 h-6 text-admin-accent animate-spin" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center text-admin-muted py-12">
              <p>لا توجد ملفات.</p>
              <p className="text-xs mt-1 text-admin-subtle">
                ارفع الملفات أولاً من صفحة "مكتبة الوسائط".
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-3">
              {filtered.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => onPick(m.url)}
                  className="admin-card overflow-hidden hover:border-admin-accent transition-colors text-right"
                >
                  <div className="aspect-square bg-admin-bg relative">
                    {m.type === "image" ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={m.url}
                        alt={m.alt || m.originalName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full grid place-items-center text-admin-subtle">
                        <FileVideo className="w-8 h-8" />
                      </div>
                    )}
                    <span className="absolute top-1 right-1 text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-admin-bg/80 backdrop-blur text-admin-text">
                      {m.type === "image" ? (
                        <ImageIcon className="w-3 h-3 inline" />
                      ) : (
                        <FileVideo className="w-3 h-3 inline" />
                      )}
                    </span>
                  </div>
                  <div className="p-1.5">
                    <p className="text-[10px] text-admin-text truncate" dir="ltr">
                      {m.originalName}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
