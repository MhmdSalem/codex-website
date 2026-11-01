import type { Metadata } from "next";

import { contrastRatio, formatRatio } from "@/lib/color";
import {
  bezier,
  durations,
  hover,
  parallaxDepth,
  staggers,
  STAGGER_MAX,
  transition,
} from "@/motion/config";

import { Chapter, Metric, Rule, Rules, Specimen, Swatch, Verdicts } from "./_parts";

export const metadata: Metadata = {
  title: "CODEX TECH — Design System",
};

/* ---------------------------------------------------------------------------
   Data
   ------------------------------------------------------------------------- */

const VOID = "#08080a";
const PAPER = "#faf8f4";
const WHITE = "#ffffff";
const INK = "#0e0e12";
const ASH = "#7c7c89";
const SIGNAL = "#d77758";
const SIGNAL_BRIGHT = "#e89b80";
const SIGNAL_DEEP = "#b8542f";
const SIGNAL_DIM = "#8f4530";

const neutrals = [
  { name: "black", value: "#000000", role: "Page base. The room the site happens in." },
  { name: "void", value: VOID, role: "First step off the base. Quiet sections." },
  { name: "obsidian", value: "#101015", role: "Raised surface. One step out of the dark." },
  { name: "graphite", value: "#17171d", role: "Interactive surface: inputs, hovered rows." },
  { name: "slate", value: "#23232c", role: "Solid borders, field chrome." },
  { name: "steel", value: "#3a3a46", role: "Disabled state, strong dividers." },
  { name: "ash", value: ASH, role: "Tertiary text, metadata.", on: VOID },
  { name: "fog", value: "#a9a9b4", role: "Secondary text, long-form support.", on: VOID },
  { name: "bone", value: "#ece9e2", role: "Primary text. Warm, never pure white.", on: VOID },
  { name: "paper", value: PAPER, role: "The light room. Text on accent fills.", on: VOID },
];

const signals = [
  {
    name: "signal",
    value: SIGNAL,
    role: "The fill, taken from the logo. Bars, dots, selection.",
    on: VOID,
    use: "ui" as const,
  },
  {
    name: "signal-bright",
    value: SIGNAL_BRIGHT,
    role: "The brighter sibling. Links and accented words on dark.",
    on: VOID,
  },
  {
    name: "signal-deep",
    value: SIGNAL_DEEP,
    role: "The fill under a white label. Filled buttons.",
    on: VOID,
    use: "ui" as const,
  },
  {
    name: "signal-dim",
    value: SIGNAL_DIM,
    role: "Pressed state, and accent text on the light room.",
    on: PAPER,
  },
];

const typeScale = [
  {
    token: "display",
    size: "44 → 112px / 0.92 / −0.035em",
    sample: "Built to move",
    cls: "text-display",
  },
  {
    token: "title-1",
    size: "36 → 72px / 0.98 / −0.03em",
    sample: "Software products",
    cls: "text-title-1",
  },
  {
    token: "title-2",
    size: "28 → 48px / 1.04 / −0.025em",
    sample: "Selected work",
    cls: "text-title-2",
  },
  {
    token: "title-3",
    size: "22 → 32px / 1.12 / −0.02em",
    sample: "Capabilities",
    cls: "text-title-3",
  },
];

const bodyScale = [
  {
    token: "lead",
    size: "18 → 24px / 1.45",
    cls: "text-lead max-w-measure-lead font-sans",
    sample:
      "We design and build digital products that behave as well as they look — and we ship them.",
  },
  {
    token: "body",
    size: "16 → 18px / 1.6",
    cls: "text-body max-w-measure-body font-sans text-muted",
    sample:
      "Body copy is set in Inter Tight and capped at 62 characters. It is the quietest voice in the system: it carries detail, never emphasis. If a paragraph needs to shout, the composition is wrong, not the type.",
  },
  {
    token: "caption",
    size: "14px / 1.5",
    cls: "text-caption text-muted max-w-measure-body font-sans",
    sample: "Captions annotate media and sit directly beneath it, never floating over it.",
  },
  {
    token: "micro",
    size: "12px / 1.4 / +0.1em",
    cls: "text-micro font-mono uppercase text-subtle",
    sample: "01 — Index · Riyadh 24°38′N · Ø Available Q3",
  },
];

const easingCurves = [
  { name: "out-expo", curve: bezier.outExpo, use: "Entrances and reveals. The house default." },
  { name: "out-soft", curve: bezier.outSoft, use: "UI feedback: hovers, small state changes." },
  { name: "in-out-quart", curve: bezier.inOutQuart, use: "Transitions that leave and arrive." },
  { name: "in-out-circ", curve: bezier.inOutCirc, use: "Curtains and full-viewport wipes." },
  { name: "spring", curve: bezier.spring, use: "Cursor only. The one overshoot in the system." },
];

const spacingSteps = [
  { name: "--spacing-gutter", value: "20 → 56px", css: "var(--spacing-gutter)" },
  { name: "--spacing-block", value: "32 → 80px", css: "var(--spacing-block)" },
  { name: "--spacing-section", value: "80 → 192px", css: "var(--spacing-section)" },
  { name: "--spacing-section-lg", value: "112 → 288px", css: "var(--spacing-section-lg)" },
];

function curvePath([x1, y1, x2, y2]: readonly [number, number, number, number]) {
  return `M 0 100 C ${x1 * 100} ${100 - y1 * 100}, ${x2 * 100} ${100 - y2 * 100}, 100 0`;
}

/** Widen the frame so an overshooting control point is not clipped. */
function curveViewBox([, y1, , y2]: readonly [number, number, number, number]) {
  const points = [0, 100, 100 - y1 * 100, 100 - y2 * 100];
  const top = Math.min(...points) - 8;
  const bottom = Math.max(...points) + 8;
  return `-8 ${top} 116 ${bottom - top}`;
}

/* ---------------------------------------------------------------------------
   Page
   ------------------------------------------------------------------------- */

