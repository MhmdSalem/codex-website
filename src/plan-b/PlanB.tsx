import { Reveal } from "@/motion/Reveal";

import { CoreLayer } from "./core/CoreLayer";
import { Convergence } from "./scenes/Convergence";
import { Intro } from "./scenes/Intro";
import { Living } from "./scenes/Living";
import { Problem } from "./scenes/Problem";
import { Process } from "./scenes/Process";
import { Products } from "./scenes/Products";
import { Spark } from "./scenes/Spark";
import { Transformation } from "./scenes/Transformation";

/**
 * The concept, composed.
 *
 * The core is mounted once, outside the scenes and before them, and the scenes
 * are stacked in the order of `timeline.ts`. That order is the only thing
 * connecting the two halves: the layer counts scene elements as it finds them in
 * the document, so the eighth section on the page gets the eighth state.
 */
export function PlanB({ locale }: { locale: string }) {
  return (
    <>
      <CoreLayer />
      <Reveal>
        <Intro />
        <Spark />
        <Problem />
        <Transformation />
        <Products />
        <Process />
        <Living />
        <Convergence locale={locale} />
      </Reveal>
    </>
  );
}
