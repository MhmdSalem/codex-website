import Link from "next/link";
import { Home, Info, Briefcase, Mail, ArrowLeft } from "lucide-react";

const pages = [
  {
    href: "/admin/pages/home",
    title: "الصفحة الرئيسية",
    description: "Hero, الخدمات، الإحصائيات، كيف نعمل، لماذا نحن، CTA",
    icon: Home,
    accent: "from-blue-500 to-cyan-500",
  },
  {
    href: "/admin/pages/about",
    title: "من نحن",
    description: "قصة الشركة، الفقرات، القيم",
    icon: Info,
    accent: "from-purple-500 to-pink-500",
  },
  {
    href: "/admin/pages/services",
    title: "الخدمات",
    description: "قائمة الخدمات، التفاصيل، الأسعار، الباقات",
    icon: Briefcase,
    accent: "from-orange-500 to-red-500",
  },
  {
    href: "/admin/pages/contact",
    title: "تواصل معنا",
    description: "النموذج، البيانات المباشرة، خيارات التواصل",
    icon: Mail,
    accent: "from-green-500 to-emerald-500",
  },
];

export default function PagesIndexPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-admin-text">صفحات الموقع</h1>
        <p className="text-admin-muted mt-1">اختار صفحة لتعديل محتواها وتنسيقها.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {pages.map((p) => {
          const Icon = p.icon;
          return (
            <Link
              key={p.href}
              href={p.href}
              className="admin-card p-6 hover:border-admin-border-strong transition-all group relative overflow-hidden"
            >
              <div
                aria-hidden="true"
                className={`absolute -top-20 -right-20 w-40 h-40 rounded-full bg-gradient-to-br ${p.accent} opacity-10 blur-2xl group-hover:opacity-20 transition-opacity`}
              />
              <div className="relative">
                <div
                  className={`w-12 h-12 rounded-xl bg-gradient-to-br ${p.accent} grid place-items-center text-white shadow-md`}
                >
                  <Icon className="w-6 h-6" />
                </div>
                <h2 className="mt-4 text-lg font-bold text-admin-text">{p.title}</h2>
                <p className="text-sm text-admin-muted mt-1">{p.description}</p>
                <div className="mt-4 flex items-center gap-2 text-sm font-medium text-admin-accent group-hover:gap-3 transition-all">
                  <span>تعديل</span>
                  <ArrowLeft className="w-4 h-4" />
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
