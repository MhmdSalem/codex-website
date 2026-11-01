import { redirect } from "@/i18n/navigation";
import { routes } from "@/i18n/routes";
import type { Locale } from "@/i18n/routing";

interface PageProps {
  params: Promise<{ locale: Locale }>;
}

/**
 * Pricing is no longer a page: every price is quoted in a conversation. Old
 * links and bookmarks land on Contact instead of a 404. The previous page is
 * in the git history if it is ever wanted back.
 */
export default async function PricingPage({ params }: PageProps) {
  const { locale } = await params;
  redirect({ href: routes.contact, locale });
}
