# Story Core — motion prototype

One scene, three states, one object that survives all three. It exists to answer
a single question before any of the site gets built: **does the software core
work as a continuous visual anchor, or does it need to be three separate
pictures?**

Live at `/prototype/story-core`. `noindex`, absent from the sitemap and the
navigation, and imported by nothing. Deleting `src/prototype/` and
`src/app/prototype/` removes it without touching the site.

## The scene

```
state 1   a small glowing core, the mark inside it, the headline
state 2   spreadsheets · WhatsApp · PDF files · emails · scattered data,
          floating around the same core, connected to nothing
   ↓      paths open, packets run inward, the plates are drawn in and dissolve
state 3   the core has become one dashboard, and the five names are inside it
```

There are no section boundaries. The three states are three regions of one
scrubbed timeline, so state two is state one with material added and state three
is that material rearranged.

## How it is built

Two systems, one source of truth.

**`stage.ts`** holds the story. `Stage` is seven numbers; `choreograph()` is the
timeline that scrubs them, written as a storyboard with times as fractions of the
scene's scroll distance. Retiming the scene means editing numbers in that one
function.

**`StoryCorePrototype.tsx`** holds the picture. A GSAP `ScrollTrigger` pins the
stage and scrubs the timeline. A render loop reads the seven numbers and draws
the core, the paths, the packets and the dust on a 2D canvas — and in the same
frame positions the five plates and the travelling mark, which are DOM.

The reason for the split: the plates and the panel are type, and type belongs in
the DOM where it stays crisp and readable. Everything that is light belongs on
the canvas. They agree with each other because one loop writes both from one set
of numbers.

### Why it reverses

Every frame is a pure function of the scroll position. There is no `onEnter`, no
`hasFired`, and nothing is animated by a clock that only runs forward — the pulse
rings are driven by `pull`, not by elapsed time, which is why they contract when
you scroll back up. Scrolling up is the transformation played backwards, not an
exit animation.

### The mark

`</>` is one element for the whole scene. It is the core's centre in state one and
the dashboard's header mark in state three, moved between them on coordinates the
render loop publishes. It is the last child of the stage on purpose: it has to
paint over the panel it flies into.

## Knobs

| What                                       | Where                                       |
| ------------------------------------------ | ------------------------------------------- |
| Pacing, and which state holds for how long | `choreograph()` in `stage.ts`               |
| Total scroll distance                      | `SCROLL_LENGTH` in `StoryCorePrototype.tsx` |
| The five fragments, and where they rest    | `FRAGMENTS` in `stage.ts`                   |
| How late a plate dissolves                 | `absorbed()` in `stage.ts`                  |
| Core size, glow, rim, packet brightness    | the `draw` function                         |
| Dust and packet counts                     | `DUST`, `DUST_LOW`, `PACKETS`               |

## Reduced motion

`prefers-reduced-motion: reduce` gets a different layout, not a degraded one: no
pin, no scrub, no loop. The stage releases into normal flow, the three states
become three blocks read top to bottom, and the canvas draws one settled frame.
The layout is keyed off the media query in CSS rather than a class the effect
adds, so nothing flashes before the JavaScript agrees.

## What this prototype does not decide

Copy, the rest of the story, the header, the products, the process. It is one
scene, and it is meant to be judged as motion.
