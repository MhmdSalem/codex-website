import { redirect } from "next/navigation";

export default function LocaleContentRedirect({
  params,
}: {
  params: { locale: string };
}) {
  redirect(`/admin/pages?locale=${params.locale}`);
}
