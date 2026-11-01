import type { StructureResolver } from "sanity/structure";

/**
 * Studio navigation.
 *
 * Singletons are pinned as single documents (no "create new" button), and
 * collections are grouped so the sidebar reads like the website itself.
 */
export const structure: StructureResolver = (S) =>
  S.list()
    .title("CODEX TECH")
    .items([
      S.listItem()
        .title("Site settings")
        .id("siteSettings")
        .child(S.document().schemaType("siteSettings").documentId("siteSettings")),

      S.divider(),

      S.listItem()
        .title("Homepage")
        .id("homepage")
        .child(S.document().schemaType("homepage").documentId("homepage")),

      // Products come before client work in the sidebar because they come
      // before it on the website.
      S.listItem()
        .title("Products")
        .id("products")
        .child(
          S.documentTypeList("product")
            .title("Products")
            .defaultOrdering([{ field: "sortOrder", direction: "asc" }]),
        ),

      S.listItem()
        .title("Work")
        .id("projects")
        .child(
          S.documentTypeList("project")
            .title("Projects")
            .defaultOrdering([
              { field: "sortOrder", direction: "asc" },
              { field: "publishedAt", direction: "desc" },
            ]),
        ),

      S.listItem()
        .title("Services")
        .id("services")
        .child(
          S.documentTypeList("service")
            .title("Services")
            .defaultOrdering([{ field: "sortOrder", direction: "asc" }]),
        ),

      S.listItem()
        .title("About page")
        .id("aboutPage")
        .child(S.document().schemaType("aboutPage").documentId("aboutPage")),

      S.listItem()
        .title("Pricing page")
        .id("pricingPage")
        .child(S.document().schemaType("pricingPage").documentId("pricingPage")),

      S.listItem()
        .title("Contact page")
        .id("contactPage")
        .child(S.document().schemaType("contactPage").documentId("contactPage")),

      S.divider(),

      S.listItem()
        .title("Legal pages")
        .id("legalPages")
        .child(S.documentTypeList("legalPage").title("Legal pages")),
    ]);
