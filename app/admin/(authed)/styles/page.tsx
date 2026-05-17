import { redirect } from "next/navigation";
import { getContentBundle } from "@/lib/content/service";
import { isValidLocale, type Locale } from "@/lib/i18n/config";
import { StylesOverview } from "./styles-overview";

export const dynamic = "force-dynamic";

export default async function StylesPage({
  searchParams,
}: {
  searchParams: { locale?: string };
}) {
  const localeRaw = searchParams.locale ?? "ar";
  if (!isValidLocale(localeRaw)) redirect("/admin/styles?locale=ar");
  const locale = localeRaw as Locale;
  const { styles } = await getContentBundle(locale);
  return <StylesOverview locale={locale} initialStyles={styles} />;
}
