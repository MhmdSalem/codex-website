import { getTranslations } from "next-intl/server";

/**
 * Shown where CMS content will land.
 *
 * Phase 1 ships the structure before the content exists; this makes the gap
 * explicit rather than rendering a silently empty section.
 */
export async function PlaceholderNotice({ label }: { label?: string }) {
  const t = await getTranslations("common");

  return (
    <div className="border border-dashed border-border p-6 text-caption text-subtle">
      <p className="mb-2 font-mono text-micro tracking-wider text-accent uppercase">
        {label ?? "CMS"}
      </p>
      <p>{t("phaseNotice")}</p>
    </div>
  );
}
