import Link from "next/link";
import {
  FileText,
  Image as ImageIcon,
  MessagesSquare,
  Users,
  ArrowLeft,
} from "lucide-react";
import { connectToDatabase } from "@/lib/db/mongoose";
import { ContentModel } from "@/lib/db/models/content";
import { MediaModel } from "@/lib/db/models/media";
import { MessageModel } from "@/lib/db/models/message";
import { UserModel } from "@/lib/db/models/user";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  await connectToDatabase();

  const [contentCount, mediaCount, unreadMessages, totalMessages, usersCount] =
    await Promise.all([
      ContentModel.countDocuments(),
      MediaModel.countDocuments(),
      MessageModel.countDocuments({ read: false, archived: false }),
      MessageModel.countDocuments({ archived: false }),
      UserModel.countDocuments(),
    ]);

  const recentMessages = await MessageModel.find({ archived: false })
    .sort({ createdAt: -1 })
    .limit(5)
    .lean();

  const cards = [
    {
      label: "نسخ المحتوى",
      value: contentCount,
      icon: FileText,
      href: "/admin/content",
      hint: "عدد لغات المحتوى المُسجَّلة (ar / en)",
    },
    {
      label: "ملفات الوسائط",
      value: mediaCount,
      icon: ImageIcon,
      href: "/admin/media",
      hint: "إجمالي الصور والفيديوهات المرفوعة",
    },
    {
      label: "رسائل غير مقروءة",
      value: unreadMessages,
      total: totalMessages,
      icon: MessagesSquare,
      href: "/admin/messages",
      hint: `من إجمالي ${totalMessages} رسالة`,
      accent: unreadMessages > 0,
    },
    {
      label: "حسابات الإدارة",
      value: usersCount,
      icon: Users,
      href: "/admin/users",
      hint: "عدد الحسابات النشطة",
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-admin-text">نظرة عامة</h1>
        <p className="text-admin-muted mt-1">
          أهلاً بك في لوحة تحكم Codex. من هنا تقدر تتحكم في كل محتوى الموقع.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <Link
              key={card.label}
              href={card.href}
              className="admin-card p-5 hover:border-admin-border-strong transition-colors group"
            >
              <div className="flex items-start justify-between">
                <div
                  className={`w-10 h-10 rounded-lg grid place-items-center ${
                    card.accent ? "bg-admin-accent text-white" : "bg-admin-accent-soft text-admin-accent"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <ArrowLeft className="w-4 h-4 text-admin-subtle group-hover:text-admin-accent transition-colors" />
              </div>
              <div className="mt-4 text-3xl font-bold text-admin-text">{card.value}</div>
              <div className="text-sm text-admin-text mt-1">{card.label}</div>
              <div className="text-xs text-admin-subtle mt-2">{card.hint}</div>
            </Link>
          );
        })}
      </div>

      <div className="admin-card p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-admin-text">آخر الرسائل</h2>
          <Link href="/admin/messages" className="text-sm text-admin-accent hover:underline">
            عرض الكل
          </Link>
        </div>
        {recentMessages.length === 0 ? (
          <p className="text-admin-muted text-sm">لا توجد رسائل بعد.</p>
        ) : (
          <ul className="divide-y divide-admin-border">
            {recentMessages.map((m) => (
              <li
                key={String(m._id)}
                className="py-3 flex items-start justify-between gap-4"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-admin-text truncate">{m.name}</span>
                    {!m.read && (
                      <span className="text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-admin-accent text-white">
                        جديد
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-admin-muted truncate">{m.email}</div>
                  <p className="text-sm text-admin-text mt-1 line-clamp-1">{m.message}</p>
                </div>
                <span className="text-xs text-admin-subtle whitespace-nowrap">
                  {new Date(m.createdAt as Date).toLocaleDateString("ar-EG")}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="admin-card p-6">
        <h2 className="text-lg font-bold text-admin-text mb-2">إجراءات سريعة</h2>
        <p className="text-admin-muted text-sm mb-4">
          هتلاقي هنا أهم العمليات اللي ممكن تعملها بسرعة.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link href="/admin/content/ar" className="admin-btn-secondary">
            تعديل المحتوى العربي
          </Link>
          <Link href="/admin/content/en" className="admin-btn-secondary">
            Edit English Content
          </Link>
          <Link href="/admin/media" className="admin-btn-secondary">
            رفع صورة / فيديو
          </Link>
        </div>
      </div>
    </div>
  );
}
