"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Section } from "@/components/ui/Section";
import { routes } from "@/i18n/routes";

/**
 * Route-level error boundary. Catches render and data errors below the
 * layout, so the header, footer and navigation survive the failure.
 */
export default function LocaleError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations("error");

  useEffect(() => {
    console.error("[route error]", error);
  }, [error]);

  return (
    <Section spacing="hero">
      <Container>
        <Eyebrow className="mb-8">{t("code")}</Eyebrow>
        <h1 className="max-w-[14ch] font-display text-display text-balance">{t("headline")}</h1>
        <p className="mt-8 max-w-[46ch] text-lead text-muted">{t("description")}</p>
        <div className="mt-12 flex flex-wrap gap-4">
          <Button onClick={reset}>{t("retry")}</Button>
          <Button href={routes.home} variant="outline">
            {t("home")}
          </Button>
        </div>
      </Container>
    </Section>
  );
}
