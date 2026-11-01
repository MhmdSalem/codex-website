# THE FIRST LINE

**CODEX TECH — Prologue · Phase 3 · The cinematic concept**

A 22-second opening film that plays once per session before the homepage exists.

This document is the shooting script. It defines the concept, all seven scenes, every transition,
every interaction, and the reason each animation is allowed to exist. Implementation follows the
[design system](./design-system.md) without exception — the prologue is not a place where the rules
are suspended.

---

## 1. The concept

### The problem with intros

Almost every "cinematic intro" fails the same way: it is a video that happens _at_ you. You watch it,
you wait for it, and the first thing you learn about the company is that it will waste your time.
The animation is impressive and the experience is passive.

The fix is not to make the film shorter. It is to make the visitor the reason it is happening.

### The idea

> **A single white line is the protagonist.**

The film is the life of one line. It is drawn by a hand in the dark, becomes a sketch, becomes
structure, becomes a designed product, becomes a launched thing used by real people — and finally
becomes the hairline rule at the top of the CODEX TECH homepage.

**The line never breaks.** There is not a single cut in the film. Every scene transition is that one
line changing what it means. This is what makes the transformation feel magical rather than
mechanical: nothing is replaced, everything becomes.

### Why a line

Three meanings converge, and the audience does not need any of them explained:

1. **A line is the first mark anyone makes.** Every idea in history started as someone drawing on
   something. That is the story the brief asked for — not CODEX TECH's story, but every founder's.
2. **A line is a line of code.** The thing CODEX TECH actually writes.
3. **A line is the hairline** — already the primary structural mark of the Phase 2 design system.

So the film is, literally, the origin story of the website you are about to use. The last frame of
the prologue is the first frame of the homepage. That match cut is the whole reason the concept
works: the visitor watched the site get drawn.

### The emotional arc

The brief asks for **curiosity**. Curiosity is not created by spectacle; it is created by
withholding. So the film gives progressively more, and never quite enough:

| Scene | Emotion              | What is withheld            |
| ----- | -------------------- | --------------------------- |
| 01    | Where am I?          | Everything. Even light.     |
| 02    | Someone is here.     | What is being drawn.        |
| 03    | It is becoming real. | What it is for.             |
| 04    | This is designed.    | What the product is.        |
| 05    | It is everything.    | Time to look at any of it.  |
| 06    | It worked.           | Who did it.                 |
| 07    | Oh — _that_ is who.  | Nothing. The film pays out. |

### The colour arc

This is the film's second structural device, and it costs nothing to run.

Scenes 01–03 are **pure monochrome** — void and bone, no accent, not one pixel of it. Colour
enters the film exactly once, in **Scene 04**, at the moment the idea becomes _designed_. That single
frame is the emotional peak of the film, and it lands only because the preceding eleven seconds
refused to spend it.

This is also why the cursor light in Scene 01 is neutral white rather than the accent, even though
the accent would look good there. Spending it in the first three seconds would cost the Scene 04
reveal everything and buy a slightly prettier opening.

---

## 2. How it is driven

### Time and scroll are the same axis

The brief asks for two things that normally conflict: _~22 seconds if the user watches naturally_,
and _skippable by scrolling, where the scroll is part of the storytelling_.

