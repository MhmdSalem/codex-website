# Plan B — The Software Core

The second concept for the CODEX TECH homepage. It shares the design tokens, the
fonts, the logo and the localisation of the main site and **nothing else**: no
component here is imported by the site, and no page of the site imports anything
from this folder. Deleting `src/plan-b/` and `src/app/plan-b/` removes the
concept entirely and leaves the site untouched.

Live at `/plan-b/en` and `/plan-b/ar`. The route is `noindex` and is absent from
the sitemap, the navigation and the CMS.

## The idea

Plan A explains the company by listing what it does — six capability cards, a
services page, a products page. Every section restates the same claim in a
different noun.

Plan B has one subject: **a software core**. It appears in the first frame and it
is still there in the last. Data and systems form around it, break apart, and
reassemble. The eight scenes are eight states of the same object, so the site
reads as one continuous argument instead of eight blocks that happen to share a
colour palette.

```
01  Intro           a closed ring, the mark inside it        one core
02  The Spark       systems begin to orbit                   one idea
03  The Problem     the orbit breaks into cold fragments     the pain
04  Transformation  the fragments snap back into a lattice   the fix
05  Our Products    the core recedes to a halo behind two    the proof
06  How We Build    the core stretches into a path of four   the method
07  Living Systems  the core beats, and panels answer        the result
08  Convergence     everything falls back into the core      the invitation
```

## The rule

**There is exactly one core, and only the core layer may draw it.**

`core/CoreLayer.tsx` mounts one fixed canvas for the whole page and never
unmounts it. Scenes do not own visuals of the core, do not animate it, and do not
talk to it. They declare a target state in `timeline.ts` and the layer
interpolates between those states as the page scrolls.

This is the whole architecture, and it is what makes the concept work: because
the same particles are being re-laid-out rather than faded between, scene 3 is
visibly the wreckage of scene 2 and scene 4 is visibly its repair.

## How to change something

- **Copy** — `messages/en.json` and `messages/ar.json`, under `planB`. Wrapping a
  phrase in asterisks paints it in the accent.
- **The order of the story, or how the core behaves in a scene** — the `SCENES`
  array in `timeline.ts`. Each entry's `core` block is the state the core reaches
  at that scene's vertical centre.
- **What a state looks like** — `core/layouts.ts`, one function per mode. A mode
  is a function from a particle's index to a position, so a new mode is a new
  function and nothing else.
- **A scene's content** — `scenes/*.tsx`. Each one is a plain component inside
  `SceneShell`; none of them knows the core exists.

## Notes

- The core is a single 2D canvas: ~140 points, one link pass, one glow sprite
  reused at every size. It publishes its screen position as CSS custom
  properties so the DOM mark can sit inside it without a second render loop.
- Position is derived from the scroll offset, not from a scrubbed timeline, so
  it survives resizes, locale switches and RTL — where the whole composition
  mirrors, including the core's horizontal position.
- Under `prefers-reduced-motion` the core still follows the story, because the
  story is the page, but its internal animation is frozen: nothing moves unless
  the reader moves it.
