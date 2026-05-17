"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import {
  Mail,
  MailOpen,
  Trash2,
  Archive,
  Phone,
  Building2,
  Tag,
} from "lucide-react";
import {
  archiveAction,
  deleteMessageAction,
  toggleReadAction,
} from "./actions";

type Msg = {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  service: string;
  message: string;
  locale: string;
  read: boolean;
  archived: boolean;
  createdAt: string;
};

export function MessagesList({
  messages,
  tab,
  counts,
}: {
  messages: Msg[];
  tab: "inbox" | "archived";
  counts: { inbox: number; archived: number };
}) {
  const [openId, setOpenId] = useState<string | null>(null);
  const [, startTransition] = useTransition();
  const [items, setItems] = useState(messages);

  function toggleRead(m: Msg) {
    const next = !m.read;
    setItems((prev) => prev.map((x) => (x.id === m.id ? { ...x, read: next } : x)));
    startTransition(async () => {
      const fd = new FormData();
      fd.append("id", m.id);
      fd.append("read", next ? "1" : "0");
      await toggleReadAction(fd);
    });
  }

  function archive(m: Msg) {
    if (!confirm("نقل الرسالة للأرشيف؟")) return;
    setItems((prev) => prev.filter((x) => x.id !== m.id));
    startTransition(async () => {
      const fd = new FormData();
      fd.append("id", m.id);
      await archiveAction(fd);
    });
  }

  function del(m: Msg) {
    if (!confirm("حذف الرسالة نهائياً؟")) return;
    setItems((prev) => prev.filter((x) => x.id !== m.id));
    startTransition(async () => {
      const fd = new FormData();
      fd.append("id", m.id);
      await deleteMessageAction(fd);
    });
  }

  return (
    <>
      <div className="inline-flex bg-admin-surface border border-admin-border rounded-lg p-1">
        <Link
          href="?tab=inbox"
          className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
            tab === "inbox"
              ? "bg-admin-accent text-white"
              : "text-admin-muted hover:text-admin-text"
          }`}
        >
          الواردة ({counts.inbox})
        </Link>
        <Link
          href="?tab=archived"
          className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
            tab === "archived"
              ? "bg-admin-accent text-white"
              : "text-admin-muted hover:text-admin-text"
          }`}
        >
          المؤرشفة ({counts.archived})
        </Link>
      </div>

      {items.length === 0 ? (
        <div className="admin-card p-12 text-center text-admin-muted mt-4">
          {tab === "inbox" ? "لا توجد رسائل جديدة." : "لا توجد رسائل مؤرشفة."}
        </div>
      ) : (
        <div className="admin-card divide-y divide-admin-border mt-4 overflow-hidden">
          {items.map((m) => {
            const open = openId === m.id;
            return (
              <div key={m.id} className={open ? "bg-admin-surface-2" : ""}>
                <button
                  type="button"
                  onClick={() => {
                    setOpenId(open ? null : m.id);
                    if (!open && !m.read) toggleRead(m);
                  }}
                  className="w-full text-right p-4 flex items-start gap-3 hover:bg-admin-surface-2 transition-colors"
                >
                  <span
                    className={`mt-1 w-2 h-2 rounded-full ${
                      m.read ? "bg-admin-border" : "bg-admin-accent"
                    }`}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-medium text-admin-text">{m.name}</span>
                      <span className="text-xs text-admin-subtle" dir="ltr">
                        {m.email}
                      </span>
                      {m.service && (
                        <span className="text-[10px] uppercase px-1.5 py-0.5 rounded bg-admin-surface border border-admin-border text-admin-muted">
                          {m.service}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-admin-muted mt-1 line-clamp-1">
                      {m.message}
                    </p>
                  </div>
                  <span className="text-xs text-admin-subtle whitespace-nowrap shrink-0">
                    {new Date(m.createdAt).toLocaleDateString("ar-EG")}
                  </span>
                </button>
                {open && (
                  <div className="px-4 pb-4 space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                      <Detail icon={Mail} label="البريد" value={m.email} dir="ltr" />
                      {m.phone && (
                        <Detail icon={Phone} label="الموبايل" value={m.phone} dir="ltr" />
                      )}
                      {m.company && (
                        <Detail icon={Building2} label="الشركة" value={m.company} />
                      )}
                      {m.service && (
                        <Detail icon={Tag} label="الخدمة" value={m.service} />
                      )}
                    </div>
                    <div>
                      <div className="text-xs text-admin-muted mb-1">الرسالة</div>
                      <p className="bg-admin-bg border border-admin-border rounded-lg p-4 text-admin-text whitespace-pre-line text-sm">
                        {m.message}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <a
                        href={`mailto:${m.email}`}
                        className="admin-btn-secondary"
                      >
                        رد بالإيميل
                      </a>
                      <button
                        type="button"
                        onClick={() => toggleRead(m)}
                        className="admin-btn-ghost"
                      >
                        {m.read ? (
                          <>
                            <Mail className="w-4 h-4" />
                            <span>وسم كغير مقروء</span>
                          </>
                        ) : (
                          <>
                            <MailOpen className="w-4 h-4" />
                            <span>وسم كمقروء</span>
                          </>
                        )}
                      </button>
                      {!m.archived && (
                        <button
                          type="button"
                          onClick={() => archive(m)}
                          className="admin-btn-ghost"
                        >
                          <Archive className="w-4 h-4" />
                          <span>أرشفة</span>
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => del(m)}
                        className="admin-btn-danger"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span>حذف</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}

function Detail({
  icon: Icon,
  label,
  value,
  dir,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  dir?: "ltr" | "rtl";
}) {
  return (
    <div className="flex items-start gap-2">
      <Icon className="w-4 h-4 text-admin-muted mt-0.5 shrink-0" />
      <div className="min-w-0">
        <div className="text-xs text-admin-muted">{label}</div>
        <div className="text-admin-text break-words" dir={dir}>
          {value}
        </div>
      </div>
    </div>
  );
}