A pure scroll-driven pin fails the first (a passive viewer sees a frozen frame). A pure autoplay
timeline fails the second (scroll can't participate). So:

> **One master timeline. The playhead is advanced by time _and_ by scroll.**

Every frame:

```
playhead += Δtime            // the film plays itself at 1×
playhead += drain(scroll)    // scrolling adds an eased boost on top
```

Consequences, all of them intended:

- **Do nothing** → the film runs its full 22 seconds.
- **Scroll** → you fast-forward. About four wheel flicks reaches the end. Scroll is a shuttle, not a
  scrubber: it feels like leaning on the film, not dragging it.
- **The playhead is monotonic.** Scrolling up does nothing. The story only moves forward, and a
  visitor can never get lost inside a scene they already passed.
- **Skip** → the playhead is tweened to the end over 0.9s on `circ.inOut`. Even the skip is a camera
  move rather than a cut, because a hard jump to the homepage would waste the match cut.

### Scroll is locked, and that is a deliberate exception

The design system forbids scroll-jacking. The prologue takes the scrollbar for up to 22 seconds,
which is exactly that. The exception is granted on these conditions, all implemented:

- It runs **once per session**. Returning visitors, internal navigation and every page other than the
  homepage never see it.
- A **skip control is always available** — visible from 2.6s, reachable by keyboard from the first
  frame, and bound to `Escape`.
- **Reduced motion skips the film entirely.** It is not shortened or sped up; it does not run.
- The homepage **is fully rendered in the DOM underneath**, marked `inert`. Crawlers, screen readers
  and "view source" see a normal page. The film is an overlay, not a gate.

### The scene registry

Scenes are windows on the master timeline, declared in one file:

```ts
{ id: "void",      start:  0.0, end:  3.0 }
{ id: "sketch",    start:  3.0, end:  7.6 }
{ id: "structure", start:  7.6, end: 11.0 }
{ id: "design",    start: 11.0, end: 14.2 }
{ id: "products",  start: 14.2, end: 16.8 }
{ id: "scale",     start: 16.8, end: 19.0 }
{ id: "statement", start: 19.0, end: 22.0 }
```

Scene lengths shorten through the middle and then open up again at the end — the film accelerates as
the idea gains momentum, then breathes for the payoff. This is ordinary editing rhythm and it is the
main reason the pacing will feel directed rather than uniform.

Each scene is a pure function returning a GSAP timeline. **Scenes animate numbers, not DOM.** They
tween a shared `StageState` object (`grain`, `particles`, `vignette`, `camera`, `light`, …) and the
render layers read those numbers each frame. This is what lets a canvas layer, a CSS layer and an SVG
layer all be choreographed by one timeline without any of them knowing about each other.

Unbuilt scenes are declared with `enabled: false`, and the film's duration is computed from whatever
is enabled. Scene 01 alone currently produces a 3-second film that hands off correctly. Turning on
Scene 02 is a one-line change.

---

## 3. The scenes

### Scene 01 — VOID · 0.0 → 3.0s

**What you see.** Black. Then, so gradually you are not sure when it started, film grain. Then a
scatter of extremely faint particles — dust in an unlit room. No text, no logo, no navigation, no
sound.

When you move the pointer, a soft pool of light follows it, and the dust _inside that pool_ brightens.
Outside it, the world stays dark. You are holding the only light source, and you have to move it to
find out that anything is there at all.

**Camera.** A 3-second push from scale 1.00 to 1.05, linear, no easing. Slow enough to be felt and
not seen. This is the establishing shot: the camera is approaching something.

**Why each animation exists.**

| Beat                    | Timing       | Reason                                                                                                                     |
| ----------------------- | ------------ | -------------------------------------------------------------------------------------------------------------------------- |
| Nothing at all          | 0.0 → 0.35s  | Silence before the first note. Without a genuinely empty beat, the fade-in has nothing to be measured against.             |
| Grain fades up          | 0.35 → 1.55s | Grain is what tells the eye this is a photographed space, not a blank div. It arrives first because it defines the medium. |
| Vignette closes         | 0.6 → 2.2s   | Encloses the frame so the light pool has walls. Without it the darkness reads as "unstyled", with it as "unlit".           |
| Particles emerge        | 0.8 → 3.0s   | Establishes that the void has volume and depth. They never reach full brightness — the room stays mostly unknown.          |
| Light becomes available | 0.6s onward  | Held back briefly so the first thing you do is _wait_, and the second thing is _discover_.                                 |
| Camera push             | 0.0 → 3.0s   | Continuous, and it never stops for the rest of the film. The camera is always moving toward the idea.                      |

**Interaction.** The light pool lerps toward the pointer at 0.12 — heavy enough to have mass, light
enough not to feel broken. On touch devices, and for anyone who never moves the pointer, the light
drifts on a slow Lissajous path around the centre so the scene still breathes and still reveals.

**The handoff to Scene 02.** The light pool is not decoration; it is the pen. At 3.0s it slows,
settles, and the first white line begins at exactly the point where the light is standing. Scene 01
is a two-second tutorial disguised as an atmosphere: it teaches you where the pen is before anything
is drawn with it.

---

### Scene 02 — SKETCH · 3.0 → 7.6s

**What you see.** A white line begins drawing itself out of the light pool. It is not a perfect
vector — it wobbles, it overshoots a corner, it doubles back. Boxes appear. An arrow. A circle drawn
in one imprecise motion. Two words in handwriting that are never quite legible. It is somebody's
first sketch of an idea, and it is unmistakably made by a hand.

**Technique.** SVG paths with `stroke-dasharray` / `stroke-dashoffset` drawn by GSAP. Human quality
comes from three cheap tricks, none of which are randomness for its own sake:

- The paths are authored with deliberate imprecision (corners that overshoot, lines that are not
  parallel).
- Each stroke draws on `power2.inOut`, not linear — a hand accelerates and decelerates.
- Strokes overlap slightly rather than starting when the previous one finishes, because a person
  does not pause between marks.

**Camera.** Locked. Completely still, for 4.6 seconds. This is the longest scene and the only static
camera in the film, because stillness is what makes an audience lean in. Everything before and after
it moves.

**Why it exists.** This is the scene that makes the story universal. It is not CODEX TECH's sketch;
it is _yours_. The whole film's thesis — every great company started as an idea — is only earned if
the idea looks amateur first.

**Transition out.** The sketch does not fade. Each wobbling stroke _straightens_: the same path data
morphs toward its own idealised version. The idea does not get replaced by a plan. It becomes one.

---

### Scene 03 — STRUCTURE · 7.6 → 11.0s

**What you see.** The straightened sketch is revealed to be one small module in a much larger
structure. Wireframes assemble around it. A grid snaps into place behind everything. User-flow
connectors run between boxes. Monospace annotation appears in the margins — the drafted-document
language of the design system, arriving for the first time.

**Camera.** Pulls back. This is the film's only zoom-out, and it carries the entire meaning of the
scene: _your idea was bigger than you drew it_.

**Technique.** SVG line work, drawn in a staggered cascade capped at 480ms total per group (the
system's stagger rule). The background grid is the real `--grid-columns` grid, drawn as hairlines —
the site's own structure, appearing on screen before the site does.

**Why it exists.** This is the moment the film stops being about inspiration and starts being about
craft. It is where CODEX TECH's actual value shows up, without a word of copy.

**Transition out.** The wireframe boxes stay exactly where they are. Only their contents change.

---

### Scene 04 — DESIGN · 11.0 → 14.2s

**What you see.** Typography drops into the wireframe boxes at real scale and real weight. Spacing
resolves to the actual spacing tokens. Then — for the first time in the film — **colour**. One warm
signal, arriving on one element.

**Camera.** Pushes in on a single module. After the pull-back of Scene 03, this is the return to
detail: the film goes wide to show ambition, then close to show quality.

**Why it exists.** This is the emotional peak, and it is engineered by the colour arc described
above. Eleven seconds of monochrome make a single warm rectangle feel like a light being switched on.

**Why the colour is one element and not a palette.** A designed thing is not a colourful thing. The
restraint _is_ the demonstration of taste, and it is consistent with the accent budget of one to two
moments per viewport.

**Transition out.** The designed module tilts very slightly in perspective — the first hint of a
third dimension — and becomes a device surface.

---

### Scene 05 — PRODUCTS · 14.2 → 16.8s

**What you see.** In 2.6 seconds: a mobile app, a website, a SaaS platform, an AI interface, an event
experience. Roughly 400–500ms each. Each one is abstract — layout, motion and structure only. No
screenshots, no dashboards, no device mockups floating on gradients.

**Camera.** Lateral. Each product enters as a whip-pan, so the sequence reads as one continuous
sideways move across five things rather than five separate cuts. The line is still continuous: it is
now the edge shared between one product and the next.

**Why it is this fast.** The brief is explicit — _enough to understand transformation, never enough
to stop the story_. If any product is legible for long enough to evaluate, the film stops being about
transformation and starts being a portfolio. Illegibility is the point.

**Why abstract and not real work.** Real screenshots date instantly, require client approval, and
invite the viewer to judge a specific project during a scene about a general truth. The work has its
own pages.

---

### Scene 06 — SCALE · 16.8 → 19.0s

**What you see.** The camera reaches its widest point. The five products become nodes. Connections
run between them and multiply outward. Small marks appear and move along the connections — usage,
people, traffic. Then the multiplication slows and settles.

**Camera.** The widest framing in the film, and the slowest move. Deceleration is the message.

**Why it exists.** The story needs a consequence. Scenes 02–05 are about making something; this is
about it working. It is also where the motion language completes its own arc: uncertain and hand-made
at the start, confident and still at the end.

**Why it calms rather than crescendos.** A build to a climax is what an advertisement does. Settling
into stillness is what a company that is sure of itself does, and it sets up the silence Scene 07
needs.

---

### Scene 07 — STATEMENT · 19.0 → 22.0s

**What you see.** Everything recedes — not fading out, but _retreating_ toward the centre and
collapsing back into the single line it came from. The line settles horizontally in the middle of a
black frame.

One sentence resolves above it, in masked reveals:

> **Every great company started as an idea.**

A pause — around 700ms, long enough to be uncomfortable, which is what makes it read as a statement
rather than a caption.

Then the sentence is replaced, in place, by:

> **CODEX TECH turns ideas into digital experiences.**

**The match cut.** The horizontal line does not disappear. It travels to the top of the viewport and
becomes the first hairline of the homepage. In the same beat, the void fades to reveal the real page
underneath, the header fades in, and the scroll is returned. There is no transition between the film
and the site because they share a frame.

**Why the statement is two sentences and not one.** The first belongs to the visitor; the second
belongs to CODEX TECH. Showing them together would make the whole film an advertisement. Showing them
in sequence makes the first one true and the second one an offer.

**Why navigation appears last.** It is the moment the experience becomes a website. Nothing is
clickable until the story has finished making its point.

---

## 4. Motion, camera and sound doctrine

### Motion

Everything obeys the Phase 2 motion rules, with three prologue-specific additions:

- **Nothing bounces, overshoots, or spins.** `out-expo` and `in-out-circ` only. The one overshoot
  permitted anywhere in the system — `spring` — belongs to the cursor, and the cursor is not on
  screen during the film.
- **No animation loops.** Every motion in the film happens exactly once. The only continuous motions
  are the camera and the particle drift, and both are physical rather than decorative.
- **One motion owns each moment.** Where two things could animate simultaneously, one of them is
  delayed. This is what buys the film its calm.

### Camera

The camera is a single transform on one stage element, driven by the master timeline. It is
continuous for the whole film and only changes direction at scene boundaries:

```
push (01) → hold (02) → pull back (03) → push in (04) → lateral (05) → widest (06) → settle (07)
```

It never rushes and it never stops until the last beat, so the film has one unbroken physical
viewpoint rather than seven separate animations.

### Sound

Architecture only, as specified. Nothing autoplays.

- A Web Audio graph is created lazily on the **first user gesture**, never before.
- One ambient bed plus a small set of one-shot cues keyed to timeline markers.
- A speaker toggle appears alongside the skip control, defaults to **off**, and remembers the choice
  for the session.
- The film is designed silent. Sound is a layer on top of a complete experience, and every beat above
  works with the tab muted.

---

## 5. Accessibility and performance

| Concern        | Treatment                                                                                                                                                                           |
| -------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Reduced motion | The prologue does not run. Not shortened — skipped. The homepage renders normally.                                                                                                  |
| Keyboard       | Skip is the first focus stop and is bound to `Escape`. `Space` / `ArrowDown` / `PageDown` advance the film, mirroring what scroll does for a mouse.                                 |
| Screen readers | The film is `aria-hidden`; the homepage beneath is complete and, once the film ends, no longer `inert`. Nothing in the story is content that only exists in the animation.          |
| Touch          | No hover, no cursor. The light drifts autonomously and touch-drag advances the playhead.                                                                                            |
| Low power      | Particle count halves, DPR caps at 1.5, canvas effects degrade before the timeline does.                                                                                            |
| Tab hidden     | The ticker and canvas pause; the playhead does not advance in a background tab.                                                                                                     |
| Budget         | The prologue is code-split off the homepage route and must stay inside 45KB gzipped. No Three.js, no WebGL, no video, no image assets — the entire film is vector, canvas and type. |

**Why canvas and SVG rather than WebGL.** The film has no lighting model, no 3D geometry and no
particle count that needs a GPU. A 2D canvas with 90 sprites costs a fraction of a WebGL context, and
the design system forbids loading Three.js on a route that does not need it. The one candidate for
WebGL — the Scene 05 product transitions — is achievable with masks and transforms, and will only be
reconsidered if it demonstrably cannot be.

---

## 6. Build order

| Phase | Scenes                                      | Status            |
| ----- | ------------------------------------------- | ----------------- |
| 3.1   | Shell, driver, scene registry, **Scene 01** | **Built**         |
| 3.2   | Scene 02 — sketch                           | Awaiting approval |
| 3.3   | Scene 03 — structure                        |                   |
| 3.4   | Scene 04 — design, first colour             |                   |
| 3.5   | Scene 05 — products                         |                   |
| 3.6   | Scene 06 — scale                            |                   |
| 3.7   | Scene 07 — statement, match cut, handoff    |                   |
| 3.8   | Sound design, final grade, performance pass |                   |

Each phase is reviewed at award-winning quality before the next begins. Scene windows are declared
now so pacing is a fixed constraint rather than something discovered at the end.
