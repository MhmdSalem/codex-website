import Link from "next/link";
import { ArrowLeft, Languages } from "lucide-react";
import { connectToDatabase } from "@/lib/db/mongoose";
import { ContentModel } from "@/lib/db/models/content";

export const dynamic = "force-dynamic";

export default async function ContentIndexPage() {
  await connectToDatabase();
  const docs = await ContentModel.find().lean();
  const updatedMap = new Map(docs.map((d) => [d.locale, d.updatedAt]));

  const locales = [
    {
      code: "ar",
      name: "العربية",
      desc: "محتوى الموقع العربي (RTL)",
      flag: "🇪🇬",
    },
    {
      code: "en",
      name: "English",
      desc: "English website content (LTR)",
      flag: "🇬🇧",
    },
  ] as const;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-admin-text">إدارة المحتوى</h1>
        <p className="text-admin-muted mt-1 text-sm">
          اختر اللغة لتعديل النصوص، الصور والفيديوهات في الموقع.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {locales.map((l) => {
          const updated = updatedMap.get(l.code);
          return (
            <Link
              key={l.code}
              href={`/admin/content/${l.code}`}
              className="admin-card p-6 hover:border-admin-border-strong transition-colors group"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-admin-accent-soft grid place-items-center text-2xl">
                    {l.flag}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-admin-text">{l.name}</h2>
                    <p className="text-sm text-admin-muted">{l.desc}</p>
                  </div>
                </div>
                <ArrowLeft className="w-5 h-5 text-admin-subtle group-hover:text-admin-accent transition-colors mt-1" />
              </div>
              <div className="mt-6 pt-4 border-t border-admin-border flex items-center justify-between text-xs">
                <span className="text-admin-muted">
                  <Languages className="w-3 h-3 inline ml-1" />
                  محتوى متاح
                </span>
                <span className="text-admin-subtle">
                  {updated
                    ? `آخر تحديث: ${new Date(updated as Date).toLocaleString("ar-EG")}`
                    : "لم يُحفظ بعد"}
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
