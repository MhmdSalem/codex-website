# CODEX TECH

The official website for CODEX TECH, a software company that builds its own
products — Codex Accreditation and Daawa — and engineers platforms,
applications and AI systems for other organisations.

Bilingual (English LTR / Arabic RTL), built for scroll-driven storytelling and
high-end motion on top of a strictly static rendering path.

**Status: launch-ready.** Home, Services, Products, Contact, Company, Pricing
and Privacy carry final copy in both languages, and the enquiry form posts to a
Server Action. What stands between this and a live site is configuration rather
than code — see [Before launch](#before-launch).

Copy lives in `messages/en.json` and `messages/ar.json`, not in the CMS. Sanity
is wired and remains an optional override: where a document exists its fields
win, and where it does not the translated copy is used. Nothing on the site
depends on the CMS being connected.

---

## Stack

| Concern         | Choice                                                  |
| --------------- | ------------------------------------------------------- |
| Framework       | Next.js 16 (App Router, Turbopack, React 19)            |
| Language        | TypeScript 5.9 (strict, `noUncheckedIndexedAccess`)     |
| Styling         | Tailwind CSS v4 (CSS-first `@theme`) + CSS Modules      |
| Scroll & motion | GSAP 3.15 + ScrollTrigger + SplitText, Lenis, Motion    |
| CMS             | Sanity 6 + next-sanity 13, Studio embedded at `/studio` |
| i18n            | next-intl 4 (`/en`, `/ar`)                              |
| Validation      | Zod 4                                                   |
| Quality         | ESLint 9 (flat config) + Prettier 3                     |

Three.js and React Three Fiber are **not** installed. `src/scenes/` is reserved
for them and they will be added — dynamically imported, per-page — only when a
scene actually needs one.

---

## Getting started

```bash
npm install
cp .env.example .env.local   # optional; the site runs without it
npm run dev
```

Open <http://localhost:3000> — you will be redirected to `/en`.
The Studio lives at <http://localhost:3000/studio>.

### Commands

| Command                  | What it does                             |
| ------------------------ | ---------------------------------------- |
| `npm run dev`            | Development server                       |
| `npm run build`          | Production build                         |
| `npm run start`          | Serve the production build               |
| `npm run lint`           | ESLint                                   |
| `npm run lint:fix`       | ESLint with autofix                      |
| `npm run typecheck`      | `tsc --noEmit`                           |
| `npm run format`         | Prettier write                           |
| `npm run format:check`   | Prettier check                           |
| `npm run verify`         | lint + typecheck + build                 |
| `npm run sanity:schema`  | Extract the schema for type generation   |
| `npm run sanity:typegen` | Generate types from the extracted schema |

---

## Environment variables

Copy `.env.example` to `.env.local`. **None of them are required to run or
build the site** — without a Sanity project every CMS read resolves to `null`
and pages fall back to placeholder content.

| Variable                         | Required for           | Notes                                                                    |
| -------------------------------- | ---------------------- | ------------------------------------------------------------------------ |
| `NEXT_PUBLIC_SITE_URL`           | Correct canonical URLs | Absolute origin, no trailing slash. Defaults to `http://localhost:3000`. |
| `NEXT_PUBLIC_SANITY_PROJECT_ID`  | All CMS content        | From <https://www.sanity.io/manage>.                                     |
| `NEXT_PUBLIC_SANITY_DATASET`     | All CMS content        | Defaults to `production`.                                                |
| `NEXT_PUBLIC_SANITY_API_VERSION` | All CMS content        | Pin a date; never `vX`.                                                  |
| `SANITY_API_READ_TOKEN`          | Draft preview          | Viewer token with draft read access. Server only.                        |
| `SANITY_REVALIDATE_SECRET`       | Publish → live updates | Shared secret for the revalidation webhook.                              |
| `SANITY_PREVIEW_SECRET`          | Draft preview links    | Guards `/api/draft/enable`.                                              |
| `NEXT_PUBLIC_CONTACT_EMAIL`      | A different address    | Only to override the one in `src/content/contact.ts`.                    |
| `NEXT_PUBLIC_CONTACT_PHONE`      | The contact page       | No default. Omitted entirely when unset.                                 |
| `NEXT_PUBLIC_CONTACT_WHATSAPP`   | The contact page       | Digits only, with country code, no `+`.                                  |
| `RESEND_API_KEY`                 | Delivering enquiries   | From <https://resend.com/api-keys>. Server only.                         |
| `CONTACT_SENDER`                 | Delivering enquiries   | A verified sender on your Resend domain.                                 |
| `CONTACT_RECIPIENT`              | A different inbox      | Where enquiries arrive. Falls back to the public address.                |

Contact details resolve CMS first, environment second, and the values in
`src/content/contact.ts` last. The email address and the social accounts live
there because they are the same on every environment; phone and WhatsApp have no
default and are simply not shown until one exists.

### Before launch

1. **Set `RESEND_API_KEY` and `CONTACT_SENDER`.** Until then the form validates
   and then reports honestly that it could not send — it never claims a success
   it did not have, and it offers the address instead.
2. **Set `NEXT_PUBLIC_SITE_URL`** to the real origin. Canonicals, hreflang, the
   sitemap and `robots.txt` are all derived from it, and while it points at
   localhost `robots.txt` disallows everything.

### Connecting Sanity

1. Create a project at <https://www.sanity.io/manage> and note the project ID.
2. Put the ID and dataset in `.env.local`.
3. Run `npm run dev` and open `/studio`. The schema deploys on first load.
4. Create the four singletons (Site settings, Homepage, About, Contact). They
   are pinned in the Studio sidebar and cannot be duplicated or deleted.
5. Add a webhook: **API → Webhooks → Create**, URL `https://<your-domain>/api/revalidate`,
   method `POST`, header `x-revalidate-secret: <SANITY_REVALIDATE_SECRET>`, and
   projection `{ "_type": _type, "slug": slug.current, "key": key }`.

---

## Project structure

```
messages/            UI strings (not CMS content) — en.json, ar.json
sanity/
  env.ts             Re-exports validated env for Studio and CLI
  lib/               client, image builder, fetch wrapper, cache tags
  queries/           GROQ fragments and queries
  schemas/           documents/, objects/, locale/, utils/
  structure.ts       Studio sidebar
  types.ts           Hand-written result types for the queries
src/
  app/
    [locale]/        All public pages + loading, error, not-found
    studio/          Embedded Sanity Studio (own root layout)
    api/             draft mode, revalidation webhook
    sitemap.ts robots.ts global-error.tsx globals.css
  components/
    layout/          Header, Footer, LocaleSwitcher, SkipLink
    ui/              Container, Section, Button, Eyebrow, PageHeader…
    media/           SanityImage, LazyVideo
    sections/        Homepage sections + the registry that orders them
    forms/           ContactForm
    products/        Product line art
    providers/       SmoothScrollProvider
  content/           catalog.ts (service/product/process ids), contact.ts
  experience/        hero/ (the canvas ecosystem), prologue/ (the film)
  i18n/              routing, navigation, request config, route map
  lib/               env, fonts, seo, links, content, utils
  motion/            GSAP setup, config, variants, hooks
  styles/            tokens.css, base.css
  scenes/            Reserved for Three.js
  types/             Ambient declarations
  proxy.ts           Locale negotiation (Next 16's renamed middleware)
```

Path aliases: `@/*` → `src/*`, `@cms/*` → `sanity/*`.

---

## Design system

The visual language is documented in three places, in increasing depth:

| Document                                         | Answers                                            |
| ------------------------------------------------ | -------------------------------------------------- |
| [`docs/design-system.md`](docs/design-system.md) | What the rules are — all 26 systems.               |
| [`docs/moodboard.md`](docs/moodboard.md)         | What it should feel like, and what to shoot.       |
| [`docs/design-bible.md`](docs/design-bible.md)   | Why each decision was made, and what was rejected. |

Run `npm run dev` and open **[/design](http://localhost:3000/design)** for the
live reference: every token rendered as a specimen, with contrast ratios
computed from the token values at build time. It is excluded from the sitemap,
`robots.txt` and locale routing, so it never reaches production traffic.

`src/styles/tokens.css` is the single source of truth. Every value is declared
once inside `@theme` and is therefore available both as a Tailwind utility and
as a CSS custom property in CSS Modules.

The default Tailwind color palette is cleared on purpose — if a color is not in
the token file, it cannot be used. Tokens cover color, the fluid type scale,
tracking, leading, spacing, containers, breakpoints, radius, shadows, easing,
motion durations, stagger steps, the z-index ladder and grid.

The type scale is fluid via `clamp()` between roughly 360px and 1920px, so
there are no typography breakpoints to maintain.

**Typefaces:** Space Grotesk (display), Inter Tight (text), IBM Plex Sans
Arabic (Arabic). All self-hosted through `next/font`.

Two details worth knowing before writing a component:

- **The accent is split.** `--color-accent` fills, `--color-accent-text`
  writes. The fill colour is 3.4:1 on the field and fails body-text contrast by
  design; the text variant clears 5.27:1. Never substitute one for the other.
- **The light room is a scope, not a mode.** `[data-theme="light"]` redefines
  the semantic layer, so every utility underneath re-skins with no conditional
  classes. There is no theme toggle and no `prefers-color-scheme` switch.

### Right-to-left

Direction is structural, not patched on. Layout uses logical properties
(`margin-inline`, `inset-inline`, `text-start`) throughout, and `dir` is set
from the locale on `<html>`. `src/styles/base.css` handles the typographic
differences that direction alone cannot: the Arabic font stack, looser leading,
and suppression of uppercase and letter-spacing, which are meaningless in
Arabic script.

---

## Motion architecture

The split is deliberate:

- **GSAP** owns anything tied to scroll position or a timeline — ScrollTrigger
  scenes, pinning, parallax, text reveals.
- **Motion** owns component-level state — enter/exit, layout, interaction.
- **Lenis** owns the scroll position itself, stepped from GSAP's ticker so
  ScrollTrigger stays in sync. Two independent rAF loops cause visible jitter.

`useGsapScope` wraps every scene in a `gsap.context`, so tweens and triggers are
reverted on unmount and on dependency change — safe across client-side
navigation and Strict Mode double-invokes.

`useMotionCapability` is the single source of truth for how much motion is
appropriate: it reads `prefers-reduced-motion`, pointer coarseness and CPU
cores, and returns a tier. Scenes are skipped entirely under reduced motion,
which is why **server-rendered markup must always be the final visual state** —
animations reveal _from_ a hidden state, never _to_ one.

---

## Dashboard (Sanity Studio)

The content dashboard is the embedded Sanity Studio at `/studio`. Every page reads
the dashboard first and the message catalogue second, field by field, so the
site is complete before a single document is published and nothing an editor
leaves empty shows up as a hole.

What an editor controls:

| Dashboard item | What it changes on the site                                                                    |
| -------------- | ---------------------------------------------------------------------------------------------- |
| Site settings  | Contact email, phone, WhatsApp, address, company registry, social links, menus                 |
| Homepage       | Every scene's text: opening, the four lines, products, services, how we work, company, closing |
| Products       | Name, tag, summary, long description, who it is for, five features (per product)               |
| Services       | Name, summary, long description, what it includes (per service)                                |
| About page     | Intro, three story paragraphs, milestones, principles                                          |
| Pricing page   | Text, starting price per service, the three ways of working                                    |
| Contact page   | Heading and intro                                                                              |
| Legal pages    | Privacy, delivery and refund policies                                                          |

### Connecting it

1. Create a project at <https://www.sanity.io/manage> (the free plan is enough)
   with a dataset called `production`.
2. In the project's **API → CORS origins**, add `http://localhost:3000`,
   `http://localhost:3001` and the production site URL, each with credentials
   allowed.
3. Copy the project id into `.env.local` as `NEXT_PUBLIC_SANITY_PROJECT_ID` (and
   into the hosting provider's environment variables).
4. Create a token with **Editor** rights under **API → Tokens**, put it in
   `.env.local` as `SANITY_API_WRITE_TOKEN`, and run:

   ```bash
   npm run sanity:seed
   ```

   This fills the dashboard with the site's current Arabic and English copy, so
   editing starts from the real text. Re-run with `-- --overwrite` to reset.

5. Open `/studio`, sign in with the Sanity account, and edit. Publishing a
   document updates the site within the hour, or immediately once the
   revalidation webhook (`/api/revalidate`) is configured with
   `SANITY_REVALIDATE_SECRET`.

The Studio shows a loading spinner forever when no project id is set: that is
the only symptom of a missing `NEXT_PUBLIC_SANITY_PROJECT_ID`.

## Content model

Localization is **field-level**: one document holds every language. A `Project`
has `name.en` and `name.ar` but a single slug, cover image, sort order and set
of references, so translations can never drift apart structurally. Languages are
declared once in `sanity/schemas/locale/languages.ts`; the `localeString`,
`localeText` and `localePortableText` types are generated from that list.

Queries resolve the language server-side, so components receive plain strings:

```groq
"name": select($locale == "ar" => coalesce(name.ar, name.en), name.en)
```

GROQ cannot look up an object attribute from a variable — `name[$locale]` is not
dynamic property access — so `loc()` in `sanity/queries/fragments.ts` generates
one `select()` branch per language.

### What editors control

Content, media, ordering, section visibility, navigation, SEO fields, contact
details, social links and calls to action. The homepage **Composition** tab is a
draggable list of section toggles.

### What editors do not control

Animation, layout and art direction. The section registry in
`src/components/sections/registry.ts` is the contract between the CMS keys and
the components; an unknown key is ignored rather than crashing the page.

---

## Rendering and caching

Every page is prerendered as static HTML in both locales. CMS reads go through
`sanityFetch`, which is tagged and revalidated on demand by the webhook, with a
one-hour ISR fallback.

Two constraints keep it that way, and both are easy to break:

1. **`setRequestLocale(locale)` must be called** at the top of every page and
   the locale layout, before any translation call.
2. **`loading.tsx` and `not-found.tsx` must not resolve translations on the
   server.** They belong to every route in the segment and render before the
   layout body, so a server-side lookup falls back to reading request headers
   and drags the entire segment into dynamic rendering. Both are Client
   Components that read from `NextIntlClientProvider` instead.

After changing anything in the `[locale]` tree, run `npm run build` and confirm
the route table still shows `●` (SSG) rather than `ƒ` (Dynamic).

---

## Accessibility

Skip link, visible focus rings on `:focus-visible`, semantic landmarks,
`aria-current` on the active nav item, Escape-to-close and `aria-expanded` on
the menu, `role="group"` on the language switcher, and a full
`prefers-reduced-motion` path in both CSS and JS.

---

## The prologue

`src/experience/prologue` holds **THE FIRST LINE**, the opening film that plays
once per session on the homepage. The full shooting script — concept, all seven
scenes, every transition and the reason each animation exists — is in
[`docs/prologue.md`](docs/prologue.md).

Three things about it are worth knowing before touching the code:

1. **Time and scroll advance the same playhead.** The film plays itself at 1× and
   scrolling adds an eased boost on top, so a passive viewer sees the full
   ~22 seconds and anyone who scrolls fast-forwards. The playhead is monotonic.
2. **Scenes animate numbers, not DOM.** A scene is a pure function returning a
   GSAP timeline that tweens the shared `StageState`; the layers read those
   numbers each frame and own the unit conversion. Adding a scene means writing a
   builder, registering it in `scenes/index.ts`, and flipping `enabled` in
   `config.ts`.
3. **The film is an overlay, not a gate.** The homepage renders underneath it in
   full and is marked `inert` while it runs. It is skipped entirely under reduced
   motion, never runs twice in a session, and never runs in a background tab.

While the film is incomplete, the last built scene holds instead of ejecting the
visitor — a partial build leaves only on an explicit scroll or skip.

**Built:** Scene 01 (Void). **Next:** Scene 02 (Sketch).

---

## What is not built yet

Nothing here blocks the launch; each is held back because it needs material that
does not exist yet rather than because it is hard.

- **Work / case studies.** The route and the CMS model exist, but there are no
  published projects, so `/work` is `noindex` and absent from the navigation and
  the sitemap. Adding the first project to `primaryNavigation` in
  `src/i18n/routes.ts` restores all three at once.
- **The prologue film.** Scene 01 (Void) is built; scenes 02–07 and the sound
  design are not. It is an overlay that plays once per session and holds on the
  last built scene, so a partial film is safe to ship. See
  [`docs/prologue.md`](docs/prologue.md).
- **A default Open Graph image.** Pages fall back to no image rather than a
  wrong one.
- **Page transitions, the custom cursor, Three.js scenes** and Portable Text
  rendering for long-form CMS copy.
- **`/plan-b` and `/prototype/story-core`** are concept builds kept for
  reference. Both are `noindex` and disallowed in `robots.txt`.

The design system specifies all of those. Nothing above should be built without
reading [`docs/design-system.md`](docs/design-system.md) first.
