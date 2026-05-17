import { redirect } from "next/navigation";
import { getContentBundle } from "@/lib/content/service";
import { isValidLocale, type Locale } from "@/lib/i18n/config";
import { NavbarEditor } from "./navbar-editor";

export const dynamic = "force-dynamic";

export default async function NavbarPage({
  searchParams,
}: {
  searchParams: { locale?: string };
}) {
  const localeRaw = searchParams.locale ?? "ar";
  if (!isValidLocale(localeRaw)) redirect("/admin/global/navbar?locale=ar");
  const locale = localeRaw as Locale;
  const { data, styles } = await getContentBundle(locale);
  return <NavbarEditor locale={locale} initialData={data} initialStyles={styles} />;
}
