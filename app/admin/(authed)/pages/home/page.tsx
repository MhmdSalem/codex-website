import { redirect } from "next/navigation";
import { getContentBundle } from "@/lib/content/service";
import { isValidLocale, type Locale } from "@/lib/i18n/config";
import { HomeEditor } from "./home-editor";

export const dynamic = "force-dynamic";

export default async function HomePageEditor({
  searchParams,
}: {
  searchParams: { locale?: string };
}) {
  const localeRaw = searchParams.locale ?? "ar";
  if (!isValidLocale(localeRaw)) redirect("/admin/pages/home?locale=ar");
  const locale = localeRaw as Locale;

  const { data, styles } = await getContentBundle(locale);

  return <HomeEditor locale={locale} initialData={data} initialStyles={styles} />;
}
