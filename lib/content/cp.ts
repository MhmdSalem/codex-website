import { pathToClassName } from "@/lib/content/style-types";

/**
 * Helper to add a "content path" class to any element so editor style
 * overrides can target it.
 *
 *   <h1 className={cn("font-display ...", cp("hero.titleStart"))}>...</h1>
 */
export function cp(path: string): string {
  return pathToClassName(path);
}
