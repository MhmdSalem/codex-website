"use client";

import { NextStudio } from "next-sanity/studio";
import config from "../../../../sanity.config";

/**
 * The Studio runs entirely in the browser.
 *
 * This page is a Client Component on purpose: pulling `sanity.config` into the
 * React Server Component graph makes bundlers resolve the Studio's transitive
 * dependencies under the `react-server` export condition, where several of
 * them have no matching entry point and the build fails.
 */
export default function StudioPage() {
  return <NextStudio config={config} />;
}
