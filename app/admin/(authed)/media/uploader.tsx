"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, UploadCloud } from "lucide-react";

export function Uploader() {
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);

  async function uploadOne(file: File) {
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
    if (!res.ok) {
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      throw new Error(data.error ?? `HTTP ${res.status}`);
    }
  }

  async function handleFiles(list: FileList | null) {
    if (!list || list.length === 0) return;
    setBusy(true);
    setError(null);
    try {
      const files = Array.from(list);
      let i = 0;
      for (const f of files) {
        i += 1;
        setProgress(`جارٍ رفع ${i} من ${files.length}: ${f.name}`);
        await uploadOne(f);
      }
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "فشل الرفع");
    } finally {
      setBusy(false);
      setProgress(null);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setDragActive(true);
      }}
      onDragLeave={() => setDragActive(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragActive(false);
        if (busy) return;
        void handleFiles(e.dataTransfer.files);
      }}
      className={`admin-card p-8 border-dashed text-center transition-colors ${
        dragActive ? "border-admin-accent bg-admin-accent-soft" : ""
      }`}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/*,video/*"
        multiple
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />
      <div className="flex flex-col items-center gap-3">
        <div className="w-12 h-12 rounded-2xl bg-admin-accent-soft grid place-items-center">
          {busy ? (
            <Loader2 className="w-5 h-5 text-admin-accent animate-spin" />
          ) : (
            <UploadCloud className="w-6 h-6 text-admin-accent" />
          )}
        </div>
        <div>
          <h2 className="text-lg font-semibold text-admin-text">رفع ملفات جديدة</h2>
          <p className="text-sm text-admin-muted mt-1">
            اسحب وأفلت الملفات هنا، أو اضغط الزر لاختيار صور وفيديوهات.
          </p>
        </div>
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={busy}
          className="admin-btn-primary"
        >
          {busy ? "جارٍ الرفع..." : "اختر ملفات"}
        </button>
        <p className="text-xs text-admin-subtle">
          الصور حتى 10MB، الفيديوهات حتى 100MB.
        </p>
        {progress && <p className="text-xs text-admin-muted">{progress}</p>}
        {error && (
          <p className="text-xs text-red-400 bg-red-500/10 border border-red-500/30 rounded-lg px-3 py-1.5">
            {error}
          </p>
        )}
      </div>
    </div>
  );
}
