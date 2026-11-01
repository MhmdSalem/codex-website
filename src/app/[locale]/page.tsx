import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { AboutPreview } from "@/components/sections/AboutPreview";
import { FEATURE_KEYS, PROCESS_IDS, SERVICE_IDS } from "@/content/catalog";
import { resolveEmail } from "@/content/contact";
import { BuildScene } from "@/experience/build/BuildScene";
import { ConnectScene } from "@/experience/build/ConnectScene";
import { IntroScene } from "@/experience/build/IntroScene";
import { ShipScene } from "@/experience/build/ShipScene";
import { StartScene } from "@/experience/build/StartScene";
import { WriteScene } from "@/experience/build/WriteScene";
import { routes } from "@/i18n/routes";
import type { Locale } from "@/i18n/routing";
import { at, byKey, pick } from "@/lib/cms";
import { getHomepage, getProducts, getServices, getSiteSettings } from "@/lib/content";
import { resolveCta, type ResolvedLink } from "@/lib/links";
import { buildPageMetadata } from "@/lib/seo";
import { Reveal } from "@/motion/Reveal";

interface PageProps {
  params: Promise<{ locale: Locale }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const [t, homepage] = await Promise.all([
    getTranslations({ locale, namespace: "home" }),
    getHomepage(locale),
  ]);

  return buildPageMetadata({
    locale,
    path: "/",
    title: t("title"),
    description: t("description"),
    seo: homepage?.seo,
  });
}

/**
 * The homepage as a build sequence.
 *
 * Six scenes, each a step of the same program: write the code, state the idea,
 * build the product from it, connect the capabilities, ship through the
 * pipeline, start the next one. Every line of copy comes from the dashboard
 * when an editor has written it there and from the message catalogue when not.
 */
export default async function HomePage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const [t, tBuild, tCatalog, homepage, settings, products, services] = await Promise.all([
    getTranslations("home"),
    getTranslations("build"),
    getTranslations("catalog"),
    getHomepage(locale),
    getSiteSettings(locale),
    getProducts(locale),
    getServices(locale),
  ]);

  const headline = pick(homepage?.heroHeadline, t("headline"));
  const eyebrow = pick(homepage?.heroEyebrow, t("eyebrow"));
  const subheading = pick(homepage?.heroSubheading, t("subheading"));

  const primaryAction: ResolvedLink = resolveCta(homepage?.heroCta) ?? {
    label: t("primaryCta"),
    href: routes.services,
    external: false,
    newTab: false,
  };
  const secondaryAction: ResolvedLink = {
    label: t("secondaryCta"),
    href: routes.products,
    external: false,
    newTab: false,
  };

  const email = resolveEmail(settings);
  const accreditation = byKey(products, "accreditation");
  const daawa = byKey(products, "daawa");
  const productsHeader = homepage?.productsHeader;
  const capabilities = homepage?.capabilities;
  const process = homepage?.process;
  const closing = homepage?.closingCta;

  return (
    <>
      <WriteScene
        command={tBuild("commands.write")}
        eyebrow={eyebrow}
        headline={headline}
        subheading={subheading}
        primary={primaryAction}
        secondary={secondaryAction}
        editor={{ file: tBuild("editor.file"), lang: tBuild("editor.lang") }}
        kpis={[
          { value: "2", label: tBuild("kpis.products") },
          { value: "6", label: tBuild("kpis.capabilities") },
          { value: "2", label: tBuild("kpis.languages") },
        ]}
      />

      <IntroScene
        command={tBuild("commands.intro")}
        eyebrow={t("intro.eyebrow")}
        lines={pick(homepage?.introLines, [
          t("intro.lineOne"),
          t("intro.lineTwo"),
          t("intro.lineThree"),
          t("intro.lineFour"),
        ])}
        support={pick(homepage?.introSupport, t("intro.support"))}
      />

      <BuildScene
        command={tBuild("commands.build")}
        eyebrow={pick(productsHeader?.eyebrow, t("productsSection.eyebrow"))}
        headline={pick(productsHeader?.headline, t("productsSection.headline"))}
        lead={pick(productsHeader?.intro, t("productsSection.lead"))}
        cta={{ label: t("productsSection.cta"), href: routes.products }}
        editor={{
          file: tBuild("editor.file"),
          lang: tBuild("editor.lang"),
          compiling: tBuild("editor.compiling"),
          built: tBuild("editor.built"),
        }}
        product={{
          name: pick(accreditation?.name, tCatalog("products.accreditation.name")),
          tag: pick(accreditation?.category, tCatalog("products.accreditation.tag")),
        }}
        stage={{
          live: tBuild("stage.live"),
          verified: tBuild("stage.verified"),
          admit: tBuild("stage.admit"),
          deny: tBuild("stage.deny"),
          checkins: tBuild("stage.checkins"),
          guests: {
            a: tBuild("stage.guests.a"),
            b: tBuild("stage.guests.b"),
            c: tBuild("stage.guests.c"),
            d: tBuild("stage.guests.d"),
          },
        }}
        terminal={{
          run: tBuild("terminal.run"),
          open: tBuild("terminal.open"),
          verify: tBuild("terminal.verify"),
          metrics: tBuild("terminal.metrics"),
          daawa: tBuild("terminal.daawa"),
        }}
        daawa={{
          name: pick(daawa?.name, tCatalog("products.daawa.name")),
          tag: pick(daawa?.category, tCatalog("products.daawa.tag")),
          features: pick(
            daawa?.capabilities,
            FEATURE_KEYS.map((key) => tCatalog(`products.daawa.features.${key}`)),
          ).slice(0, 3),
        }}
      />

      <ConnectScene
        command={tBuild("commands.connect")}
        eyebrow={pick(capabilities?.header?.eyebrow, t("servicesSection.eyebrow"))}
        headline={pick(capabilities?.header?.headline, t("servicesSection.headline"))}
        lead={pick(capabilities?.header?.intro, t("servicesSection.lead"))}
        services={SERVICE_IDS.map((id) => ({
          id,
          name: pick(byKey(services, id)?.name, tCatalog(`services.${id}.name`)),
        }))}
        cta={{ label: t("servicesSection.cta"), href: routes.services }}
      />

      <ShipScene
        command={tBuild("commands.ship")}
        eyebrow={pick(process?.header?.eyebrow, t("processSection.eyebrow"))}
        headline={pick(process?.header?.headline, t("processSection.headline"))}
        lead={pick(process?.header?.intro, t("processSection.lead"))}
        steps={PROCESS_IDS.map((id, index) => ({
          id,
          label: id.toUpperCase(),
          title: pick(at(process?.steps, index)?.title, tCatalog(`process.${id}.title`)),
          body: pick(at(process?.steps, index)?.description, tCatalog(`process.${id}.body`)),
          logs: tBuild.raw(`pipeline.logs.${id}`) as string[],
        }))}
      />

      <Reveal>
        <AboutPreview header={homepage?.aboutPreview?.header ?? null} />
      </Reveal>

      <StartScene
        command={tBuild("commands.start")}
        eyebrow={pick(closing?.eyebrow, t("closing.eyebrow"))}
        headline={pick(closing?.headline, t("closing.headline"))}
        body={pick(closing?.body, t("closing.body"))}
        cta={{
          label: pick(closing?.cta?.label, t("closing.cta")),
          href: resolveCta(closing?.cta)?.href ?? routes.contact,
        }}
        or={t("closing.or")}
        email={email}
        prompt={tBuild("prompt")}
      />
    </>
  );
}
