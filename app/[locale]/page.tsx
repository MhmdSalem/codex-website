import { notFound } from "next/navigation";
import { Hero } from "@/components/sections/hero";
import { ServicesPreview } from "@/components/sections/services-preview";
import { BigStats } from "@/components/sections/big-stats";
import { Process } from "@/components/sections/process";
import { WhyUs } from "@/components/sections/why-us";
import { CtaBanner } from "@/components/sections/cta-banner";
import { isValidLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";

export default async function HomePage({ params }: { params: { locale: string } }) {
  if (!isValidLocale(params.locale)) notFound();
  const locale = params.locale as Locale;
  const dict = await getDictionary(locale);

  return (
    <>
      <Hero locale={locale} dict={dict} />
      <ServicesPreview locale={locale} dict={dict} />
      <BigStats dict={dict} />
      <Process dict={dict} />
      <WhyUs dict={dict} />
      <CtaBanner locale={locale} dict={dict} />
    </>
  );
}
