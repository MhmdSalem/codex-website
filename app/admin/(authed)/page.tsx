import Link from "next/link";
import {
  Home,
  Info,
  Briefcase,
  Mail,
  Image as ImageIcon,
  MessagesSquare,
  Users,
  ArrowLeft,
  Palette,
  Navigation,
  Footprints,
  Search,
  Sparkles,
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

  const stylesCount = await ContentModel.aggregate([
    { $project: { styleKeys: { $objectToArray: { $ifNull: ["$styles", {}] } } } },
    { $project: { count: { $size: "$styleKeys" } } },
    { $group: { _id: null, total: { $sum: "$count" } } },
  ]).then((r) => r[0]?.total ?? 0);

  const recentMessages = await MessageModel.find({ archived: false })
    .sort({ createdAt: -1 })
    .limit(5)
    .lean();

  const stats = [
    {
      label: "ملفات الوسائط",
      value: mediaCount,
      icon: ImageIcon,
      href: "/admin/media",
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      label: "رسائل غير مقروءة",
      value: unreadMessages,
      total: totalMessages,
      icon: MessagesSquare,
      href: "/admin/messages",
      gradient: "from-orange-500 to-red-500",
      pulse: unreadMessages > 0,
    },
    {
      label: "تنسيقات مخصّصة",
      value: stylesCount,
      icon: Palette,
      href: "/admin/styles",
      gradient: "from-purple-500 to-pink-500",
    },
    {
      label: "حسابات الإدارة",
      value: usersCount,
      icon: Users,
      href: "/admin/users",
      gradient: "from-green-500 to-emerald-500",
    },
  ];

  const pageLinks = [
    { href: "/admin/pages/home", label: "الرئيسية", icon: Home },
    { href: "/admin/pages/about", label: "من نحن", icon: Info },
    { href: "/admin/pages/services", label: "الخدمات", icon: Briefcase },
    { href: "/admin/pages/contact", label: "تواصل", icon: Mail },
  ];

  const globalLinks = [
    { href: "/admin/global/navbar", label: "القائمة العلوية", icon: Navigation },
    { href: "/admin/global/footer", label: "الفوتر", icon: Footprints },
    { href: "/admin/global/meta", label: "SEO", icon: Search },
  ];

  return (
    <div className="space-y-8">
      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-admin-surface via-admin-surface-2 to-admin-surface border border-admin-border p-8">
        <div
          aria-hidden="true"
          className="absolute -top-20 -left-20 w-60 h-60 rounded-full bg-admin-accent/20 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="absolute -bottom-20 -right-20 w-60 h-60 rounded-full bg-purple-500/10 blur-3xl"
        />
        <div className="relative">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-admin-accent-soft text-admin-accent text-xs font-medium mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>لوحة التحكم</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-admin-text">
            أهلاً بك في Codex Admin
          </h1>
          <p className="text-admin-muted mt-2 max-w-2xl">
            من هنا تتحكم في كل محتوى الموقع — النصوص، الصور، الألوان، الخطوط، والـ SEO.
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <Link
              key={s.label}
              href={s.href}
              className="admin-card p-5 hover:border-admin-border-strong transition-all group relative overflow-hidden"
            >
              <div
                aria-hidden="true"
                className={`absolute -top-10 -right-10 w-32 h-32 rounded-full bg-gradient-to-br ${s.gradient} opacity-10 blur-2xl group-hover:opacity-20 transition-opacity`}
              />
              <div className="relative">
                <div
                  className={`w-10 h-10 rounded-xl bg-gradient-to-br ${s.gradient} grid place-items-center text-white shadow-md ${
                    s.pulse ? "animate-pulse" : ""
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <div className="mt-4 text-3xl font-bold text-admin-text">
                  {s.value}
                </div>
                <div className="text-xs text-admin-muted mt-1">{s.label}</div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Quick: Pages */}
      <div>
        <h2 className="text-lg font-bold text-admin-text mb-3">صفحات الموقع</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {pageLinks.map((p) => {
            const Icon = p.icon;
            return (
              <Link
                key={p.href}
                href={p.href}
                className="admin-card p-4 flex items-center gap-3 hover:border-admin-border-strong transition-colors group"
              >
                <div className="w-10 h-10 rounded-lg bg-admin-accent-soft text-admin-accent grid place-items-center shrink-0 group-hover:scale-110 transition-transform">
                  <Icon className="w-5 h-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="font-medium text-admin-text truncate">
                    {p.label}
                  </div>
                  <div className="text-[10px] text-admin-subtle">تعديل</div>
                </div>
                <ArrowLeft className="w-4 h-4 text-admin-subtle group-hover:text-admin-accent transition-colors" />
              </Link>
            );
          })}
        </div>
      </div>

      {/* Quick: Global */}
      <div>
        <h2 className="text-lg font-bold text-admin-text mb-3">المحتوى العام</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {globalLinks.map((p) => {
            const Icon = p.icon;
            return (
              <Link
                key={p.href}
                href={p.href}
                className="admin-card p-4 flex items-center gap-3 hover:border-admin-border-strong transition-colors group"
              >
                <div className="w-10 h-10 rounded-lg bg-admin-surface-2 text-admin-muted grid place-items-center shrink-0 group-hover:bg-admin-accent-soft group-hover:text-admin-accent transition-colors">
                  <Icon className="w-5 h-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="font-medium text-admin-text truncate">
                    {p.label}
                  </div>
                </div>
                <ArrowLeft className="w-4 h-4 text-admin-subtle group-hover:text-admin-accent transition-colors" />
              </Link>
            );
          })}
        </div>
      </div>

      {/* Recent Messages */}
      <div className="admin-card p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-admin-text">آخر الرسائل</h2>
          <Link
            href="/admin/messages"
            className="text-sm text-admin-accent hover:underline"
          >
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
                    <span className="font-medium text-admin-text truncate">
                      {m.name}
                    </span>
                    {!m.read && (
                      <span className="text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-admin-accent text-white">
                        جديد
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-admin-muted truncate">{m.email}</div>
                  <p className="text-sm text-admin-text mt-1 line-clamp-1">
                    {m.message}
                  </p>
                </div>
                <span className="text-xs text-admin-subtle whitespace-nowrap">
                  {new Date(m.createdAt as Date).toLocaleDateString("ar-EG")}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
