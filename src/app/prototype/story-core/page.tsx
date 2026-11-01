import { StoryCorePrototype } from "@/prototype/story-core/StoryCorePrototype";

export default function StoryCorePage() {
  return (
    <>
      <StoryCorePrototype />

      {/*
        The floor under the scene. A pinned section needs somewhere to release
        into, and this says what the reader has just watched rather than
        pretending to be the next section of a site that does not exist yet.
      */}
      <section className="border-t border-hairline px-gutter py-block">
        <p className="mx-auto max-w-measure-body text-caption text-subtle">
          One scene, three states, one core. Scroll back up: the transformation runs in reverse,
          because every frame is a function of the scroll position and nothing is triggered.
        </p>
      </section>
    </>
  );
}
