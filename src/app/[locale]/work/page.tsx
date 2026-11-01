import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/ui/PageHeader";
import { Section } from "@/components/ui/Section";
import { Link } from "@/i18n/navigation";
import { projectPath } from "@/i18n/routes";
import type { Locale } from "@/i18n/routing";
import { getProjects } from "@/lib/content";
import { buildPageMetadata } from "@/lib/seo";
import { ordinal } from "@/lib/utils";

interface PageProps {
  params: Promise<{ locale: Locale }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "work" });

  return buildPageMetadata({
    locale,
    path: "/work",
    title: t("title"),
    description: t("description"),
    // Unlinked and unindexed until the first case study is published. See the
    // note beside `primaryNavigation` in src/i18n/routes.ts.
    noIndex: true,
  });
}

export default async function WorkPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const [t, projects] = await Promise.all([getTranslations("work"), getProjects(locale)]);

  return (
    <>
      <PageHeader eyebrow={t("eyebrow")} headline={t("headline")} />

      <Section spacing="default">
        <Container>
          {projects.length === 0 ? (
            <p className="text-body text-muted">{t("empty")}</p>
          ) : (
            <ul className="border-t border-border">
              {projects.map((project, index) => (
                <li key={project._id} className="border-b border-border">
                  <Link
                    href={projectPath(project.slug)}
                    className="group grid gap-4 py-8 md:grid-cols-12 md:items-baseline"
                  >
                    <span className="font-mono text-micro text-subtle md:col-span-1">
                      {ordinal(index)}
                    </span>
                    <span className="font-display text-title-2 group-hover:text-accent md:col-span-6">
                      {project.name}
                    </span>
                    <span className="text-caption text-muted md:col-span-3">{project.client}</span>
                    <span className="font-mono text-caption text-subtle md:col-span-2 md:text-end">
                      {project.year}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Container>
      </Section>
    </>
  );
}
