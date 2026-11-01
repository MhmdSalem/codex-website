# CODEX TECH — Design Bible

**Version 1.0 · Phase 2 · The reasoning**

The [design system](./design-system.md) states the rules. This document defends them.

Every entry follows the same shape: the **decision**, the **reason**, the **alternative that was
rejected**, and the **consequence** — the thing that becomes harder or impossible because of the
choice. A rule with no consequence is not a rule; it is a preference.

Read this before overriding anything. If you disagree with a decision after reading the reason,
change the token and update the entry. Do not work around it in a component.

---

## Part I — The concept

### Why "a dark room drawn in light"

**Decision.** The organising metaphor is a screening room containing an engineering drawing: a
black field, visible structure in hairlines and monospace annotation, and one warm accent — the
logo's terracotta — that behaves like a light source.

**Reason.** CODEX TECH has a genuine tension to express. The company builds precise, systematic,
tested things, and it sells them on how they _feel_. A purely technical aesthetic would undersell
the craft; a purely cinematic one would undersell the engineering. The metaphor forces both into
every composition: the drawing supplies authority, the light supplies atmosphere.

It also solves the differentiation problem directly. Traditional software companies communicate
through diagrams of infrastructure. Creative studios communicate through spectacle. Doing both, in
one frame, is a position neither occupies.

**Rejected.** A bright, editorial, paper-white system in the vein of a design magazine. It is easier
to make accessible and cheaper to run, but it is also the single most common look in the studio
category right now, and it makes photography and video look like content rather than experience.

**Consequence.** Dark backgrounds constrain the palette hard: contrast must be engineered rather
than assumed, imagery must be graded to match, and any client asset that arrives on a white
background will look wrong until it is treated. That cost is accepted and budgeted for in the image
rules.

### Why six principles and not twenty

**Decision.** The philosophy is six statements, each of which resolves a real argument.

**Reason.** A principle is only useful if it can settle a disagreement. "Be bold" cannot. "One
extreme move per section" can — it tells you which of two good ideas to cut. Six is roughly the
number a team can hold in working memory during a review.

**Rejected.** A longer values list. Longer lists are read once and never used, and they always
contain at least one principle that contradicts another.

**Consequence.** Some decisions genuinely are not covered. The system prefers that to the illusion
of coverage; an uncovered case gets escalated instead of silently resolved by a vague principle.

---

## Part II — Colour

### Why the base is black (revised)

**Decision.** `--color-background` is `#000000`. `void` (`#08080a`) stays in the palette as the first
step of the surface ladder rather than as the page base.

**Reason.** Brand direction: the identity specifies pure black, and the hero is built around a light
source rising out of it. True black is the only ground that lets the core of that scene read as
_emitting_ rather than as a bright patch on a grey field.

This reverses the original Phase 2 decision, which set the base to `#08080a` on the grounds that true
black clips on OLED and leaves overlaid elements nowhere to sit _behind_. That concern was real but
was solved in the wrong place. Depth comes from the ladder above the base — `void`, `obsidian`,
`graphite`, `slate` — and that ladder is intact and now has one more step below it, not one fewer.
Lifting the base was buying separation at the cost of the darkest value in the system.

**Rejected.** (a) Keeping `#08080a` and painting only the hero black — a visible seam at the section
boundary, and two answers to "what colour is the page". (b) Black base with the whole ramp shifted
down to compensate — churn across every surface token to solve a problem the ramp does not have.

**Consequence.** Sections that relied on the base being distinguishable from `surface-sunken` (also
black) no longer are. That is correct: `surface-sunken` means "recessed to the floor", and the floor
is now the page.

### Why warm off-white text

**Decision.** Primary text is `bone` (`#ece9e2`), a warm off-white, at 16.5:1 on the field.

