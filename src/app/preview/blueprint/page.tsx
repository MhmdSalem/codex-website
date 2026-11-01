import { Container } from "@/components/ui/Container";
import { ModuleGlyph } from "@/experience/hero/ModuleGlyph";
import type { ModuleId } from "@/experience/hero/scene";

import { FACTS, LINE, PALETTE, SERVICES } from "../_palette";
import { BracketMark, FlowDiagram, Framed, GridPlate, Rule, ScreenMock } from "../_visuals";

/**
 * Proposal A — "المخطّط" (the blueprint).
 *
 * Same black room, but the sections stop being identical: ruled ground under the
 * opening, measured frames instead of floating text, one cool band and one warm
 * band so scrolling has a rhythm, and the closing block on paper. Everything
 * drawn is drawn like an engineering document, which is what the company sells.
 *
 * Copy is cut to a line per idea — the live site argues where it should assert.
 */
export default function BlueprintPreview() {
  return (
    <main>
      {/* ── Opening ──────────────────────────────────────────────────────── */}
      <section
        className="relative overflow-hidden border-b"
        style={{ borderColor: LINE.base, background: PALETTE.void }}
      >
        {/* The cool plate holds the side the text leaves empty, so the opening is
            a composition of two grounds rather than one black rectangle. */}
        <div
          aria-hidden
          className="absolute inset-y-0 start-0 hidden w-[38%] lg:block"
          style={{
            background: PALETTE.petrolDeep,
            borderInlineEnd: `1px solid ${PALETTE.petrol}`,
          }}
        />
        <GridPlate size={72} fade="70%" />
        <BracketMark className="absolute start-[4%] top-[12%] hidden w-[26rem] opacity-25 lg:block" />

        <Container>
          <div className="relative flex min-h-[86svh] flex-col justify-end py-block">
            <span className="font-mono text-micro tracking-wider" style={{ color: PALETTE.ash }}>
              كودكس تِك — القاهرة
            </span>

            <h1
              className="mt-6 max-w-[20ch] font-display text-display text-balance"
              style={{ color: PALETTE.bone }}
            >
              نبني الأنظمة التي تدير بها عملك.
            </h1>

            <p className="mt-7 max-w-[46ch] text-lead" style={{ color: PALETTE.fog }}>
              منصات وتطبيقات وأنظمة ذكاء اصطناعي. ولنا منتجان نشغّلهما بأنفسنا كل يوم.
            </p>

            <div className="mt-10 flex flex-wrap gap-3">
              <a
                href="#"
                className="px-7 py-3.5 text-caption transition-opacity hover:opacity-90"
                style={{ background: PALETTE.terracottaDeep, color: PALETTE.paper }}
              >
                ابدأ مشروعك
              </a>
              <a
                href="#"
                className="px-7 py-3.5 text-caption transition-colors"
                style={{ border: `1px solid ${LINE.strong}`, color: PALETTE.bone }}
              >
                شوف الأسعار
              </a>
            </div>
          </div>
        </Container>

        {/* The facts strip: four checkable numbers, no adjectives. */}
        <div style={{ borderTop: `1px solid ${LINE.base}`, background: PALETTE.void }}>
          <Container>
            <dl className="grid grid-cols-2 lg:grid-cols-4">
              {FACTS.map((fact, index) => (
                <div
                  key={fact.label}
                  className="px-1 py-7 lg:px-6"
                  style={{
                    borderInlineStart: index === 0 ? undefined : `1px solid ${LINE.faint}`,
                  }}
                >
                  <dt className="font-mono text-micro" style={{ color: PALETTE.ash }}>
                    {fact.label}
                  </dt>
                  <dd
                    className="mt-2 font-display text-title-3"
                    style={{ color: PALETTE.terracotta }}
                  >
                    {fact.value}
                  </dd>
                </div>
              ))}
            </dl>
          </Container>
        </div>
      </section>

      {/* ── Services ─────────────────────────────────────────────────────── */}
      <section className="relative py-section" style={{ background: PALETTE.void }}>
        <Container>
          <div className="flex items-start gap-8">
            <Rule className="hidden h-40 w-7 shrink-0 lg:flex" />

            <div className="min-w-0 flex-1">
              <span className="font-mono text-micro tracking-wider" style={{ color: PALETTE.ash }}>
                ست خدمات
              </span>
              <h2
                className="mt-5 max-w-[24ch] font-display text-title-1 text-balance"
                style={{ color: PALETTE.bone }}
              >
                كل واحدة منها تُسلَّم كجزء من نظام، لا كخدمة منفصلة.
              </h2>
            </div>
          </div>

          <ul className="mt-14 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {SERVICES.map((service, index) => (
              <li key={service.id}>
                <Framed
                  className="h-full p-7"
                  tone={index === 0 ? "accent" : "line"}
                  // The surface alternates so a grid of six panels does not read
                  // as one flat field of cards.
                >
                  <div
                    className="absolute inset-0"
                    style={{ background: index % 2 === 0 ? PALETTE.clayDeep : PALETTE.petrolDeep }}
                  />
                  <div className="relative">
                    <div className="flex items-center justify-between">
                      <ModuleGlyph
                        id={service.id as ModuleId}
                        className="size-6"
                        // The accent stays on the glyph rather than on the text,
                        // so six panels carry colour without six orange headings.
                      />
                      <span className="font-mono text-micro" style={{ color: PALETTE.ash }}>
                        {String(index + 1).padStart(2, "0")}
                      </span>
                    </div>
                    <h3 className="mt-6 font-display text-title-3" style={{ color: PALETTE.bone }}>
                      {service.name}
                    </h3>
                    <p className="mt-2 text-caption" style={{ color: PALETTE.fog }}>
                      {service.line}
                    </p>
                  </div>
                </Framed>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      {/* ── The cool band: how the parts connect ─────────────────────────── */}
      <section
        className="relative overflow-hidden py-section"
        style={{
          background: PALETTE.petrolDeep,
          borderBlock: `1px solid ${PALETTE.petrol}`,
        }}
      >
        <GridPlate size={96} fade="70%" />
        <Container>
          <div className="relative max-w-[52ch]">
            <span
              className="font-mono text-micro tracking-wider"
              style={{ color: PALETTE.petrolBright }}
            >
              كيف يعمل
            </span>
            <h2 className="mt-5 font-display text-title-1" style={{ color: PALETTE.paper }}>
              أنظمتك المتفرقة تصبح مساراً واحداً.
            </h2>
            <p className="mt-5 text-body" style={{ color: PALETTE.fog }}>
              لا نستبدل ما تعمل عليه. نربطه، ثم نبني فوقه الشاشة التي تتخذ منها قرارك.
            </p>
          </div>

          <div className="relative mt-12">
            <FlowDiagram />
          </div>
        </Container>
      </section>

      {/* ── Products, drawn ──────────────────────────────────────────────── */}
      <section className="py-section" style={{ background: PALETTE.clayDeep }}>
        <Container>
          <span className="font-mono text-micro tracking-wider" style={{ color: PALETTE.ash }}>
            منتجاتنا
          </span>
          <h2
            className="mt-5 max-w-[26ch] font-display text-title-1 text-balance"
            style={{ color: PALETTE.bone }}
          >
            منتجان يعملان الآن، بنيناهما ونشغّلهما.
          </h2>

          <div className="mt-14 grid gap-10 lg:grid-cols-2">
            <div>
              <ScreenMock
                title="codex-accreditation / بوابة ٣"
                tint={PALETTE.clay}
                badge={{ value: "١٬٢٥٦", label: "دخول اليوم" }}
                rows={[
                  { name: "أحمد سالم — صحافة", meta: "09:41 · بوابة ٣", state: true },
                  { name: "منى عبد الله — عارض", meta: "09:44 · بوابة ١", state: true },
                  { name: "خالد يوسف — زائر", meta: "بانتظار التحقق" },
                ]}
              />
              <h3 className="mt-7 font-display text-title-3" style={{ color: PALETTE.bone }}>
                كودكس للاعتماد
              </h3>
              <p className="mt-2 max-w-[40ch] text-body" style={{ color: PALETTE.fog }}>
                تسجيل الحضور، وطباعة البطاقات، والتحقق على البوابة، والصلاحيات — في نظام واحد.
              </p>
            </div>

            <div>
              <ScreenMock
                title="daawa / قائمة الضيوف"
                tint={PALETTE.clay}
                badge={{ value: "٤١٢", label: "دعوة مُرسلة" }}
                rows={[
                  { name: "عائلة الشريف — ٤ أفراد", meta: "أكّد الحضور", state: true },
                  { name: "د. هالة منصور", meta: "أكّدت الحضور", state: true },
                  { name: "شركة النيل للمقاولات", meta: "لم يرد بعد" },
                ]}
              />
              <h3 className="mt-7 font-display text-title-3" style={{ color: PALETTE.bone }}>
                دعوة
              </h3>
              <p className="mt-2 max-w-[40ch] text-body" style={{ color: PALETTE.fog }}>
                دعوات رقمية: أنشئ الدعوة، وأرسلها لقائمتك، وتابع من سيحضر، وسجّل الدخول على الباب.
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* ── Closing, on paper ───────────────────────────────────────────── */}
      <section className="py-section" style={{ background: PALETTE.paper, color: PALETTE.ink }}>
        <Container>
          <div className="grid gap-10 md:grid-cols-12 md:items-end">
            <div className="md:col-span-7">
              <h2 className="max-w-[20ch] font-display text-title-1 text-balance">
                اعرف سعر مشروعك.
              </h2>
              <p className="mt-5 max-w-[46ch] text-body" style={{ color: "#4a4a55" }}>
                أرسل لنا ما لديك — ملفاً أو رسماً أو فكرة في سطرين — ونرد عليك بما سنبنيه وترتيب
                العمل والسعر.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-4 md:col-span-5 md:justify-end">
              <a
                href="#"
                className="px-7 py-3.5 text-caption"
                style={{ background: PALETTE.ink, color: PALETTE.paper }}
              >
                ابدأ مشروعك
              </a>
              <span className="font-mono text-micro" style={{ color: "#6a6a76" }} dir="ltr">
                info@codex-tech.ai
              </span>
            </div>
          </div>
        </Container>
      </section>
    </main>
  );
}
