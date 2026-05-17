import { redirect } from "next/navigation";
import { getContentBundle } from "@/lib/content/service";
import { isValidLocale, type Locale } from "@/lib/i18n/config";
import { MetaEditor } from "./meta-editor";

export const dynamic = "force-dynamic";

export default async function MetaPage({
  searchParams,
}: {
  searchParams: { locale?: string };
}) {
  const localeRaw = searchParams.locale ?? "ar";
  if (!isValidLocale(localeRaw)) redirect("/admin/global/meta?locale=ar");
  const locale = localeRaw as Locale;
  const { data, styles } = await getContentBundle(locale);
  return <MetaEditor locale={locale} initialData={data} initialStyles={styles} />;
}
