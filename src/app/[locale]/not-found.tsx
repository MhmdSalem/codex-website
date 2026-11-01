"use client";

import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Section } from "@/components/ui/Section";
import { routes } from "@/i18n/routes";

/**
 * Localised 404.
 *
 * A Client Component for the same reason as `loading.tsx`: this file belongs
 * to every route in the segment, and resolving translations on the server
 * would force the entire segment to render dynamically.
 */
export default function NotFound() {
  const t = useTranslations("notFound");

  return (
    <Section spacing="hero">
      <Container>
        <Eyebrow className="mb-8">{t("code")}</Eyebrow>
        <h1 className="max-w-[14ch] font-display text-display text-balance">{t("headline")}</h1>
        <p className="mt-8 max-w-[46ch] text-lead text-muted">{t("description")}</p>
        <div className="mt-12">
          <Button href={routes.home} variant="outline">
            {t("cta")}
          </Button>
        </div>
      </Container>
    </Section>
  );
}
