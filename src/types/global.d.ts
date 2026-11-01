import type messages from "../../messages/en.json";
import type { routing } from "@/i18n/routing";

/**
 * Makes next-intl fully type-safe: `t("nav.work")` is checked against the
 * English message catalogue, and every locale is constrained to the routing
 * config. A missing Arabic key is a type error, not a runtime surprise.
 */
declare module "next-intl" {
  interface AppConfig {
    Locale: (typeof routing.locales)[number];
    Messages: typeof messages;
  }
}
