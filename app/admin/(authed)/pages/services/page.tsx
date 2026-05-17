import { redirect } from "next/navigation";
import { getContentBundle } from "@/lib/content/service";
import { isValidLocale, type Locale } from "@/lib/i18n/config";
import { ServicesEditor } from "./services-editor";

export const dynamic = "force-dynamic";

export default async function ServicesPageEditor({
  searchParams,
}: {
  searchParams: { locale?: string };
}) {
  const localeRaw = searchParams.locale ?? "ar";
  if (!isValidLocale(localeRaw)) redirect("/admin/pages/services?locale=ar");
  const locale = localeRaw as Locale;
  const { data, styles } = await getContentBundle(locale);
  return <ServicesEditor locale={locale} initialData={data} initialStyles={styles} />;
}
