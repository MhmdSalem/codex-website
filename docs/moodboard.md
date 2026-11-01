# CODEX TECH — Moodboard

**Version 1.0 · Phase 2 · The felt direction**

The [design system](./design-system.md) says what to build. This says what it should feel like when
it is built correctly — and, just as usefully, what "wrong but technically compliant" looks like.

Read this before art-directing a shoot, commissioning an illustration, briefing a 3D scene, or
judging whether a finished section is actually good.

---

## Overall visual direction

**A dark room where structure is drawn in light.**

Imagine an engineering drawing projected in a screening room. The paper is gone; what is left is the
line work, the annotation, the measurement ticks — floating in near-black, lit by one source. Then
imagine a photograph fading up inside that drawing, occupying a frame the line work had already
reserved for it.

That is the site. It is simultaneously a technical document and a film, and neither half apologises
for the other. The drawing gives it authority; the light gives it atmosphere.

The reference studios each contribute one thing, and only one:

- **restudios.xyz** — the courage to set type enormous and let it be cropped.
- **Locomotive** — editorial pacing and the discipline of a visible grid.
- **Active Theory** — the idea that light, not colour, is what makes a dark screen feel alive.
- **Dogstudio** — the confidence to make a single hard cut between two very different sections.
- **Resn** — tactility: things should have weight and respond to being touched.
- **Make Me Pulse** — restraint, and the poetry of one perfect move instead of nine good ones.

What none of them contribute is a layout. Nothing here is copied.

---

## Emotional feeling

**Composed confidence.** The feeling of a well-made instrument — a camera body, a mixing desk, a
machined tool. Precise, slightly cold, and warmed just enough by the off-white type and the grain
that it never reads as clinical.

The site should feel **quiet until it is not**. Long passages of stillness and space, then one large
move that lands because nothing around it was competing. A visitor should finish a page feeling that
someone was in control of every decision, including the decision to leave things out.

Specifically, it should feel:

| Yes                    | No                   |
| ---------------------- | -------------------- |
| Deliberate             | Busy                 |
| Engineered             | Corporate            |
| Cinematic              | Theatrical           |
| Expensive              | Ornate               |
| Assured                | Loud                 |
| Cold, then warm        | Cheerful             |
| Serious about the work | Serious about itself |

The one thing it must never feel is **eager**. No exclamation marks, no bouncing arrows, no
"Let's build something amazing together!" The work argues for itself.

---

## Photography direction

**Low-key, single-source, graded as one set.**

- **Lighting** — one hard-ish key with real falloff. Deep shadows are welcome; muddy grey ones are
  not. Rim light to separate a subject from the field.
- **Colour** — desaturated overall, cool in the shadows, warm in the highlights. Everything is
  graded toward the same neutral ramp so photographs from three different shoots read as one body of
  work.
- **Product and interface** — shot like still life on real surfaces, with real reflections and hard
  shadows. Screens photographed in situ, on a desk, at an angle, in a room. **Never** a floating
  device mockup on a gradient, and never a perfectly straight-on UI screenshot pretending to be
  photography.
- **People** — candid, mid-action, cropped tight. Hands working, a screen reflected in glasses, a
  half-turn away from camera. No one looks at the lens. No one is smiling at a laptop. No conference
  tables.
- **Environment** — architecture and texture over context. Concrete, glass, cabling, a lit corridor,
  the edge of a building at dusk. Riyadh's light and materials are fair game; skyline postcards are
  not.
- **Grain** — always. Even a clean studio shot gets the 6% plate so it belongs to the set.

**Forbidden outright:** server rooms, network cabinets, routers, data centres, padlock-and-shield
cybersecurity imagery, cloud graphics, handshake photos, generic open-plan offices, and any stock
image containing a hologram.

---

## Illustration direction

**Not illustration — diagram.**

If something must be drawn rather than photographed, it is drafted. Technical line work at 1px, in
foreground or accent, on the field:

- Orthographic and isometric projections rather than perspective.
- Annotation labels in monospace, with leader lines and measurement ticks.
- Wireframes, exploded views, node graphs, timing diagrams, coordinate grids.
- Anything that looks like it came out of a specification, a patent filing, or a control panel.