export default function DesignSystemPage() {
  return (
    <main className="pb-section">
      <style
        dangerouslySetInnerHTML={{
          __html: `@keyframes ds-travel{0%,12%{transform:translateX(0)}72%,100%{transform:translateX(calc(100% - 1.5rem))}}
.ds-runner{animation:ds-travel 2.6s infinite}`,
        }}
      />

      {/* ── Masthead ─────────────────────────────────────────────────── */}
      <header
        data-grain
        className="relative flex min-h-svh flex-col justify-between border-b border-hairline px-gutter py-block"
      >
        <div className="flex items-baseline justify-between font-mono text-micro tracking-wider">
          <span>CODEX TECH</span>
          <span className="text-subtle">Design System v1.0 · Internal</span>
        </div>

        <div className="max-w-wide">
          <p className="font-mono text-micro tracking-wider text-accent-text">The concept — 01</p>
          <h1 className="mt-6 text-display uppercase">
            A dark room
            <br />
            drawn in light
          </h1>
          <p className="mt-block max-w-measure-lead text-lead text-muted">
            Everything CODEX TECH makes is engineered and everything it shows is cinematic. The
            visual system holds that tension on purpose: an unlit black field, a visible structural
            grid, and a single warm signal — the logo&rsquo;s terracotta — that behaves like a light
            source. Content is not placed on the page. It is revealed on it.
          </p>
        </div>

        <div className="grid gap-2 font-mono text-micro tracking-wider text-subtle sm:grid-cols-3">
          <span>26 systems</span>
          <span>2 rooms · 1 accent</span>
          <span>Tokens are the contract</span>
        </div>
      </header>

      {/* ── 01 Philosophy ────────────────────────────────────────────── */}
      <Chapter
        index="01"
        title="Design philosophy"
        summary="Six principles. Every later rule in this document is one of these six applied to a specific surface, and any decision not covered here should be resolved by asking which principle is at stake."
      >
        <ol className="grid gap-px md:grid-cols-2 xl:grid-cols-3">
          {[
            [
              "Contrast, not decoration",
              "Hierarchy is built from scale, weight, and emptiness. If an element needs a border, a card, or a gradient to be legible as a unit, the layout has already failed.",
            ],
            [
              "The structure is the ornament",
              "Hairlines, index numbers and monospace metadata are visible on purpose. The site should read like a drafted document — the grid is a feature, not scaffolding to hide.",
            ],
            [
              "Light is the only effect",
              "One accent, one grain plate, one vignette. No glassmorphism, no bloom, no rainbow gradients. Where the accent appears, treat it as an emitter and light the area around it.",
            ],
            [
              "Motion is editing",
              "Every animation is a cut, a wipe, or a camera move. If a motion does not reveal something, hide something, or express weight, it gets deleted before launch.",
            ],
            [
              "One extreme move per section",
              "A section may be enormous, or pinned, or inverted, or in 3D. It may not be two of those. Restraint is what makes the one move land.",
            ],
            [
              "The token is the contract",
              "No component invents a colour, a duration, or a spacing value. If a design needs something the token layer does not have, the token layer changes first.",
            ],
          ].map(([title, body], i) => (
            <li key={title} className="flex flex-col gap-3 bg-surface p-6">
              <span className="font-mono text-micro tracking-wider text-accent-text">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="text-title-3">{title}</h3>
              <p className="text-caption text-muted">{body}</p>
            </li>
          ))}
        </ol>
      </Chapter>

      {/* ── 02 Visual language ───────────────────────────────────────── */}
      <Chapter
        index="02"
        title="Visual language"
        summary="The vocabulary a page is assembled from. A layout that uses only these elements will look like CODEX TECH even before the content arrives."
      >
        <Rules>
          <Rule label="Field">
            Near-black, edge to edge. Sections do not sit on the background as panels; they occupy
            it. Backgrounds change by inversion, never by tint.
          </Rule>
          <Rule label="Hairline">
            A 1px rule at 8% foreground is the primary structural mark. It opens sections, brackets
            metadata, and separates rows. It replaces every box the system does not draw.
          </Rule>
          <Rule label="Index">
            Monospace numbering (01 / 02 / 03) runs alongside sections, projects and process steps.
            It is the single most recognisable signature of the brand.
          </Rule>
          <Rule label="Two voices">
            Confident display type and tiny technical metadata, with as little as possible in
            between. Confident, not monumental — headlines stay readable. Mid-sized headings are
            what make a site look like a template.
          </Rule>
          <Rule label="Asymmetry">
            Compositions are weighted, not centred. Content sits on columns 1–7 or 6–12; full-width
            centred blocks are reserved for the single closing statement on a page.
          </Rule>
          <Rule label="Bleed">
            Media breaks the gutter deliberately and completely — either it aligns to the grid or it
            runs to the viewport edge. Nothing overhangs by a few pixels.
          </Rule>
          <Rule label="Grain">
            A single fractal-noise plate at 3.5% over the field, 6% over photography. It is what
            keeps a flat near-black from looking like an empty div.
          </Rule>
        </Rules>

        <Verdicts
          always={[
            "Let the grid show",
            "Crop type with masks rather than shrinking it",
            "Use emptiness as a compositional element",
            "Keep one focal point per viewport",
          ]}
          never={[
            "Rounded card grids as a default layout",
            "Decorative gradients or glass panels",
            "Server rooms, circuit boards, abstract network graphics",
            "Two competing accents in one viewport",
          ]}
        />
      </Chapter>

      {/* ── 03 Typography ────────────────────────────────────────────── */}
      <Chapter
        index="03"
        title="Typography scale"
        summary="Space Grotesk speaks, Inter Tight explains, and a monospace stack annotates. Every step is fluid between 360px and 1920px, so there are no breakpoint jumps in type — only in layout."
      >
        <div className="mb-block grid gap-px md:grid-cols-3">
          {[
            [
              "Space Grotesk",
              "Display · 500",
              "Headlines at title-3 and above. Tracked tight, cropped by masks, never justified.",
            ],
            [
              "Inter Tight",
              "Text · 400/500",
              "Body, UI, buttons. Chosen for a narrow set width that survives long Arabic-parity line lengths.",
            ],
            [
              "Mono stack",
              "Metadata · 400",
              "Index numbers, eyebrows, labels, timestamps. System fonts only — zero bytes.",
            ],
          ].map(([name, role, note]) => (
            <div key={name} className="bg-surface p-6">
              <p className="text-title-3">{name}</p>
              <p className="mt-2 font-mono text-micro tracking-wider text-accent-text">{role}</p>
              <p className="mt-4 text-caption text-muted">{note}</p>
            </div>
          ))}
        </div>

        {typeScale.map((step) => (
          <Specimen key={step.token} token={step.token} size={step.size}>
            <p className={`${step.cls} font-display`}>{step.sample}</p>
          </Specimen>
        ))}

        {bodyScale.map((step) => (
          <Specimen key={step.token} token={step.token} size={step.size}>
            <p className={step.cls}>{step.sample}</p>
          </Specimen>
        ))}

        <Specimen token="arabic" size="IBM Plex Sans Arabic · 600 / 500">
          <div dir="rtl" lang="ar" className="space-y-4">
            <p className="font-arabic text-title-1">منتجات ومنصات برمجية</p>
            <p className="max-w-measure-body font-arabic text-body text-muted">
              النص العربي لا يُكتب بحروف كبيرة ولا يُضغط تباعده. تُزاد المسافة بين السطور بنسبة
              ثمانية بالمئة، ويُستبدل خط العرض بخط عربي مكافئ، وتُعكس اتجاهات الحركة تلقائيًا.
            </p>
          </div>
        </Specimen>

        <Rules>
          <Rule label="Measure">
            Display 24ch, lead 46ch, body 62ch. Enforced with the `max-w-measure-*` utilities, not
            by eye.
          </Rule>
          <Rule label="Ceiling">
            `display` is the largest step and page headlines sit at `title-1` or `title-2`. There is
            no hero size: this is a software company, and headlines are for reading.
          </Rule>
          <Rule label="Optical tracking">
            Negative tracking scales with size: −0.035em at display down to 0 at body, then +0.1em
            at micro. Never track display type positively.
          </Rule>
          <Rule label="Case">
            Uppercase is reserved for the largest display type and micro metadata. Titles are
            sentence case.
          </Rule>
          <Rule label="Arabic">
            No uppercase, no negative tracking, leading raised to 1.28, display swapped to IBM Plex
            Sans Arabic 600. Numerals and latin fragments stay LTR inside RTL copy. These rules are
            unlayered CSS so Tailwind utilities cannot silently override them.
          </Rule>
          <Rule label="The missing middle">
            Nothing is set between lead (24px) and title-2 (48px) in composition. Pick a voice.
          </Rule>
        </Rules>
      </Chapter>

      {/* ── 04 Colour ────────────────────────────────────────────────── */}
      <Chapter
        index="04"
        title="Colour system"
        summary="Nine neutrals, one accent, two state colours. Ratios below are computed from the live token values against the page base — if a hex changes, these numbers change with it."
      >
        <div className="grid gap-x-6 gap-y-8 sm:grid-cols-3 lg:grid-cols-5">
          {neutrals.map((color) => (
            <Swatch key={color.name} {...color} />
          ))}
        </div>

        <Rules>
          <Rule label="Warm off-white">
            Primary text is `bone` (#ece9e2), not white. Pure white on near-black buzzes at large
            sizes and reads as unfinished; a warm off-white reads as printed.
          </Rule>
          <Rule label="Cool shadow, warm light">
            Neutrals shift blue as they darken and warm as they lighten, which is what gives a flat
            screen the impression of a graded image.
          </Rule>
          <Rule label="No tinted surfaces">
            Surfaces step through the neutral ramp only. A surface never takes an accent tint — that
            is what the accent wash is for, and it is used on at most one element per viewport.
          </Rule>
          <Rule label="State colours">
            `alert` and `positive` appear in forms and system messaging only. They are never used to
            decorate, categorise, or brand anything.
          </Rule>
        </Rules>
      </Chapter>

      {/* ── 05 Accent ────────────────────────────────────────────────── */}
      <Chapter
        index="05"
        title="Accent colours"
        summary="One warm signal, taken from the logo, at four lightnesses — one per contrast job. Because the brand tone is light it carries dark labels; anything that needs a white label fills with the deeper tone instead. The page below measures each pairing rather than asserting it."
      >
        <div className="grid gap-x-6 gap-y-8 sm:grid-cols-3">
          {signals.map((color) => (
            <Swatch key={color.name} {...color} />
          ))}
        </div>

        <div className="mt-block grid gap-px md:grid-cols-3">
          <div className="bg-accent p-8">
            <p className="text-title-3 text-foreground-inverse">Fill, then ink text</p>
            <p className="mt-2 text-caption text-foreground-inverse/75">
              {formatRatio(contrastRatio(INK, SIGNAL))} — the correct way to make the accent carry
              words. White on this same fill would be only{" "}
              {formatRatio(contrastRatio(WHITE, SIGNAL))}, which is why a white label gets its own
              tone rather than this one.
            </p>
          </div>
          <div className="bg-accent-fill p-8">
            <p className="text-title-3 text-white">Or deepen it and go white</p>
            <p className="mt-2 text-caption text-white/75">
              {formatRatio(contrastRatio(WHITE, SIGNAL_DEEP))} on <code>signal-deep</code>, which
              clears AA. One step darker than the logo tone, and the pair the filled button uses.
            </p>
          </div>
          <div className="bg-surface p-8">
            <p className="text-title-3 text-accent-text">Text uses the bright variant</p>
            <p className="mt-2 text-caption text-muted">
              {formatRatio(contrastRatio(SIGNAL_BRIGHT, VOID))} on the field. The fill tone reaches{" "}
              {formatRatio(contrastRatio(SIGNAL, VOID))} here, so unlike a saturated accent it is
              legible as text too — the bright variant is a preference, not a rescue.
            </p>
          </div>
        </div>

        <Rules>
          <Rule label="Budget">
            One or two accent moments per viewport. The accent marks the single thing that is live:
            the primary action, the active nav item, the progress line, the focus ring.
          </Rule>
          <Rule label="Per-project override">
            Each case study can set `--color-accent-project` from the CMS. Only the decorative fill
            role is overridable — the text variant and the filled-button tone stay the house colour
            so contrast never regresses.
          </Rule>
          <Rule label="On paper">
            The direction reverses in the light room. The fill tone is only{" "}
            {formatRatio(contrastRatio(SIGNAL, PAPER))} on paper, so accent text there darkens to{" "}
            <code>signal-dim</code> ({formatRatio(contrastRatio(SIGNAL_DIM, PAPER))}) and the bright
            variant is retired inside that scope.
          </Rule>
          <Rule label="Never">
            Accent gradients, accent body copy, accent on accent, or the accent used to mean
            &ldquo;this is important too&rdquo;.
          </Rule>
        </Rules>
      </Chapter>

      {/* ── 06 Background ────────────────────────────────────────────── */}
      <Chapter
        index="06"
        title="Background system"
        summary="Two rooms and four depths. Depth is expressed by luminance and hairlines, because a shadow cast on near-black is invisible."
      >
        <div className="grid gap-px sm:grid-cols-2 lg:grid-cols-4">
          {[
            ["surface-sunken", "bg-surface-sunken", "Media wells and video backdrops."],
            ["background", "bg-background", "The field. Default for every section."],
            ["surface", "bg-surface", "Raised blocks: hovered rows, quiet panels."],
            ["surface-raised", "bg-surface-raised", "Inputs, menus, anything genuinely floating."],
          ].map(([name, cls, role]) => (
            <div key={name} className={`${cls} border border-hairline p-6`}>
              <p className="font-mono text-micro tracking-wider">{name}</p>
              <p className="mt-3 text-caption text-muted">{role}</p>
            </div>
          ))}
        </div>

        <div className="mt-block grid gap-px md:grid-cols-2">
          <div data-grain className="relative bg-background p-8">
            <p className="font-mono text-micro tracking-wider">Grain on</p>
            <p className="mt-3 text-caption text-muted">3.5% overlay blend, 160px tile.</p>
          </div>
          <div className="bg-background p-8">
            <p className="font-mono text-micro tracking-wider">Grain off</p>
            <p className="mt-3 text-caption text-muted">Flat. Reserved for text-only sections.</p>
          </div>
        </div>
      </Chapter>

      {/* ── The light room ───────────────────────────────────────────── */}
      <Chapter
        index="06b"
        title="The light room"
        summary="An inversion used at most once per page, to reset the eye before a closing statement or a long reading passage. It is not a colour mode: there is no toggle, no preference, and no localStorage."
        theme="light"
      >
        <div className="grid gap-block lg:grid-cols-2">
          <div>
            <p className="font-mono text-micro tracking-wider text-accent-text">Inverted scope</p>
            <h3 className="mt-4 text-title-1">Paper, ink, and the same accent</h3>
            <p className="mt-6 max-w-measure-body text-body text-muted">
              The entire semantic layer is redefined inside `[data-theme=&quot;light&quot;]`, so
              every component underneath re-skins without a single conditional class. Grain rises to
              5% to imitate paper tooth, and the accent drops to its darker variant to hold contrast
              against a bright field.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <span className="rounded-full bg-accent-fill px-6 py-3 text-caption text-white">
                Primary
              </span>
              <span className="rounded-full border border-border-strong px-6 py-3 text-caption">
                Outline
              </span>
            </div>
          </div>
          <div className="border-t border-hairline pt-6">
            <Metric name="background" value={PAPER} note="Paper" />
            <Metric
              name="foreground"
              value={INK}
              note={`Ink · ${formatRatio(contrastRatio(INK, PAPER))}`}
            />
            <Metric
              name="accent-text"
              value={SIGNAL}
              note={`${formatRatio(contrastRatio(SIGNAL, PAPER))} on paper`}
            />
            <Metric name="grain" value="0.05" note="Paper tooth" />
          </div>
        </div>
      </Chapter>

      {/* ── 07 Grid ──────────────────────────────────────────────────── */}
      <Chapter
        index="07"
        title="Grid system"
        summary="Twelve columns on desktop, eight on tablet, four on mobile. The column count lives in a token, so a component asks for a span and never asks which breakpoint it is in."
      >
        <div className="layout-grid mb-block">
          {Array.from({ length: 12 }, (_, i) => (
            <div key={i} className="h-24 border-t border-accent-muted bg-accent-wash">
              <span className="block p-2 font-mono text-micro text-subtle">
                {String(i + 1).padStart(2, "0")}
              </span>
            </div>
          ))}
        </div>

        <Rules>
          <Rule label="Columns">12 ≥ 1024px · 8 at 768–1023px · 4 below 768px.</Rule>
          <Rule label="Gutter">
            Fluid 12 → 28px between columns; 20 → 56px page margin. Both are single tokens, never a
            breakpoint ladder.
          </Rule>
          <Rule label="Widths">
            narrow 44rem · text 60rem · page 90rem · wide 112rem. Editorial passages take `text`;
            everything structural takes `page`.
          </Rule>
          <Rule label="Standard spans">
            Headline 1–8, support 7–12, media full-bleed or 2–11. Avoid inventing new spans for one
            section.
          </Rule>
          <Rule label="Debug">
            Set `data-grid-overlay` on `&lt;html&gt;` to draw the active grid over the page.
          </Rule>
        </Rules>
      </Chapter>

      {/* ── 08 Spacing ───────────────────────────────────────────────── */}
      <Chapter
        index="08"
        title="Spacing scale"
        summary="A 4px base for component detail, and four fluid layout steps above it. Vertical rhythm belongs to sections; horizontal rhythm belongs to containers. Nothing else sets either."
      >
        {spacingSteps.map((step) => (
          <Metric key={step.name} name={step.name} value={step.value}>
            <div className="h-3 bg-accent" style={{ width: step.css }} />
          </Metric>
        ))}

        <Rules>
          <Rule label="Base unit">
            0.25rem. Component-level spacing uses Tailwind&apos;s numeric scale (`gap-4`, `p-6`);
            layout-level spacing uses the named fluid tokens only.
          </Rule>
          <Rule label="Section rhythm">
            `section` by default, `section-lg` for the one breathing moment per page, `block`
            between groups inside a section.
          </Rule>
          <Rule label="Whitespace is content">
            When a section feels empty, the answer is more emptiness around less content — not more
            content.
          </Rule>
        </Rules>
      </Chapter>

      {/* ── 09 Radius ────────────────────────────────────────────────── */}
      <Chapter
        index="09"
        title="Border radius"
        summary="Structure is square. The only rounded things in the system are pills, and the only reason they are rounded is to make an action read as an action at a glance."
      >
        <div className="grid gap-px sm:grid-cols-3 lg:grid-cols-6">
          {[
            ["none", "0px", "Sections, media, panels, tables. The default."],
            ["xs", "2px", "Focus rings and input chrome only."],
            ["sm", "4px", "Reserved. Currently unused."],
            ["md", "8px", "Reserved. Currently unused."],
            ["lg", "16px", "Reserved. Currently unused."],
            ["full", "9999px", "Buttons, tags, the cursor."],
          ].map(([name, value, note]) => (
            <div key={name} className="bg-surface p-5">
              <div
                className="mb-4 h-14 w-full bg-accent"
                style={{ borderRadius: `var(--radius-${name})` }}
              />
              <p className="font-mono text-micro tracking-wider">{name}</p>
              <p className="mt-1 font-mono text-micro text-subtle">{value}</p>
              <p className="mt-2 text-micro tracking-normal text-muted">{note}</p>
            </div>
          ))}
        </div>
        <p className="mt-6 max-w-measure-body text-caption text-muted">
          Media is never rounded. A rounded photograph is the fastest way to make an editorial
          layout look like a dashboard.
        </p>
      </Chapter>

      {/* ── 10 Shadows ───────────────────────────────────────────────── */}
      <Chapter
        index="10"
        title="Shadows &amp; elevation"
        summary="On a near-black field a drop shadow does nothing. Elevation is therefore a hairline that catches the edge, plus an ambient shadow that only becomes visible once an element is genuinely floating."
      >
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ["subtle", "Pressed states, thin separations."],
            ["lifted", "Menus, dropdowns, the cursor label."],
            ["float", "Modals and the mobile menu only."],
            ["glow", "Live elements: focus, playing video, active filter."],
          ].map(([name, note]) => (
            <div key={name} className="text-center">
              <div
                className="mx-auto flex h-28 items-center justify-center bg-surface-raised"
                style={{ boxShadow: `var(--shadow-${name})` }}
              >
                <span className="font-mono text-micro tracking-wider">{name}</span>
              </div>
              <p className="mt-4 text-micro tracking-normal text-muted">{note}</p>
            </div>
          ))}
        </div>
      </Chapter>

      {/* ── 11 Motion ────────────────────────────────────────────────── */}
      <Chapter
        index="11"
        title="Motion principles"
        summary="Five curves and seven durations, shared byte-for-byte between CSS and GSAP. Nothing in the system overshoots except the cursor, and nothing loops for decoration."
      >
        <div className="mb-block grid gap-px sm:grid-cols-2 lg:grid-cols-5">
          {easingCurves.map((curve) => (
            <div key={curve.name} className="bg-surface p-5">
              <svg
                viewBox={curveViewBox(curve.curve)}
                preserveAspectRatio="none"
                className="mb-4 h-28 w-full"
                aria-hidden="true"
              >
                {/* Axes, plus a guide at 100% so overshoot is legible. */}
                <path
                  d="M 0 100 L 100 100 M 0 100 L 0 0"
                  stroke="var(--color-border)"
                  fill="none"
                  vectorEffect="non-scaling-stroke"
                />
                <path
                  d="M 0 0 L 100 0"
                  stroke="var(--color-hairline)"
                  strokeDasharray="4 4"
                  fill="none"
                  vectorEffect="non-scaling-stroke"
                />
                <path
                  d={curvePath(curve.curve)}
                  fill="none"
                  stroke="var(--color-signal-bright)"
                  strokeWidth="2"
                  vectorEffect="non-scaling-stroke"
                />
              </svg>
              <p className="font-mono text-micro tracking-wider">{curve.name}</p>
              <p className="mt-2 text-micro tracking-normal text-muted">{curve.use}</p>
            </div>
          ))}
        </div>

        {(Object.entries(durations) as [string, number][]).map(([name, value]) => (
          <Metric key={name} name={name} value={`${value * 1000}ms`}>
            <div className="relative h-6 overflow-hidden bg-surface">
              <div
                className="ds-runner absolute inset-y-0 start-0 w-6 bg-accent"
                style={{ animationDuration: `${Math.max(value * 1.8, 1.2)}s` }}
              />
            </div>
          </Metric>
        ))}

        <div className="mt-block">
          <Rules>
            <Rule label="One property">
              An entrance animates transform and opacity. Anything animating colour, blur, width or
              box-shadow at the same time is over-designed.
            </Rule>
            <Rule label="Distance">
              Masked reveals travel exactly the height of their mask. Unmasked elements travel at
              most 120px. Long travel reads as a glitch, not as grace.
            </Rule>
            <Rule label="Stagger">
              {staggers.base * 1000}ms base step, capped at {STAGGER_MAX * 1000}ms total across a
              list. Beyond that, children animate in batches — the tail of a stagger should never
              arrive after the reader has moved on.
            </Rule>
            <Rule label="Play once">
              Scroll scenes fire on the way down and stay resolved. Nothing re-animates on scroll-up
              — re-entry animation is the most common reason a site feels cheap on a second pass.
            </Rule>
            <Rule label="Scrub">
              Scroll-linked motion always carries at least 0.5s of smoothing. A 1:1 scrub feels
              mechanical and exposes every dropped frame.
            </Rule>
            <Rule label="Parallax budget">
              Background {parallaxDepth.background * 100}% · midground{" "}
              {parallaxDepth.midground * 100}% · foreground {parallaxDepth.foreground}%. Nothing
              exceeds the background figure, ever.
            </Rule>
            <Rule label="Direction">
              Reveals travel from inline-start to inline-end, read from `--motion-direction`, so
              Arabic mirrors automatically instead of animating backwards.
            </Rule>
          </Rules>
        </div>
      </Chapter>

      {/* ── 12 Hover ─────────────────────────────────────────────────── */}
      <Chapter
        index="12"
        title="Hover behaviours"
        summary="Four hover treatments exist. A component picks one; it never combines two. All of them are disabled below the fine-pointer breakpoint, where hover does not exist."
      >
        <div className="grid gap-px lg:grid-cols-2">
          <div className="bg-surface p-8">
            <p className="mb-6 font-mono text-micro tracking-wider text-accent-text">
              01 · Underline draw
            </p>
            <a
              href="#top"
              className="group relative inline-block text-lead"
              style={{ transitionDuration: "var(--duration-fast)" }}
            >
              Read the case study
              <span className="absolute inset-x-0 -bottom-1 h-px origin-left scale-x-0 bg-accent-text transition-transform duration-[var(--duration-fast)] ease-out-expo group-hover:scale-x-100" />
            </a>
            <p className="mt-6 text-caption text-muted">
              240ms, out-expo, drawn from inline-start. Used for every inline and navigational link.
            </p>
          </div>

          <div className="bg-surface p-8">
            <p className="mb-6 font-mono text-micro tracking-wider text-accent-text">
              02 · Row inversion
            </p>
            <a
              href="#top"
              className="group relative block overflow-hidden border-y border-hairline py-6"
            >
              <span className="absolute inset-0 origin-left scale-x-0 bg-paper transition-transform duration-[var(--duration-base)] ease-in-out-quart group-hover:scale-x-100" />
              <span className="relative flex items-baseline justify-between gap-6 px-4 transition-colors duration-[var(--duration-base)] group-hover:text-[var(--color-ink)]">
                <span className="text-title-3">Meridian Bank</span>
                <span className="font-mono text-micro tracking-wider">2025 — Platform</span>
              </span>
            </a>
            <p className="mt-6 text-caption text-muted">
              400ms, in-out-quart. The list row is the system&apos;s replacement for the card grid.
            </p>
          </div>

          <div className="bg-surface p-8">
            <p className="mb-6 font-mono text-micro tracking-wider text-accent-text">
              03 · Media scale
            </p>
            <div className="media-mask group aspect-[16/10] cursor-none">
              <div
                className="h-full w-full transition-transform duration-[var(--duration-slow)] ease-out-expo group-hover:scale-[1.04]"
                style={{
                  background:
                    "radial-gradient(120% 100% at 20% 10%, #2b2b36 0%, #0b0b0f 60%, #08080a 100%)",
                }}
              />
            </div>
            <p className="mt-6 text-caption text-muted">
              700ms, out-expo. The image scales inside a fixed mask — the container never moves, so
              hover can never cause layout shift.
            </p>
          </div>

          <div className="bg-surface p-8">
            <p className="mb-6 font-mono text-micro tracking-wider text-accent-text">
              04 · Magnetic pull
            </p>
            <span className="inline-flex rounded-full bg-accent-fill px-8 py-4 text-body text-white">
              Start a project
            </span>
            <p className="mt-6 text-caption text-muted">
              Strength {hover.magneticStrength}, radius {hover.magneticRadius}px, fine pointers
              only. Applied to at most one element per viewport — usually the primary call to
              action.
            </p>
          </div>
        </div>
      </Chapter>

      {/* ── 13 Cursor ────────────────────────────────────────────────── */}
      <Chapter
        index="13"
        title="Cursor behaviours"
        summary="A custom cursor earns its place only if it tells you something the page cannot. Ours carries labels over media and gets out of the way everywhere else."
      >
        <div className="mb-block grid gap-px sm:grid-cols-2 lg:grid-cols-4">
          {[
            ["default", 8, "Solid dot, difference blend, lerp 0.16."],
            ["interactive", 48, "Hollow ring over links and buttons."],
            ["media", 88, "Filled disc with a VIEW / عرض label."],
            ["drag", 88, "Filled disc with a DRAG label in carousels."],
          ].map(([name, size, note]) => (
            <div key={name as string} className="flex flex-col items-center gap-4 bg-surface p-8">
              <div className="flex h-28 items-center justify-center">
                <span
                  className="rounded-full border border-foreground"
                  style={{
                    width: size as number,
                    height: size as number,
                    backgroundColor:
                      name === "default" || name === "media" || name === "drag"
                        ? "var(--color-foreground)"
                        : "transparent",
                  }}
                />
              </div>
              <p className="font-mono text-micro tracking-wider">{name as string}</p>
              <p className="text-center text-micro tracking-normal text-muted">{note as string}</p>
            </div>
          ))}
        </div>

        <Rules>
          <Rule label="Off switch">
            Disabled entirely on touch pointers, under reduced motion, and inside text inputs — the
            native caret always wins there.
          </Rule>
          <Rule label="Keyboard">
            The moment a Tab keypress is detected the custom cursor hides and the native focus ring
            takes over. A pointer affordance must never compete with a keyboard one.
          </Rule>
          <Rule label="Never">
            Trailing particles, physics tails, emoji, or a cursor that hides the native one without
            replacing its meaning.
          </Rule>
        </Rules>
      </Chapter>

      {/* ── 14 Buttons ───────────────────────────────────────────────── */}
      <Chapter
        index="14"
        title="Button system"
        summary="Three variants, three sizes, one shape. There is exactly one primary button per viewport; if a screen appears to need two, one of them is a link."
      >
        <div className="grid gap-8 lg:grid-cols-3">
          {[
            [
              "Primary",
              "bg-accent-fill text-white rounded-full",
              "The single most important action.",
            ],
            [
              "Outline",
              "border border-border-strong rounded-full",
              "Secondary actions of equal weight to each other.",
            ],
            ["Text", "underline underline-offset-8", "Tertiary. Reads as a link, behaves as one."],
          ].map(([name, cls, note]) => (
            <div key={name} className="border-t border-hairline pt-6">
              <p className="mb-6 font-mono text-micro tracking-wider">{name}</p>
              <div className="flex flex-wrap items-center gap-4">
                <span className={`${cls} inline-flex px-4 py-2 text-caption`}>Small</span>
                <span className={`${cls} inline-flex px-6 py-3 text-body`}>Medium</span>
                <span className={`${cls} inline-flex px-8 py-4 text-lead`}>Large</span>
              </div>
              <p className="mt-6 text-caption text-muted">{note}</p>
            </div>
          ))}
        </div>

        <Rules>
          <Rule label="Shape">
            Fully rounded, always. The pill is the one place the system permits a radius, and that
            exception is what makes an action legible on a page made of squares.
          </Rule>
          <Rule label="Sizing">
            sm 14px / 32px tall · md 16–18px / 48px · lg 18–24px / 60px. Minimum touch target 44px,
            so `sm` gains padding rather than height on touch devices.
          </Rule>
          <Rule label="States">
            Rest → hover (fill shifts to bright, magnetic engages) → focus-visible (2px bright ring,
            3px offset) → active (fill drops to dim, no scale) → disabled (40% opacity, pointer
            events off).
          </Rule>
          <Rule label="Labels">
            Verb first, four words maximum, sentence case. Never &ldquo;Learn more&rdquo; — say what
            is on the other side.
          </Rule>
        </Rules>
      </Chapter>

      {/* ── 15 Links ─────────────────────────────────────────────────── */}
      <Chapter
        index="15"
        title="Link styles"
        summary="Four link contexts, each with a different affordance, because an inline link inside a paragraph has nothing in common with a navigation item."
      >
        <Rules>
          <Rule label="Inline">
            Bright accent text plus a 1px underline drawn from inline-start on hover, 240ms
            out-expo. Underline offset 0.25em so descenders stay readable.
          </Rule>
          <Rule label="Navigation">
            Foreground at rest, accent on hover, with a persistent accent underline on the current
            route. Colour change only — nav items never move.
          </Rule>
          <Rule label="List row">
            The entire row is the target. Inversion on hover, an arrow that translates on the
            inline-end, and a monospace metadata column that stays put.
          </Rule>
          <Rule label="Media">
            No underline, no colour change. The custom cursor supplies the affordance, and a caption
            beneath supplies the label for everyone else.
          </Rule>
          <Rule label="External">
            Marked with a 45° arrow glyph and `rel=&quot;noreferrer noopener&quot;`. Opening a new
            tab is announced in the accessible name, never silently.
          </Rule>
        </Rules>
      </Chapter>

      {/* ── 16 Cards ─────────────────────────────────────────────────── */}
      <Chapter
        index="16"
        title="Card styles"
        summary="There are no cards. A bordered rounded box with a shadow is the visual default of every template on the internet, so the system replaces it with three deliberately flatter containers."
      >
        <div className="grid gap-block lg:grid-cols-3">
          <div>
            <p className="mb-4 font-mono text-micro tracking-wider text-accent-text">01 · Row</p>
            <div className="border-y border-hairline">
              {["Meridian Bank", "Atlas Logistics", "Halcyon Festival"].map((name, i) => (
                <div
                  key={name}
                  className="flex items-baseline justify-between gap-4 border-t border-hairline py-4 first:border-t-0"
                >
                  <span className="font-mono text-micro text-subtle">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="flex-1 text-title-3">{name}</span>
                  <span className="font-mono text-micro text-subtle">202{5 - i}</span>
                </div>
              ))}
            </div>
            <p className="mt-4 text-caption text-muted">
              The default for any list: work, capabilities, process, careers.
            </p>
          </div>

          <div>
            <p className="mb-4 font-mono text-micro tracking-wider text-accent-text">02 · Tile</p>
            <div className="media-mask aspect-[4/3]">
              <div
                className="h-full w-full"
                style={{
                  background:
                    "radial-gradient(100% 100% at 70% 0%, #24242e 0%, #0d0d12 55%, #08080a 100%)",
                }}
              />
            </div>
            <p className="mt-4 text-title-3">Atlas Logistics</p>
            <p className="mt-1 font-mono text-micro tracking-wider text-subtle">
              Platform · Riyadh · 2024
            </p>
            <p className="mt-4 text-caption text-muted">
              Full-bleed media, zero radius, no border, type beneath rather than over.
            </p>
          </div>

          <div>
            <p className="mb-4 font-mono text-micro tracking-wider text-accent-text">03 · Panel</p>
            <div className="bg-surface-raised p-6" style={{ boxShadow: "var(--shadow-lifted)" }}>
              <p className="text-title-3">Genuinely floating</p>
              <p className="mt-3 text-caption text-muted">
                Menus, dialogs, the mobile navigation. A panel is allowed elevation because it
                really is above the page.
              </p>
            </div>
            <p className="mt-4 text-caption text-muted">
              The only container in the system that may carry a shadow.
            </p>
          </div>
        </div>
      </Chapter>

      {/* ── 17 Image ─────────────────────────────────────────────────── */}
      <Chapter
        index="17"
        title="Image treatment"
        summary="Every image lives inside a fixed-aspect mask and moves within it. That single rule is what makes reveals, hovers and parallax possible without ever shifting layout."
      >
        <div className="grid gap-px lg:grid-cols-3">
          <div className="media-mask media-vignette aspect-[4/5]" data-grain="media">
            <div
              className="h-full w-full"
              style={{
                background:
                  "radial-gradient(90% 70% at 30% 20%, #35353f 0%, #12121a 55%, #08080a 100%)",
              }}
            />
          </div>
          <div className="lg:col-span-2">
            <Rules>
              <Rule label="Aspect ratios">
                16:9 cinematic · 4:5 portrait · 4:3 tile · 1:1 index. Four ratios, chosen per
                context, never arbitrary.
              </Rule>
              <Rule label="Reveal">
                Mask wipes open from the block-end over 1400ms out-expo while the image counter-
                scales from 1.06 to 1. The image is always already in place; the mask is what moves.
              </Rule>
              <Rule label="Grain and vignette">
                6% grain and a 35% corner falloff on all photography, which unifies imagery from
                different shoots into one graded set.
              </Rule>
              <Rule label="Loading">
                A Sanity LQIP blur stands in until decode. No spinners, no grey boxes, no layout
                shift — the mask reserves the space from first paint.
              </Rule>
              <Rule label="Never">
                Rounded corners, borders, drop shadows, or a device mockup floating on a gradient.
              </Rule>
            </Rules>
          </div>
        </div>
      </Chapter>

      {/* ── 18 Video ─────────────────────────────────────────────────── */}
      <Chapter
        index="18"
        title="Video treatment"
        summary="Video is used as atmosphere or as evidence, and the two are configured very differently. Both are capped hard, because a single careless loop can cost more than the rest of the page combined."
      >
        <Rules>
          <Rule label="Ambient">
            Muted, looped, `playsinline`, poster required. Plays only when in view, on a fine
            pointer, with motion allowed and `saveData` off. One per viewport, never two.
          </Rule>
          <Rule label="Featured">
            Poster frame plus an explicit play control, native controls once playing, and audio
            allowed. Always keyboard reachable.
          </Rule>
          <Rule label="Budgets">
            Ambient loops ≤ 6MB and ≤ 12s at 720–1080p. Featured reels stream rather than preload.
            WebM first with an MP4 fallback.
          </Rule>
          <Rule label="Fallback">
            Under reduced motion, low power, or a slow connection, the poster image is the
            experience — and it is composed well enough to be one.
          </Rule>
        </Rules>
      </Chapter>

      {/* ── 19 Scroll ────────────────────────────────────────────────── */}
      <Chapter
        index="19"
        title="Scroll behaviours"
        summary="Lenis smooths the wheel and leaves touch alone. Scroll is the site's primary interaction, so the rules here are about what the page is not allowed to take away from the reader."
      >
        <Rules>
          <Rule label="Smoothing">
            lerp 0.1, duration 1.1s, wheel only. Touch scrolling stays native — smoothed touch costs
            more in perceived responsiveness than it buys in polish.
          </Rule>
          <Rule label="Pinning">
            At most two pinned sections per page, desktop only, each with a visible progress
            indicator so the reader knows the scroll is still theirs.
          </Rule>
          <Rule label="No jacking">
            No scroll snapping, no forced section paging, no hijacked wheel deltas. Smoothing is the
            only liberty taken with the scrollbar.
          </Rule>
          <Rule label="Progress">
            A 1px accent line at the top of the viewport, tied to document progress. It is the only
            persistent chrome besides the header.
          </Rule>
          <Rule label="Anchors">
            In-page anchors route through Lenis so a jump is a camera move, not a teleport — except
            under reduced motion, where it is an instant jump by design.
          </Rule>
        </Rules>
      </Chapter>

      {/* ── 20 Loading ───────────────────────────────────────────────── */}
      <Chapter
        index="20"
        title="Loading behaviours"
        summary="Loading is choreographed, not indicated. There are no spinners and no skeletons anywhere in the system — a mask that has not opened yet is the loading state."
      >
        <div className="mb-block grid gap-px sm:grid-cols-3">
          {[
            [
              "First load",
              `${transition.preloaderMin * 1000}–${transition.preloaderMax * 1000}ms`,
              "Void curtain, wordmark, a counter to 100. Exits with a mask-up wipe.",
            ],
            [
              "Route change",
              `${transition.curtainIn * 1000} / ${transition.curtainOut * 1000}ms`,
              "Curtain wipes in, content swaps behind it, curtain wipes out.",
            ],
            ["In-page", "0ms", "Masks are already closed. Content opens them on arrival."],
          ].map(([name, timing, note]) => (
            <div key={name} className="bg-surface p-6">
              <p className="font-mono text-micro tracking-wider">{name}</p>
              <p className="mt-2 font-mono text-micro text-accent-text">{timing}</p>
              <p className="mt-4 text-caption text-muted">{note}</p>
            </div>
          ))}
        </div>

        <Rules>
          <Rule label="Minimum and maximum">
            The preloader holds for at least 600ms so it never flickers, and releases at 2000ms
            regardless of what is still in flight.
          </Rule>
          <Rule label="Fonts">
            `display: swap` with metric-matched fallbacks. A visible font swap is acceptable; a
            reflow is not.
          </Rule>
          <Rule label="Second visit">
            The preloader runs once per session. Returning to the homepage mid-session gets the
            route curtain, not the full opening titles.
          </Rule>
        </Rules>
      </Chapter>

      {/* ── 21 Section transitions ───────────────────────────────────── */}
      <Chapter
        index="21"
        title="Section transition rules"
        summary="Sections are cut together like film. A boundary is a hairline, an inversion, or a full-bleed image — never a gradient fade from one background to another."
      >
        <Rules>
          <Rule label="Cut">
            The default. A hairline, then the next section&apos;s index number and eyebrow. Costs
            nothing and reads as intent.
          </Rule>
          <Rule label="Bleed">
            Full-width media spanning the boundary, with the next section&apos;s type overlapping
            its lower edge. Used once or twice per page.
          </Rule>
          <Rule label="Inversion">
            The light room. The strongest boundary available, and therefore limited to one per page.
          </Rule>
          <Rule label="Sticky eyebrow">
            A section&apos;s index and label may stick to the top of the viewport for the length of
            that section. This is the only sticky element besides the header.
          </Rule>
          <Rule label="Never">
            Fading one background colour into another, wave dividers, angled slices, or a parallax
            layer that continues across a boundary.
          </Rule>
        </Rules>
      </Chapter>

      {/* ── 22–24 Breakpoints ────────────────────────────────────────── */}
      <Chapter
        index="22–24"
        title="Device rules"
        summary="Three tiers, differing in motion budget as much as in layout. Mobile is not desktop with fewer columns — it is a shorter edit of the same film."
      >
        <div className="grid gap-px lg:grid-cols-3">
          {[
            [
              "Mobile · < 768px",
              [
                "4 columns, 20px gutter",
                "Headlines cap at 44px; scale never collapses below title-3",
                "No parallax, no pinning, no custom cursor, no magnetics",
                "Reveals shortened to 800ms, stagger to 40ms",
                "One media element per viewport, autoplay only on Wi-Fi",
                "Touch targets ≥ 44px; nav is a full-screen panel",
              ],
            ],
            [
              "Tablet · 768–1023px",
              [
                "8 columns, fluid gutter",
                "Parallax allowed at half depth; pinning still off",
                "No custom cursor — coarse pointer is assumed",
                "Two-column editorial layouts, media at 4:3 or 1:1",
                "Landscape treated as small desktop for layout, tablet for motion",
              ],
            ],
            [
              "Desktop · ≥ 1024px",
              [
                "12 columns, up to 56px gutter",
                "Full motion tier: pinning (≤2), parallax, cursor, magnetics",
                "Display type up to 112px; asymmetric spans throughout",
                "Hover states are load-bearing and fully designed",
                "Above 1600px the page caps at 112rem and gutters absorb the rest",
              ],
            ],
          ].map(([name, items]) => (
            <div key={name as string} className="bg-surface p-6">
              <h3 className="text-title-3">{name as string}</h3>
              <ul className="mt-5 space-y-3">
                {(items as string[]).map((item) => (
                  <li key={item} className="border-t border-hairline pt-3 text-caption text-muted">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Chapter>

      {/* ── 25 Accessibility ─────────────────────────────────────────── */}
      <Chapter
        index="25"
        title="Accessibility rules"
        summary="Non-negotiable, and cheaper to hold than to retrofit. A cinematic site that cannot be operated with a keyboard is a demo, not a product."
      >
        <Rules>
          <Rule label="Contrast">
            Body ≥ 4.5:1, large text and UI ≥ 3:1. The accent split in §05 exists entirely to keep
            this promise.
          </Rule>
          <Rule label="Focus">
            Always visible, 2px bright accent, 3px offset, never removed. Focus order follows the
            visual order even when the grid reorders content.
          </Rule>
          <Rule label="Reduced motion">
            No transforms, no parallax, no autoplay, no curtain. Transitions collapse to ≤ 200ms
            opacity. The JS layer skips timelines entirely rather than running them fast.
          </Rule>
          <Rule label="Keyboard">
            Full navigation, a skip link to main, focus trapped inside the open menu, Escape closes
            it, and focus returns to the trigger.
          </Rule>
          <Rule label="Media">
            Every asset carries alt text and an optional caption from the CMS. Decorative media is
            marked `aria-hidden`. Nothing flashes above 3Hz.
          </Rule>
          <Rule label="Structure">
            One `h1` per page, no skipped heading levels, landmarks on every region, and index
            numbers marked decorative so they are not read aloud.
          </Rule>
          <Rule label="RTL">
            Layout uses logical properties throughout, and motion direction is read from a token, so
            Arabic is a mirror rather than a patch.
          </Rule>
        </Rules>
      </Chapter>

      {/* ── 26 Performance ───────────────────────────────────────────── */}
      <Chapter
        index="26"
        title="Performance rules"
        summary="Budgets, not aspirations. A number that is not enforced in CI is a wish, so each of these is measured on a 4G Moto G-class profile before a page is considered done."
      >
        <div className="mb-block grid gap-px sm:grid-cols-2 lg:grid-cols-4">
          {[
            ["LCP", "≤ 2.0s", "4G, mid-tier Android"],
            ["INP", "≤ 200ms", "Including during scroll"],
            ["CLS", "≤ 0.02", "Masks reserve all media"],
            ["JS", "≤ 180KB", "Gzipped, per route"],
          ].map(([name, value, note]) => (
            <div key={name} className="bg-surface p-6">
              <p className="font-mono text-micro tracking-wider text-subtle">{name}</p>
              <p className="mt-3 text-title-2">{value}</p>
              <p className="mt-2 text-micro tracking-normal text-muted">{note}</p>
            </div>
          ))}
        </div>

        <Rules>
          <Rule label="Server first">
            Server Components by default. A component becomes a client component only for
            interaction, animation, or a browser API — and then only that component.
          </Rule>
          <Rule label="Three.js">
            Never in the shared bundle. Dynamically imported on the one or two routes that need it,
            one scene per page, with a static fallback for low-power devices.
          </Rule>
          <Rule label="Media">
            Hero images ≤ 200KB AVIF, ambient video ≤ 6MB, everything below the fold lazy. Widths
            come from the Sanity URL builder, never from CSS downscaling.
          </Rule>
          <Rule label="Fonts">
            Three families, self-hosted by next/font, subset to the scripts actually used. No
            runtime font requests, no icon fonts, no fourth family.
          </Rule>
          <Rule label="Animation cost">
            Transform and opacity only. `will-change` is applied on scene entry and removed on exit;
            it is never left on a static element.
          </Rule>
        </Rules>
      </Chapter>

      <footer className="mt-block border-t border-hairline px-gutter pt-block font-mono text-micro tracking-wider text-subtle">
        <p>
          Tokens: src/styles/tokens.css · Motion: src/motion/config.ts · Rationale:
          docs/design-bible.md
        </p>
      </footer>
    </main>
  );
}
