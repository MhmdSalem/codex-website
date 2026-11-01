import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/ui/PageHeader";
import { PlaceholderNotice } from "@/components/ui/PlaceholderNotice";
import { Section } from "@/components/ui/Section";
import { routing, type Locale } from "@/i18n/routing";
import { getProject, getProjectSlugs } from "@/lib/content";
import { buildPageMetadata } from "@/lib/seo";

interface PageProps {
  params: Promise<{ locale: Locale; slug: string }>;
}

/**
 * Prerender every project in both languages. With no CMS connected this
 * returns an empty list and the route falls back to on-demand rendering.
 */
export async function generateStaticParams() {
  const slugs = await getProjectSlugs();
  return routing.locales.flatMap((locale) => slugs.map((slug) => ({ locale, slug })));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const [t, project] = await Promise.all([
    getTranslations({ locale, namespace: "work" }),
    getProject(locale, slug),
  ]);

  return buildPageMetadata({
    locale,
    path: `/work/${slug}`,
    title: project?.name ?? t("title"),
    description: project?.shortDescription ?? t("description"),
    seo: project?.seo,
    fallbackImage: project?.coverImage,
    type: "article",
  });
}

export default async function ProjectPage({ params }: PageProps) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const [t, project] = await Promise.all([getTranslations("project"), getProject(locale, slug)]);

  // A published slug that resolves to nothing is a genuine 404. With no CMS
  // connected every slug resolves to null, so the route 404s by design.
  if (!project) notFound();

  return (
    <>
      <PageHeader
        eyebrow={project.client ?? undefined}
        headline={project.name ?? slug}
        description={project.shortDescription}
      />

      <Section spacing="default">
        <Container>
          <div className="grid gap-6 md:grid-cols-12">
            <div className="md:col-span-4">
              <h2 className="font-display text-title-3">{t("challenge")}</h2>
            </div>
            <div className="md:col-span-8">
              <PlaceholderNotice label="case study" />
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