The test: **could this plausibly be a page from an engineering document?** If yes, it belongs.

**Forbidden:** flat-vector people with no faces, blobs, rounded "friendly" shapes, isometric city
scenes, gradient mesh abstractions, hand-drawn doodle style, and any icon set that comes with a
mascot.

---

## Texture direction

**One texture, used everywhere; nothing else.**

- **Film grain** — a 160px fractal-noise plate at 3.5% over the field and 6% over photography. It is
  what keeps a flat near-black from reading as an empty div, and it is the single most important
  detail in making the site feel photographed rather than rendered.
- **Paper tooth** — the same plate at 5% in the light room, which reads as stock rather than noise
  once the background is bright.
- **Scanline / interference** — permitted only inside a transition, for under 400ms, and never as a
  resting state.

**Forbidden:** noise gradients, glass and frosted blur, bevels, embossing, drop-shadowed "paper"
layers, subtle inner glows, and anything described in a plugin as "premium texture pack".

---

## Lighting direction

**One light source per composition.**

This is the rule that ties photography, 3D, illustration and UI together. Every composition should
be answerable to the question _where is the light coming from?_

- Content **emerges from darkness** rather than being placed onto a background. The default state of
  anything not yet revealed is unlit.
- The accent behaves as an **emitter**. Where the terracotta signal appears, something nearby is lit by it —
  a hairline picks up the colour, a surface catches a faint wash. It is never a flat swatch dropped
  onto a dark page.
- **Vignette** on full-bleed media: a 35% falloff toward the corners, matching the single-source
  logic and quietly focusing the eye.
- **Falloff is soft, shadows are hard.** Light dies gradually across a surface; the edge of an object
  is crisp.

**Forbidden:** bloom on everything, uniform ambient fill, two competing light sources, neon glow
outlines, and lens flares of any kind.

---

## Typography feeling

**Two voices — a confident one and a technical one — and almost nothing in between.**

- Display type is **architectural**. Tracked tight until the counters nearly touch, cropped by masks
  so words arrive rather than appear. Confident and composed, but never oversized: a headline is
  something a visitor reads in one pass, not a poster they look at.
- Monospace metadata is the **marginalia of an engineering drawing**: index numbers, coordinates,
  years, service tags. Tiny, wide-tracked, uppercase, and always precisely aligned to something.
- Body copy is **quiet and well-mannered**. It gets out of the way. If a paragraph feels like it
  needs emphasis, the composition is wrong, not the type.

The absence of mid-sized headings is deliberate and is the fastest way to tell whether a page is on
brand. Templates live in the middle of the scale; this system does not go there.

**In Arabic**, the same feeling is reached differently: authority comes from weight and generous
leading rather than from tight tracking and uppercase, because neither of those exists in the
script. An Arabic page should feel equally confident and equally composed — never like a translation
poured into a Latin layout.

---

## Motion feeling

**Cinematic editing, not UI animation.**

The site should feel _cut_, not _animated_. The vocabulary is film: cuts, wipes, camera moves,
focus pulls. The vocabulary is not: bounces, pulses, wiggles, spinners, floating cards.

- **Weight and inertia.** Things have mass. They accelerate reluctantly, decelerate over a long
  curve, and settle without overshooting. Out-expo, the house easing, exists exactly for this.
- **Revelation over assembly.** The page is being uncovered, not built. Masks open, images are
  already behind them, type rises into a frame it always occupied. Nothing is constructed in front
  of the viewer.
- **Silence between moves.** Most of the time, nothing is moving. That is what makes the one move
  per section land. A page where three things are animating at once has no focal point and no taste.
- **Scroll is the timeline.** The reader is the editor: they set the pace, and the site never takes
  the scrollbar away from them to make a point.
- **Nothing loops.** A looping decorative animation is the visual equivalent of background music in
  a showroom. Ambient video is the one exception, and it earns that by being content.

The feeling to aim for is the opening minute of a well-directed film: measured, confident, and
completely uninterested in impressing you quickly.
