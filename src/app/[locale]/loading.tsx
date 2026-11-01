"use client";

import { useTranslations } from "next-intl";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";

/**
 * Segment loading state.
 *
 * A Client Component on purpose. `loading.tsx` is part of every route's tree
 * and is rendered as a Suspense fallback before the layout body has run, so
 * resolving translations on the server here would fall back to reading request
 * headers — which opts every page in the segment out of static rendering.
 * Reading them from the client provider keeps the whole site prerenderable.
 */
export default function Loading() {
  const t = useTranslations("common");

  return (
    <Section spacing="hero">
      <Container>
        <p
          role="status"
          aria-live="polite"
          className="font-mono text-micro tracking-wider text-subtle uppercase"
        >
          {t("loading")}
        </p>
      </Container>
    </Section>
  );
}