**Reason.** Pure white on near-black produces visible chromatic buzz at display sizes, particularly
on sub-pixel-rendered LCDs, and at 21:1 it is beyond the point of diminishing returns for
legibility. A warm off-white reads as ink on stock rather than as a screen at full brightness, which
is exactly the filmic register the concept is after.

**Rejected.** `#ffffff`, which is the default and looks it.

**Consequence.** Any pure-white asset dropped into a layout — a client logo, a UI screenshot — will
visibly not match, and needs treating.

### Why the accent is split into several colours

**Decision.** `signal` (`#d77758`) is the fill. `signal-bright` (`#e89b80`) is the text variant on
dark, `signal-dim` (`#8f4530`) the text variant on paper, `signal-deep` (`#b8542f`) the fill beneath a
white label.

**Reason.** The accent is lifted from the logo, so the mark and the interface read as one brand
instead of two — a company whose own wordmark uses a colour the product never does is telling on
itself. What that choice costs is the usual direction of the contrast rule, because the brand tone is
_light_ (relative luminance 0.28) rather than saturated:

| Pair                     | Ratio      | Verdict                            |
| ------------------------ | ---------- | ---------------------------------- |
| `paper` on `signal`      | **2.97:1** | Fails. Never do this.              |
| `white` on `signal`      | **3.15:1** | Fails as text. Why `signal-deep`.  |
| `ink` on `signal`        | **6.12:1** | The correct dark fill label.       |
| `white` on `signal-deep` | **4.83:1** | Passes AA. The filled-button pair. |
| `signal` on black        | **6.67:1** | Legible as text on its own.        |
| `signal` on `paper`      | **2.97:1** | Fails in the light room.           |

So the split survives, but it is doing different work than it would for a saturated accent. There the
fill is too dark to be text; here it is too light to carry light text. Both are the same underlying
constraint — one colour cannot sit at both ends of a luminance range — and both are settled in the
token layer rather than by asking designers to remember.

**Rejected.** (a) Keeping the electric blue and treating the logo as a separate mark — this is the
inconsistency the change exists to remove. (b) Replacing the brand tone everywhere with something deep
enough for white text — it passes, and the interface is no longer the logo's colour, which defeats the
point. (c) Light text on the accent with a note to "use it at large sizes only" — a rule with no
enforcement, which lasts about three sprints.

**Amended — filled buttons carry white on a deeper tone.** The brand direction specifies a white label
on the orange pill. White on `signal` is 3.15:1, so the label is legible but fails AA for text, and
option (c) was briefly in force. It has been resolved by narrowing rejected option (b) to the one place
it is needed: `signal-deep` (`#b8542f`) is the fill for anything carrying a white label, and white on
it reaches **4.83:1**. The objection to (b) was that the interface would stop being the logo's colour;
that only applied when the swap was global. Here `signal` is untouched — the mark, the canvas, the
nav dot and every text use keep the exact logo terracotta, and one button surface sits a step darker,
which at a glance reads as the same colour.

**Consequence.** There are now four tones of one hue, each pinned to a contrast job, and choosing
between them is a matter of asking what sits on top rather than what looks right. `accent-fill` is
also the one accent role an editor cannot override, for the reason in the next entry. The `/design`
page computes every ratio above from the live tokens, so if a hex changes the page contradicts itself
immediately instead of quietly going stale.

### Why editors can only override the fill

**Decision.** A case study can set `--color-accent-project`, which feeds the fill role only. The text
variant stays the house colour.

**Reason.** Per-project accent colour is a real editorial need — it lets a case study take on the
client's identity. But an editor choosing a brand colour is not choosing a contrast ratio, and any
system that lets a colour picker set link colour will eventually ship an unreadable page.

**Rejected.** Full accent override with a contrast warning in the Studio. Warnings get dismissed.

The same reasoning now excludes `accent-fill`, the filled-button tone, from the override as well. The
other fills can safely take an editor's colour _because_ they carry dark labels: whatever gets picked
is almost certainly light enough for ink to read on. A white label inverts that — the lighter the
choice, the worse it gets — so the one surface with a white label keeps the house tone.

