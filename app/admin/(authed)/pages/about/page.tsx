import { redirect } from "next/navigation";
import { getContentBundle } from "@/lib/content/service";
import { isValidLocale, type Locale } from "@/lib/i18n/config";
import { AboutEditor } from "./about-editor";

export const dynamic = "force-dynamic";

export default async function AboutPageEditor({
  searchParams,
}: {
  searchParams: { locale?: string };
}) {
  const localeRaw = searchParams.locale ?? "ar";
  if (!isValidLocale(localeRaw)) redirect("/admin/pages/about?locale=ar");
  const locale = localeRaw as Locale;
  const { data, styles } = await getContentBundle(locale);
  return <AboutEditor locale={locale} initialData={data} initialStyles={styles} />;
}
