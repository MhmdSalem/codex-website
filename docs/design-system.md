# CODEX TECH — Design System

**Version 1.0 · Phase 2 · The specification**

This document is the specification. It says _what_ the system is.
[`design-bible.md`](./design-bible.md) says _why_, and [`moodboard.md`](./moodboard.md) says what it
should feel like.

Everything here is implemented in [`src/styles/tokens.css`](../src/styles/tokens.css),
[`src/styles/base.css`](../src/styles/base.css) and
[`src/motion/config.ts`](../src/motion/config.ts). Run `npm run dev` and open
[`/design`](http://localhost:3000/design) to see it rendered — that page reads the same tokens the
site does, so it cannot drift out of date.

---

## 1. Design philosophy

The concept is **a dark room drawn in light**.

CODEX TECH builds things that are engineered — precise, systematic, tested — and presents them
cinematically. The system holds that tension deliberately: an unlit black field, a visible
structural grid, and a single warm signal — the logo's terracotta — that behaves like a light
source. Content is not placed on the page; it is revealed on it.

Six principles. Every rule in this document is one of them applied to a surface, and any decision
not covered here is settled by asking which principle is at stake.

| #   | Principle                         | What it means in practice                                                                                                                      |
| --- | --------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| 01  | **Contrast, not decoration**      | Hierarchy comes from scale, weight and emptiness. If an element needs a border, a card or a gradient to read as a unit, the layout has failed. |
| 02  | **The structure is the ornament** | Hairlines, index numbers and monospace metadata are visible on purpose. The page should read like a drafted document.                          |
| 03  | **Light is the only effect**      | One accent, one grain plate, one vignette. Where the accent appears, treat it as an emitter and light the area around it.                      |
| 04  | **Motion is editing**             | Every animation is a cut, a wipe or a camera move. Motion that does not reveal, hide, or express weight is deleted.                            |
| 05  | **One extreme move per section**  | A section may be enormous, or pinned, or inverted, or in 3D. Not two of those.                                                                 |
| 06  | **The token is the contract**     | No component invents a colour, duration or spacing value. If a design needs something the token layer lacks, the token layer changes first.    |

---

## 2. Visual language

The vocabulary a page is assembled from. A layout using only these elements looks like CODEX TECH
before any content arrives.

- **Field** — near-black, edge to edge. Sections occupy the background rather than sitting on it as
  panels. Backgrounds change by inversion, never by tint.
- **Hairline** — a 1px rule at 8% foreground. The primary structural mark: it opens sections,
  brackets metadata and separates rows. It replaces every box the system does not draw.
- **Index** — monospace numbering (`01 / 02 / 03`) alongside sections, projects and process steps.
  The single most recognisable signature of the brand.
- **Two voices** — confident display type and tiny technical metadata, with as little as possible
  between them. Confident, not monumental: headlines stay readable.
- **Asymmetry** — compositions are weighted, not centred. Content sits on columns 1–7 or 6–12.
  Full-width centred blocks are reserved for the one closing statement on a page.
- **Bleed** — media either aligns to the grid or runs to the viewport edge. Nothing overhangs by a
  few pixels.
- **Grain** — one fractal-noise plate at 3.5% over the field, 6% over photography.

**Always:** let the grid show · crop type with masks rather than shrinking it · use emptiness as a
compositional element · one focal point per viewport.

**Never:** rounded card grids as a default layout · decorative gradients or glass · server rooms,
circuit boards or network graphics · two competing accents in one viewport.

---

## 3. Typography scale

Three families with three separate jobs.

| Family                  | Role     | Used for                                                                            |
| ----------------------- | -------- | ----------------------------------------------------------------------------------- |
| **Space Grotesk** 500   | Display  | Headlines at `title-3` and above. Tracked tight, cropped by masks, never justified. |
| **Inter Tight** 400/500 | Text     | Body, UI, buttons. Narrow set width survives long lines at Arabic parity.           |
| **System mono** 400     | Metadata | Index numbers, eyebrows, labels, timestamps. Zero bytes.                            |

### Scale

Every step is fluid between 360px and 1920px, so there are no breakpoint jumps in type — only in
layout.

| Token     | Size (min → max) | Leading | Tracking | Use                      |
| --------- | ---------------- | ------- | -------- | ------------------------ |
| `display` | 44 → 112px       | 0.92    | −0.035em | Section statements.      |
| `title-1` | 36 → 72px        | 0.98    | −0.03em  | Page headers.            |
| `title-2` | 28 → 48px        | 1.04    | −0.025em | Section headings.        |
| `title-3` | 22 → 32px        | 1.12    | −0.02em  | Card and row headings.   |
| `lead`    | 18 → 24px        | 1.45    | −0.01em  | Intro paragraphs.        |
| `body`    | 16 → 18px        | 1.6     | 0        | Everything else.         |
| `caption` | 14px             | 1.5     | +0.01em  | Media captions, notes.   |
| `micro`   | 12px             | 1.4     | +0.1em   | Mono metadata, eyebrows. |

There is no `hero` step. It existed at 52 → 192px and was removed: CODEX TECH sells software, and
type at that scale reads as an agency showreel. `display` is the ceiling, and page headlines sit at
`title-1` or `title-2`.

### Rules

- **Measure** — display 24ch, lead 46ch, body 62ch. Enforced with `max-w-measure-*`, not by eye.
- **Optical tracking** — negative tracking scales with size, from −0.035em at `display` to 0 at
  `body`, then +0.1em at `micro`. Display type is never tracked positively.
- **Case** — uppercase is reserved for the largest display type and micro metadata. Titles are
  sentence case.
- **The missing middle** — nothing is set between `lead` (24px) and `title-2` (48px) in composition.
  Pick a voice.
- **Weight** — the display face is set at 500 everywhere, with one exception: the homepage `h1` is 700. At `title-1` in a 45%-width column, 500 reads thin rather than quiet, and the opening claim is
  the single place the brand is allowed to be heavy. It is a one-line deviation in `Hero.tsx`, not a
  second display weight for the system.
- **Hero lead** — the homepage support paragraph is `body`, not `lead`. Against a 72px headline the
  `lead` step is only three times smaller, which reads as two paragraphs of similar size; `body`
  makes it four and lets the headline carry the viewport alone.
- **Arabic** — no uppercase, no negative tracking, leading raised to 1.28, display swapped to IBM
  Plex Sans Arabic 600. Numerals and latin fragments stay LTR inside RTL copy via
  `unicode-bidi: isolate`. These rules live in **unlayered** CSS at the foot of `base.css`, because
  cascade layers outrank specificity and anything inside `@layer base` is silently overridden by
  `font-display`, `text-title-2` and `tracking-wider`. Put `lang="en"` on an element to opt out.

---

## 4. Colour system

Nine neutrals, one accent, two state colours. Contrast ratios are computed live on `/design` from
the token values, so they cannot go stale.

| Token      | Hex       | On void | Role                                       |
| ---------- | --------- | ------- | ------------------------------------------ |
| `black`    | `#000000` | —       | Page base.                                 |
| `void`     | `#08080a` | —       | First step off the base.                   |
| `obsidian` | `#101015` | —       | Raised surface.                            |
| `graphite` | `#17171d` | —       | Interactive surface: inputs, hovered rows. |
| `slate`    | `#23232c` | —       | Solid borders, field chrome.               |
| `steel`    | `#3a3a46` | —       | Disabled state, strong dividers.           |
| `ash`      | `#7c7c89` | 4.86:1  | Tertiary text, metadata.                   |
| `fog`      | `#a9a9b4` | 8.60:1  | Secondary text.                            |
| `bone`     | `#ece9e2` | 16.50:1 | Primary text.                              |
| `paper`    | `#faf8f4` | 18.87:1 | The light room; text on accent fills.      |
| `ink`      | `#0e0e12` | —       | Text in the light room (18.21:1 on paper). |

### Rules

- **Warm off-white** — primary text is `bone`, not white. Pure white on near-black buzzes at large
  sizes and reads as unfinished.
- **Cool shadow, warm light** — neutrals shift blue as they darken and warm as they lighten. This is
  what gives a flat screen the impression of a graded image.
- **No tinted surfaces** — surfaces step through the neutral ramp only. A surface never takes an
  accent tint; that is what the accent wash is for, and it appears on at most one element per
  viewport.
- **State colours** — `alert` (`#ff5842`) and `positive` (`#3ad18f`) appear in forms and system
  messaging only. Never to decorate, categorise or brand.

---

## 5. Accent colours

One warm signal, taken from the logo, split into a fill and a brighter text variant.

| Token           | Hex       | Contrast                          | Role                                     |
| --------------- | --------- | --------------------------------- | ---------------------------------------- |
| `signal`        | `#d77758` | 6.67:1 on black · 2.97:1 vs paper | The **fill**. Buttons, bars, selection.  |
| `signal-bright` | `#e89b80` | 9.43:1 on black                   | The **text** variant. Links on dark.     |
| `signal-dim`    | `#8f4530` | 6.46:1 on paper                   | Pressed state; accent **text** on paper. |

The accent is the logo's terracotta, so the mark and the interface are one brand rather than two.
Being a light tone rather than a saturated one inverts the usual rule in two places, and both matter:

- **Fills carry dark labels — with one recorded exception.** Paper on `signal` is 2.97:1 and fails;
  `foreground-inverse` reaches 6.12:1. Everything that fills with the accent takes the dark label,
  _except_ `Button` variant `primary`, which carries white by brand direction — which is why it fills
  with `accent-fill` (`signal-deep`, `#b8542f`) rather than `accent`, where white reaches 4.83:1 and
  passes AA. Use `accent-fill` for any new surface that needs a light label on the accent, and
  `accent` everywhere else.
- **The fill is legible as text on the field.** At 6.67:1 on black it clears the body floor on its
  own, so `signal-bright` is a preference rather than a rescue. On paper the direction reverses and
  accent text must darken to `signal-dim`.

### Rules

- **Budget** — one or two accent moments per viewport. The accent marks the single thing that is
  live: the primary action, the active nav item, the progress line, the focus ring.
- **Per-project override** — a case study sets `--color-accent-project` from the CMS. Only the
  decorative fill role is overridable; the text variant and `accent-fill` stay the house colour, so an
  editor cannot push a link or a button label below its contrast floor.
- **On paper** — inside the light room, `signal` becomes the text colour too (5.55:1), and the
  bright variant is retired within that scope.
- **Never** — accent gradients, accent body copy, accent on accent, or the accent used to mean
  "this is important too".

---

## 6. Background system

Two rooms, four depths.

| Token            | Use                                         |
| ---------------- | ------------------------------------------- |
| `surface-sunken` | Media wells, video backdrops.               |
| `background`     | The field. Default for every section.       |
| `surface`        | Raised blocks: hovered rows, quiet panels.  |
| `surface-raised` | Inputs, menus, anything genuinely floating. |

**Grain** is the only texture: a 160px tileable fractal-noise plate at 3.5% (`overlay` blend) on the
field and 6% over photography. It sits in an `::after` pseudo-element so it never intercepts pointer
events. Applied with `data-grain` / `data-grain="media"`.

### The light room

An inversion (`[data-theme="light"]`) that redefines the entire semantic layer, so every component
underneath re-skins without a single conditional class. Paper background, ink text, grain raised to
5% to imitate paper tooth, accent dropped to the darker variant.

It is **not** a colour mode: no toggle, no preference, no `localStorage`. It appears at most once per
page, to reset the eye before a closing statement or a long reading passage.

---

## 7. Grid system

| Breakpoint | Columns | Gutter (page margin) |
| ---------- | ------- | -------------------- |
| ≥ 1024px   | 12      | up to 56px           |
| 768–1023px | 8       | fluid                |
| < 768px    | 4       | 20px                 |

- Column count lives in `--grid-columns`, so a component asks for a span and never asks which
  breakpoint it is in. Use the `.layout-grid` utility.
- **Column gap** — fluid 12 → 28px. **Page margin** — fluid 20 → 56px. Both single tokens, never a
  breakpoint ladder.
- **Widths** — `narrow` 44rem · `text` 60rem · `page` 90rem · `wide` 112rem. Editorial passages take
  `text`; everything structural takes `page`.
- **Standard spans** — headline 1–8, support 7–12, media full-bleed or 2–11. Avoid inventing new
  spans for one section.
- **Debug** — set `data-grid-overlay` on `<html>` to draw the active grid over the page.

---

## 8. Spacing scale

A 4px base for component detail (`gap-4`, `p-6`) and four fluid steps above it for layout.

| Token                  | Range       | Use                                |
| ---------------------- | ----------- | ---------------------------------- |
| `--spacing-gutter`     | 20 → 56px   | Page margin.                       |
| `--spacing-block`      | 32 → 80px   | Between groups inside a section.   |
| `--spacing-section`    | 80 → 192px  | Default section rhythm.            |
| `--spacing-section-lg` | 112 → 288px | The one breathing moment per page. |

Vertical rhythm belongs to `Section`; horizontal rhythm belongs to `Container`. Nothing else sets
either. When a section feels empty, the answer is more emptiness around less content.

---

## 9. Border radius

Structure is square.

| Token              | Value        | Use                                       |
| ------------------ | ------------ | ----------------------------------------- |
| `none`             | 0            | Sections, media, panels, tables. Default. |
| `xs`               | 2px          | Focus rings, input chrome.                |
| `sm` / `md` / `lg` | 4 / 8 / 16px | Reserved. Currently unused.               |
| `full`             | 9999px       | Buttons, tags, the cursor.                |

Media is never rounded. A rounded photograph is the fastest way to make an editorial layout look
like a dashboard.

---

## 10. Shadows & elevation

On a near-black field a drop shadow does nothing, so elevation is a hairline that catches the edge
plus an ambient shadow that only becomes visible once something is genuinely floating.

| Token    | Use                                                 |
| -------- | --------------------------------------------------- |
| `subtle` | Pressed states, thin separations.                   |
| `lifted` | Menus, dropdowns, the cursor label.                 |
| `float`  | Modals and the mobile menu only.                    |
| `glow`   | Live elements: focus, playing video, active filter. |
| `beam`   | Accent emission behind a signal-coloured element.   |

The **panel** is the only container permitted a shadow.

---

## 11. Motion principles

Five curves, seven durations, shared byte-for-byte between CSS tokens and
[`src/motion/config.ts`](../src/motion/config.ts).

| Easing         | Curve                          | Use                                       |
| -------------- | ------------------------------ | ----------------------------------------- |
| `out-expo`     | `cubic-bezier(.16,1,.3,1)`     | Entrances and reveals. The house default. |
| `out-soft`     | `cubic-bezier(.22,1,.36,1)`    | UI feedback: hovers, small state changes. |
| `in-out-quart` | `cubic-bezier(.76,0,.24,1)`    | Transitions that leave and arrive.        |
| `in-out-circ`  | `cubic-bezier(.85,0,.15,1)`    | Curtains and full-viewport wipes.         |
| `spring`       | `cubic-bezier(.34,1.56,.64,1)` | Cursor only. The one overshoot.           |

| Duration     | ms   | Use                             |
| ------------ | ---- | ------------------------------- |
| `instant`    | 120  | Colour and opacity flicks.      |
| `fast`       | 240  | Hover feedback, underline draw. |
| `base`       | 400  | Row inversion, menu items.      |
| `slow`       | 700  | Media scale, larger UI moves.   |
| `slower`     | 1100 | Section entrances.              |
| `reveal`     | 1400 | Mask reveals and text reveals.  |
| `transition` | 900  | Full page transition envelope.  |

### Rules

- **One property** — an entrance animates transform and opacity. Anything animating colour, blur,
  width and box-shadow at the same time is over-designed.
- **Distance** — masked reveals travel exactly the height of their mask. Unmasked elements travel at
  most 120px. Long travel reads as a glitch, not as grace.
- **Stagger** — 60ms base step, capped at **480ms total** across a list. Beyond that, children
  animate in batches.
- **Play once** — scroll scenes fire on the way down and stay resolved. Nothing re-animates on
  scroll-up.
- **Scrub** — scroll-linked motion always carries at least 0.5s of smoothing. A 1:1 scrub feels
  mechanical and exposes every dropped frame.
- **Parallax budget** — background 15% · midground 8% · foreground 0%. Nothing exceeds the
  background figure.
- **Direction** — reveals travel inline-start → inline-end, read from `--motion-direction`, so
  Arabic mirrors automatically instead of animating backwards.

---

## 12. Hover behaviours

Four treatments exist. A component picks one; it never combines two. All are disabled on coarse
pointers.

| #   | Treatment          | Spec                                                                                            |
| --- | ------------------ | ----------------------------------------------------------------------------------------------- |
| 01  | **Underline draw** | 1px rule, 240ms out-expo, drawn from inline-start. Every inline and navigational link.          |
| 02  | **Row inversion**  | Paper fill wipes across the row, 400ms in-out-quart, text flips to ink. The list-row primitive. |
| 03  | **Media scale**    | Image scales to 1.04 inside a fixed mask, 700ms out-expo. The container never moves.            |
| 04  | **Magnetic pull**  | Strength 0.35, radius 120px, fine pointers only. At most one element per viewport.              |

---

## 13. Cursor behaviours

A custom cursor earns its place only if it says something the page cannot.

| State         | Size | Appearance                                          |
| ------------- | ---- | --------------------------------------------------- |
| `default`     | 8px  | Solid dot, `mix-blend-mode: difference`, lerp 0.16. |
| `interactive` | 48px | Hollow 1px ring over links and buttons.             |
| `media`       | 88px | Filled disc with a `VIEW` / `عرض` label.            |
| `drag`        | 88px | Filled disc with a `DRAG` label in carousels.       |

- **Off switch** — disabled on touch pointers, under reduced motion, and inside text inputs, where
  the native caret always wins.
- **Keyboard** — the moment a Tab keypress is detected the custom cursor hides and the native focus
  ring takes over.
- **Never** — trailing particles, physics tails, emoji, or hiding the native cursor without
  replacing its meaning.

---

## 14. Button system

Three variants, three sizes, one shape. Exactly one primary button per viewport; if a screen appears
to need two, one of them is a link.

| Variant     | Style                                | Use                                        |
| ----------- | ------------------------------------ | ------------------------------------------ |
| **Primary** | Accent fill, paper text, full radius | The single most important action.          |
| **Outline** | 1px strong border, full radius       | Secondary actions of equal weight.         |
| **Text**    | Underlined, offset 8px               | Tertiary. Reads as a link, behaves as one. |

| Size | Type    | Padding   | Height |
| ---- | ------- | --------- | ------ |
| `sm` | 14px    | 16 / 8px  | 32px   |
| `md` | 16–18px | 24 / 12px | 48px   |
| `lg` | 18–24px | 32 / 16px | 60px   |

Minimum touch target is 44px, so `sm` gains padding rather than height on touch devices.

**States** — rest → hover (fill shifts to bright, magnetic engages) → focus-visible (2px bright ring,
3px offset) → active (fill drops to dim, no scale) → disabled (40% opacity, pointer events off).

**Labels** — verb first, four words maximum, sentence case. Never "Learn more"; say what is on the
other side.

---

## 15. Link styles

| Context        | Treatment                                                                                                                  |
| -------------- | -------------------------------------------------------------------------------------------------------------------------- |
| **Inline**     | Bright accent text plus a 1px underline drawn from inline-start on hover, 240ms out-expo, offset 0.25em.                   |
| **Navigation** | Foreground at rest, accent on hover, persistent accent underline on the current route. Colour only — nav items never move. |
| **List row**   | The whole row is the target: inversion on hover, an arrow translating on the inline-end, metadata column stays put.        |
| **Media**      | No underline, no colour change. The cursor supplies the affordance; the caption supplies the label.                        |
| **External**   | 45° arrow glyph, `rel="noreferrer noopener"`, and the new tab announced in the accessible name.                            |

---

## 16. Card styles

**There are no cards.** A bordered rounded box with a shadow is the visual default of every template
on the internet. Three flatter containers replace it.

| Container | Anatomy                                                                          | Use                                     |
| --------- | -------------------------------------------------------------------------------- | --------------------------------------- |
| **Row**   | Full width, hairline top and bottom, index + title + metadata, inverts on hover. | Any list: work, capabilities, process.  |
| **Tile**  | Full-bleed media in a fixed mask, zero radius, no border, type beneath.          | Project grids, featured media.          |
| **Panel** | `surface-raised` with `shadow-lifted`.                                           | Menus, dialogs, mobile navigation only. |

---

## 17. Image treatment

Every image lives inside a fixed-aspect mask (`.media-mask`) and moves within it. That single rule
is what makes reveals, hovers and parallax possible without ever shifting layout.

- **Aspect ratios** — 16:9 cinematic · 4:5 portrait · 4:3 tile · 1:1 index. Four ratios, chosen per
  context, never arbitrary.
- **Reveal** — mask wipes open from the block-end over 1400ms out-expo while the image
  counter-scales from 1.06 to 1. The image is already in place; the mask is what moves.
- **Grain and vignette** — 6% grain and a 35% corner falloff on all photography, which unifies
  imagery from different shoots into one graded set.
- **Loading** — a Sanity LQIP blur stands in until decode. No spinners, no grey boxes, no layout
  shift.
- **Never** — rounded corners, borders, drop shadows, or a device mockup floating on a gradient.

---

## 18. Video treatment

| Mode         | Configuration                                                                                                                                        |
| ------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Ambient**  | Muted, looped, `playsinline`, poster required. Plays only when in view, on a fine pointer, with motion allowed and `saveData` off. One per viewport. |
| **Featured** | Poster frame plus an explicit play control, native controls once playing, audio allowed, keyboard reachable.                                         |

- **Budgets** — ambient loops ≤ 6MB and ≤ 12s at 720–1080p. Featured reels stream rather than
  preload. WebM first with an MP4 fallback.
- **Fallback** — under reduced motion, low power or a slow connection, the poster image _is_ the
  experience, and it is composed well enough to be one.

---

## 19. Scroll behaviours

- **Smoothing** — Lenis at lerp 0.1, duration 1.1s, wheel only. Touch scrolling stays native.
- **Pinning** — at most two pinned sections per page, desktop only, each with a visible progress
  indicator.
- **No jacking** — no scroll snapping, no forced section paging, no hijacked wheel deltas. Smoothing
  is the only liberty taken with the scrollbar.
- **Progress** — a 1px accent line at the top of the viewport tied to document progress. The only
  persistent chrome besides the header.
- **Anchors** — in-page anchors route through Lenis so a jump is a camera move, except under reduced
  motion, where it is an instant jump by design.

---

## 20. Loading behaviours

Loading is choreographed, not indicated. **There are no spinners and no skeletons.** A mask that has
not opened yet is the loading state.

| Moment           | Timing      | Behaviour                                                            |
| ---------------- | ----------- | -------------------------------------------------------------------- |
| **First load**   | 600–2000ms  | Void curtain, wordmark, a counter to 100. Exits with a mask-up wipe. |
| **Route change** | 450 / 600ms | Curtain wipes in, content swaps behind it, curtain wipes out.        |
| **In-page**      | 0ms         | Masks are already closed. Content opens them on arrival.             |

- The preloader holds for at least 600ms so it never flickers, and releases at 2000ms regardless of
  what is still in flight.
- Fonts use `display: swap` with metric-matched fallbacks. A visible swap is acceptable; a reflow is
  not.
- The preloader runs once per session; returning mid-session gets the route curtain.

---

## 21. Section transition rules

Sections are cut together like film.

| Boundary           | When                                                                                                |
| ------------------ | --------------------------------------------------------------------------------------------------- |
| **Cut**            | The default. Hairline, then the next index number and eyebrow.                                      |
| **Bleed**          | Full-width media spanning the boundary, next section's type overlapping it. Once or twice per page. |
| **Inversion**      | The light room. The strongest boundary available; one per page.                                     |
| **Sticky eyebrow** | A section's index and label may stick for the length of that section.                               |

**Never** — fading one background colour into another, wave dividers, angled slices, or a parallax
layer continuing across a boundary.

---

## 22. Mobile rules (< 768px)

- 4 columns, 20px gutter.
- Headlines cap at 44px; the scale never collapses below `title-3`.
- No parallax, no pinning, no custom cursor, no magnetics.
- Reveals shortened to 800ms, stagger to 40ms (set in the token layer, not per component).
- One media element per viewport; autoplay only without `saveData`.
- Touch targets ≥ 44px. Navigation is a full-screen panel with a focus trap.

Mobile is not desktop with fewer columns — it is a shorter edit of the same film.

## 23. Tablet rules (768–1023px)

- 8 columns, fluid gutter.
- Parallax allowed at half depth; pinning still off.
- No custom cursor — a coarse pointer is assumed.
- Two-column editorial layouts, media at 4:3 or 1:1.
- Landscape is treated as small desktop for layout, tablet for motion.

## 24. Desktop rules (≥ 1024px)

- 12 columns, up to 56px gutter.
- Full motion tier: pinning (≤ 2 per page), parallax, custom cursor, magnetics.
- Display type up to 112px; asymmetric spans throughout.
- Hover states are load-bearing and fully designed.
- Above 1600px the page caps at 112rem and the gutters absorb the rest.

---

## 25. Accessibility rules

Non-negotiable, and cheaper to hold than to retrofit.

- **Contrast** — body ≥ 4.5:1, large text and UI ≥ 3:1. The accent split in §5 exists to keep this
  promise.
- **Focus** — always visible, 2px bright accent, 3px offset, never removed. Focus order follows
  visual order even when the grid reorders content.
- **Reduced motion** — no transforms, no parallax, no autoplay, no curtain. Transitions collapse to
  ≤ 200ms opacity. The JS layer skips timelines entirely rather than running them fast.
- **Keyboard** — full navigation, a skip link to main, focus trapped inside the open menu, Escape
  closes it, focus returns to the trigger.
- **Media** — every asset carries alt text and an optional caption from the CMS. Decorative media is
  `aria-hidden`. Nothing flashes above 3Hz.
- **Structure** — one `h1` per page, no skipped heading levels, landmarks on every region, index
  numbers marked decorative.
- **RTL** — logical properties throughout, and motion direction read from a token, so Arabic is a
  mirror rather than a patch.

---

## 26. Performance rules

Budgets, not aspirations. Measured on a 4G, Moto G-class profile before a page is considered done.

| Metric | Budget  | Notes                   |
| ------ | ------- | ----------------------- |
| LCP    | ≤ 2.0s  | 4G, mid-tier Android    |
| INP    | ≤ 200ms | Including during scroll |
| CLS    | ≤ 0.02  | Masks reserve all media |
| JS     | ≤ 180KB | Gzipped, per route      |

- **Server first** — Server Components by default. A component becomes a client component only for
  interaction, animation or a browser API, and then only that component.
- **Three.js** — never in the shared bundle. Dynamically imported on the one or two routes that need
  it, one scene per page, with a static fallback for low-power devices.
- **Media** — hero images ≤ 200KB AVIF, ambient video ≤ 6MB, everything below the fold lazy. Widths
  come from the Sanity URL builder, never from CSS downscaling.
- **Fonts** — three families, self-hosted by `next/font`, subset to the scripts used. No runtime
  font requests, no icon fonts, no fourth family.
- **Animation cost** — transform and opacity only. `will-change` is applied on scene entry and
  removed on exit; never left on a static element.