**Consequence.** A project page with a strongly off-house accent will show two accents: the client's
on fills, the house terracotta on links and on primary buttons. In practice this reads as intentional
co-branding. An editor who expects the primary button to take the client's colour will be surprised,
and the field description in the Studio says so.

### Why `ash` was changed during Phase 2

**Decision.** The tertiary text colour moved from `#6f6f7b` to `#7c7c89`.

**Reason.** The `/design` page computes its own ratios, and it reported `ash` at **4.03:1** — below
the 4.5:1 floor for the small monospace metadata it is used for. That metadata (index numbers, years,
service tags) is a signature element of the brand, so it has to be readable. The new value clears at
4.86:1 with headroom for a future darkening of the field.

**Reason it is recorded here.** This is the argument for building the reference page as running code
rather than a static document: the specification caught its own bug on first render. Any future
change to a neutral should be validated the same way.

**Consequence.** Tertiary text sits slightly closer in value to secondary text than originally
intended. The gap is recovered with size and weight instead of luminance.

### Why there is no dark/light mode toggle

**Decision.** The light room is a section-level inversion, not a user preference. No toggle, no
`localStorage`, no `prefers-color-scheme` switch.

**Reason.** The dark field is a brand decision, not an ergonomic default. A toggle would imply the
light version is an equally considered alternative, which would mean art-directing every photograph,
every gradient and every glow twice — and the light version of a system built on emergence from
darkness is, by definition, a different system.

Keeping inversion as a compositional device instead preserves it as a tool: because it happens at
most once per page, it lands like a cut to a different film stock.

**Rejected.** A full dual-theme system. Doubles the design surface, halves the conviction.

**Consequence.** Users who strongly prefer light interfaces get a dark site. Mitigated by high
contrast (16.5:1), warm off-white type, and full reduced-motion support, which addresses the
accessibility half of the preference even where it cannot address the aesthetic half.

---

## Part III — Typography

### Why three families

**Decision.** Space Grotesk for display, Inter Tight for text, a system monospace stack for metadata.

**Reason.** Each does a job the others do badly. Space Grotesk has the geometric oddity and tight
apertures that survive being set at 112px, and looks mannered at 16px. Inter Tight has a narrow set
width that keeps 62-character lines compact — which matters because Arabic runs longer than English
for the same content, and the two layouts have to hold the same grid. The monospace stack costs zero
bytes and carries the engineering-document association more convincingly than any webfont could.

**Rejected.** A single variable family across all three roles. Cheaper and more coherent, but it
removes the two-voice contrast that the whole typographic identity rests on.

**Consequence.** Three families is at the upper limit of the performance budget. This is why the
monospace role uses system fonts and why a fourth family is explicitly forbidden.

### Why the scale has a hole in it

**Decision.** Nothing is composed between `lead` (24px) and `title-2` (48px).

**Reason.** Mid-sized type is where templates live. A 32px heading over 16px body over a rounded
card is the visual signature of every SaaS landing page built in the last decade — not because
anyone chose it, but because it is what happens when nobody chooses. Removing the middle of the
scale forces a decision on every block: is this the loud voice, or the quiet one?

**Rejected.** A complete, evenly spaced modular scale. Correct in theory, and it makes it trivially
easy to produce something that looks like everyone else.

**Consequence.** Some content genuinely wants a mid-sized heading — a long FAQ, a dense capabilities
list. Those get `title-3` plus monospace metadata to carry the hierarchy instead of size. It takes
more thought, which is the point.

### Why negative tracking scales with size

**Decision.** −0.035em at `display` easing to 0 at `body`, then +0.1em at `micro`.

**Reason.** Letter spacing is optical, not linear. At 112px, default spacing looks loose and
amateurish; at 16px, the same negative tracking destroys legibility. Every step of the scale carries
its own correction, so a designer never has to hand-track.

