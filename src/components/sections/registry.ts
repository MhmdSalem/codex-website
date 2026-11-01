import type { HomeSectionKey, HomeSectionToggle } from "@cms/types";

/**
 * Homepage section registry.
 *
 * The CMS controls which sections appear and in what order; this file is the
 * contract that keeps those keys pointing at real components. A key the code
 * does not know about is ignored rather than crashing the page.
 */
export const DEFAULT_SECTION_ORDER: readonly HomeSectionKey[] = [
  "hero",
  "intro",
  // Products come before capabilities: CODEX TECH is a software company that
  // owns its products, and the homepage has to say that before it says
  // anything else.
  "products",
  "capabilities",
  "process",
  "aboutPreview",
  "closingCta",
] as const;

/*
  `featuredProjects` and `statistics` are absent by design.

  Both are still valid CMS keys, but neither has a component yet because neither
  has honest content: there are no published case studies to feature and no
  measured numbers to quote. Because this list is also the allow-list, an editor
  who enables them sees nothing rather than an empty frame — and the day real
  projects exist, adding the key back here is the whole change.
*/

const KNOWN_KEYS = new Set<string>(DEFAULT_SECTION_ORDER);

/**
 * Resolves the ordered, visible section list.
 *
 * Falls back to the default order when the CMS has no composition set, and
 * appends any section the editor has not placed yet so new sections are never
 * silently missing after a schema change.
 */
export function resolveSectionOrder(
  toggles: HomeSectionToggle[] | null | undefined,
): HomeSectionKey[] {
  if (!toggles || toggles.length === 0) return [...DEFAULT_SECTION_ORDER];

  const configured = toggles
    .filter((toggle) => KNOWN_KEYS.has(toggle.key) && toggle.enabled !== false)
    .map((toggle) => toggle.key);

  const seen = new Set(toggles.map((toggle) => toggle.key));
  const unplaced = DEFAULT_SECTION_ORDER.filter((key) => !seen.has(key));

  return [...configured, ...unplaced];
}
