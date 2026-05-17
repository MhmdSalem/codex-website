import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { isValidLocale, type Locale } from "@/lib/i18n/config";
import { getContent } from "@/lib/content/service";
import { ContentEditor } from "./content-editor";

export const dynamic = "force-dynamic";

export default async function ContentEditorPage({
  params,
}: {
  params: { locale: string };
}) {
  if (!isValidLocale(params.locale)) notFound();
  const locale = params.locale as Locale;
  const data = await getContent(locale);

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <Link
            href="/admin/content"
            className="text-xs text-admin-muted hover:text-admin-accent inline-flex items-center gap-1"
          >
            <ArrowRight className="w-3 h-3" />
            عودة للغات
          </Link>
          <h1 className="text-2xl sm:text-3xl font-bold text-admin-text mt-1">
            تعديل محتوى الموقع — {locale === "ar" ? "العربية" : "English"}
          </h1>
          <p className="text-admin-muted mt-1 text-sm">
            عدّل النصوص، الصور والفيديوهات. التغييرات تظهر مباشرة على الموقع بعد الحفظ.
          </p>
        </div>
      </div>

      <ContentEditor locale={locale} initialData={data} />
    </div>
  );
}