**Consequence.** Arabic cannot use any of it, which is why the Arabic override zeroes tracking
wholesale rather than adjusting it. That override has to be unlayered CSS: Tailwind emits the
per-step tracking as a utility, and utilities outrank anything in `@layer base` regardless of
specificity.

### Why Arabic is a different typographic argument, not a translation

**Decision.** In RTL: no uppercase, no negative tracking, leading raised to 1.28, display swapped to
IBM Plex Sans Arabic 600.

**Reason.** The Latin system builds authority from tight tracking, uppercase and crushed leading.
Arabic script has no uppercase, is damaged by letter spacing (it breaks the connected forms), and
needs more vertical room for its ascenders, descenders and diacritics. Applying the Latin rules to
Arabic produces something that is technically bilingual and visibly second-class.

The equivalent authority is reached through weight and generous leading instead — a different route
to the same feeling.

**Consequence.** The two language versions of a page will not be pixel-identical, and should not be.
Reviews should judge each against its own script's conventions.

---

## Part IV — Structure

### Why the grid is visible

**Decision.** Hairlines, index numbers and monospace metadata are exposed as design elements.

**Reason.** Most sites hide their structure and then have nothing left to look at but content and
decoration. Exposing the structure gives the page a second layer of visual interest that costs
nothing to render, scales to any content, and reinforces the engineering half of the brand. It also
makes the site legible as a system rather than a series of pages.

**Rejected.** A clean, unmarked layout. Safer, and completely anonymous.

**Consequence.** Content has to be well-organised, because the organisation is on display. A section
with a vague structure looks worse in this system than in a conventional one.

### Why 4 / 8 / 12 columns from a token

**Decision.** Column count lives in `--grid-columns` and changes at the breakpoints; components ask
for the grid, not for a breakpoint.

**Reason.** 12 divides by 2, 3, 4 and 6, which covers every editorial split. 8 on tablet keeps
halves and quarters without producing columns too narrow to hold a word. 4 on mobile is honest —
below 768px there are really only one- and two-column layouts, and pretending otherwise produces
unreadable text.

Putting the count in a token rather than in each component's class list means a future change to the
tablet grid is one line, not a repository-wide search.

**Rejected.** 12 columns at every breakpoint with components spanning more of them on mobile.
Mathematically identical, and it makes every component carry three sets of span classes.

**Consequence.** A component that needs a non-standard span at one breakpoint has to opt out of the
utility. Rare enough to be acceptable.

### Why radius is effectively zero

**Decision.** Everything structural is square. Only pills are round.

**Reason.** Rounded corners read as _soft_, _friendly_ and _safe_ — the wrong register entirely. They
also make every container look like a card, and cards are what the layout system is explicitly
avoiding. Reserving the radius for buttons means the pill shape carries a single unambiguous
meaning: **this is an action**. On a page made of squares, a pill is impossible to miss, which does
real work for accessibility as well as aesthetics.

**Rejected.** A small consistent radius (4–8px) everywhere, which is the current default of nearly
every product on the web and is the reason it reads as a default.

**Consequence.** Media with hard corners is unforgiving about composition and cropping. Fine — that
is a photography brief, not a CSS problem.

### Why there are no cards

**Decision.** Three containers — row, tile, panel — and no bordered, rounded, shadowed box.

**Reason.** The card is a solution to a problem this site does not have. Cards exist to group
heterogeneous content of unknown length into scannable units, which is a dashboard problem. An
editorial site presenting a small number of considered projects is better served by full-width rows
(which give type room to be large) and full-bleed tiles (which give imagery room to be the point).

**Rejected.** A card grid for the work index. It is what everyone does, it is fast to build, and it
makes ten excellent projects look like ten search results.

**Consequence.** Lists need real hierarchy — index number, title, metadata — because there is no box
holding them together. This is more work per item and produces a better index.

---

## Part V — Motion

### Why out-expo is the default easing

**Decision.** `cubic-bezier(.16, 1, .3, 1)` for entrances and reveals.

**Reason.** It front-loads almost all the distance and then settles over a long tail. Subjectively
this reads as _weight_: something heavy that was pushed and is now coming to rest. It is also
forgiving of frame drops, because most of the perceived movement happens in the first third, so a
stutter in the tail is nearly invisible on a slow device.

**Rejected.** Spring physics as the house default. Springs read as playful and bouncy, which is the
wrong emotional register, and they are harder to coordinate across a timeline. Spring survives in
exactly one place — the cursor — where a little overshoot reads as responsiveness rather than whimsy.

**Consequence.** Everything decelerates in a similar way, which is coherent but can feel samey if
durations are not varied. Hence seven durations rather than three.

### Why nothing re-animates on scroll-up

**Decision.** Scroll scenes use `toggleActions: "play none none none"`.

**Reason.** Re-entry animation is the most common reason an ambitious site feels cheap the second
time through. The first scroll is a performance; the second is navigation, and a reader scrolling
back to re-read something does not want it to perform again. Playing once also halves the animation
work during a fast scroll.

**Consequence.** A section scrolled past very quickly may finish its reveal off-screen and be already
resolved on return. Correct behaviour — the alternative is worse.

### Why the stagger is capped at 480ms

**Decision.** 60ms per child, total capped at 480ms; longer lists animate in batches.

**Reason.** Stagger is legibility, not decoration: it tells the eye which order to read in. Past
roughly half a second, the last item is arriving after the reader has already finished scanning, and
the effect flips from _guiding_ to _waiting_. A twelve-item list at an uncapped 60ms would take
660ms; at twenty items it becomes an animation the user watches instead of content they read.

**Consequence.** Long lists have several items arriving simultaneously. Visually this reads as
grouping, which is usually true of long lists anyway.

### Why touch scrolling is not smoothed

**Decision.** Lenis runs `syncTouch: false`. Wheel is smoothed; touch is native.

**Reason.** Native touch scrolling is driven by the compositor and is effectively perfect. Replacing
it with JavaScript interpolation adds a frame of latency to the single most frequent interaction on
mobile, in exchange for a smoothness the platform already provides. It is the most common cause of a
desktop-beautiful site feeling subtly broken on a phone.

**Rejected.** Smoothing everything for consistency. Consistency is not a user-facing benefit here.

**Consequence.** Scroll-linked animations behave slightly differently across input methods. Since
mobile drops parallax and pinning anyway, this is largely moot.

### Why the parallax budget is 15%

**Decision.** Background layers may translate at most 15% of their own height; midground 8%;
foreground 0%.

**Reason.** Parallax sells depth through relative motion, and the effect saturates early. Beyond
about 15%, the layer visibly slides rather than sits behind, the illusion breaks, and — practically —
the element has to be oversized enough to avoid revealing its edges, which wastes pixels and
bandwidth. Capping the depth caps the cost.

**Consequence.** The effect is subtle enough that some viewers will not consciously notice it. That
is the correct outcome for parallax.

### Why there are no spinners or skeletons

**Decision.** Loading is expressed as masks that have not opened yet, plus a curtain on route change.

**Reason.** A spinner communicates "something is happening but I cannot tell you what" and a skeleton
communicates "here is a fake version of your content". Both are admissions. A closed mask, by
contrast, is already correct: it reserves exact space (so CLS is zero by construction), it looks
intentional at every moment, and when the content arrives the reveal that plays is the same reveal
that would have played anyway.

**Rejected.** Skeleton screens, which are the current default and would require designing a second,
grey version of every component.

**Consequence.** Genuinely slow loads look like a page that has not started. Mitigated by the
preloader's 600ms floor and 2000ms ceiling, and by making the first paint of each section its
structure — hairline, index, eyebrow — which appears before any media.

---

## Part VI — Interaction

### Why a custom cursor at all

**Decision.** A custom cursor exists, but only carries information: a ring over interactive elements,
a labelled disc over media.

**Reason.** A custom cursor is usually pure decoration and a net accessibility loss. It earns its
place here for one reason: the media treatment removes every conventional affordance. Tiles have no
underline, no border, no hover colour shift — because adding them would undo the editorial
composition. The cursor is what restores the missing signal, and the `VIEW` / `عرض` label states the
action outright rather than implying it.

**Rejected.** Trailing particles, physics tails, morphing blobs — all decoration, all cost, all
latency on the one element that must feel instant.

**Consequence.** The cursor is load-bearing, so its failure modes matter. It is disabled on touch, on
reduced motion, in text fields, and the moment keyboard navigation is detected — and in every one of
those cases the caption beneath the media carries the label instead.

### Why hover treatments cannot be combined

**Decision.** Four treatments; a component picks exactly one.

**Reason.** Combining them is the fastest way to make an interface feel cheap. An element that
scales, glows, shifts colour and draws an underline simultaneously has no hierarchy of feedback and
costs four animated properties instead of one. One treatment per component also means hover
communicates _type_: a row inverts, media scales, links underline — so the interaction itself becomes
part of the visual language.

**Consequence.** Occasionally a component wants two. It does not get two.

### Why exactly one primary button per viewport

**Decision.** One accent-filled button visible at a time; everything else is outline or text.

**Reason.** The accent means "this is the live element". Two primary buttons make it mean nothing,
and the visitor now has a decision to make where the design should have made it for them. If a screen
genuinely needs two equal actions, both are outline and neither is primary.

**Consequence.** Some sections need the CTA moved rather than duplicated. Usually an improvement.

---

## Part VII — Enforcement

### Why the design reference is code, not a PDF

**Decision.** `/design` is a route in the application that reads the same tokens as the site, and
computes its own contrast ratios at build time.

**Reason.** A static design document starts drifting from the implementation on the first day, and
nobody notices until a review. A reference page built from the tokens cannot drift: change a hex and
the swatch changes, change a duration and the demo runs at the new speed, change a neutral and the
contrast ratio recomputes and turns red if it fails.

This is not theoretical. On its first render the page reported `ash` at 4.03:1 and the token was
corrected before a single component had been built on top of it.

**Consequence.** The reference is one more route to keep compiling, and it is excluded from the
sitemap, `robots.txt` and locale routing so it never reaches production traffic.

### Why tokens are the contract

**Decision.** Tailwind's default palette is cleared with `--color-*: initial`. If a value is not in
the token layer, it cannot be used.

**Reason.** Design systems do not fail through bad decisions; they fail through a thousand small
local overrides, each individually reasonable. Deleting the default palette turns "I'll just use
`gray-800` here" from a shortcut into a compile-time absence, which forces the conversation about
whether the token layer is missing something.

**Consequence.** Building a component occasionally requires adding a token first. That friction is
the feature.

### Why performance numbers are budgets rather than goals

**Decision.** LCP ≤ 2.0s, INP ≤ 200ms, CLS ≤ 0.02, JS ≤ 180KB gzipped per route, measured on a 4G
Moto G-class profile.

**Reason.** A goal is something you fall short of and discuss. A budget is something you are over,
and being over a budget blocks a merge. Every ambitious motion-heavy site is fast in week one and
slow at launch, because each individual addition was affordable. Naming the ceiling early makes the
trade-off explicit at the moment it is being made: this scene costs 40KB, what comes out?

The device profile matters as much as the numbers. Optimising against a developer laptop on
fibre is how sites ship at 6s LCP on the hardware most visitors actually own.

**Consequence.** Some ideas will not fit. Three.js is confined to one or two routes for exactly this
reason, and the decision about which routes those are is a design decision, not an engineering one.
