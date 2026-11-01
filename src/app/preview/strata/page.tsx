import { Container } from "@/components/ui/Container";
import { ModuleGlyph } from "@/experience/hero/ModuleGlyph";
import type { ModuleId } from "@/experience/hero/scene";

import { FACTS, LINE, PALETTE, SERVICES } from "../_palette";
import { ArcField, ScreenMock } from "../_visuals";

const STEPS = [
  { title: "نفهم", body: "نجلس على شغلك الحالي ونكتب المطلوب بالتفصيل." },
  { title: "نصمّم", body: "شاشات وبنية تقنية معاً، لا واحدة بعد الأخرى." },
  { title: "نبني", body: "مراحل قصيرة، وفي آخر كل مرحلة شيء تجربه." },
  { title: "نشغّل", body: "ننشر، ونراقب، ونبقى بعد الإطلاق." },
] as const;

/**
 * Proposal B — "الطبقات" (strata).
 *
 * Still dark, but colour arrives as area rather than as text: struck arcs behind
 * the opening, then bands that alternate warm and cool so each section has its
 * own ground. Fewer frames than proposal A and more contrast between sections —
 * this one is read as a magazine, where A is read as a drawing.
 */
export default function StrataPreview() {
  return (
    <main>
      {/* ── Opening, over two arcs ───────────────────────────────────────── */}
      <section className="relative overflow-hidden">
        <ArcField />

        <Container>
          <div className="relative flex min-h-[88svh] flex-col justify-center py-block">
            <span className="font-mono text-micro tracking-wider" style={{ color: PALETTE.ash }}>
              شركة برمجيات — القاهرة
            </span>

            <h1
              className="mt-6 max-w-[18ch] font-display text-display text-balance"
              style={{ color: PALETTE.bone }}
            >
              نبني الأنظمة التي تدير بها عملك.
            </h1>

            <p className="mt-7 max-w-[44ch] text-lead" style={{ color: PALETTE.fog }}>
              منصات وتطبيقات وأنظمة ذكاء اصطناعي — ولنا منتجان نشغّلهما بأنفسنا كل يوم.
            </p>

            <div className="mt-10 flex flex-wrap gap-3">
              <a
                href="#"
                className="px-7 py-3.5 text-caption"
                style={{ background: PALETTE.terracotta, color: PALETTE.ink }}
              >
                ابدأ مشروعك
              </a>
              <a
                href="#"
                className="px-7 py-3.5 text-caption"
                style={{ border: `1px solid ${PALETTE.petrolBright}`, color: PALETTE.petrolBright }}
              >
                شوف الأسعار
              </a>
            </div>
          </div>
        </Container>
      </section>

      {/* ── Services: colour by area, one tinted panel per row of three ──── */}
      <section className="py-section" style={{ background: PALETTE.void }}>
        <Container>
          <div className="grid gap-8 md:grid-cols-12 md:items-end">
            <h2
              className="font-display text-title-1 text-balance md:col-span-7"
              style={{ color: PALETTE.bone }}
            >
              ست خدمات، تُسلَّم كنظام واحد.
            </h2>
            <p className="text-body md:col-span-5" style={{ color: PALETTE.fog }}>
              معظم المشاريع تحتاج ثلاثاً أو أربعاً منها معاً، وننفّذها بفريق واحد.
            </p>
          </div>

          <ul className="mt-14 grid gap-px" style={{ background: LINE.faint }}>
            {SERVICES.map((service, index) => (
              <li
                key={service.id}
                className="grid items-baseline gap-x-8 gap-y-3 p-7 md:grid-cols-12"
                style={{
                  // Warm and cool alternate down the list, so the eye has
                  // somewhere to rest between six identical rows.
                  background: index % 2 === 0 ? PALETTE.clayDeep : PALETTE.petrolDeep,
                }}
              >
                <span
                  className="font-mono text-micro md:col-span-1"
                  style={{ color: index % 2 === 0 ? PALETTE.terracotta : PALETTE.petrolBright }}
                >
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3
                  className="flex items-center gap-3 font-display text-title-3 md:col-span-5"
                  style={{ color: PALETTE.bone }}
                >
                  <ModuleGlyph
                    id={service.id as ModuleId}
                    className="size-5 shrink-0"
                    // Inherits the row's temperature rather than shouting orange
                    // six times.
                  />
                  {service.name}
                </h3>
                <p className="text-body md:col-span-6" style={{ color: PALETTE.fog }}>
                  {service.line}
                </p>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      {/* ── Products: full-bleed panels, each on its own ground ──────────── */}
      <section>
        <div className="py-section" style={{ background: PALETTE.clay }}>
          <Container>
            <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
              <div className="lg:col-span-5">
                <span className="font-mono text-micro" style={{ color: PALETTE.terracottaBright }}>
                  منتج نشغّله
                </span>
                <h2
                  className="mt-5 font-display text-title-1 text-balance"
                  style={{ color: PALETTE.paper }}
                >
                  كودكس للاعتماد
                </h2>
                <p className="mt-5 max-w-[42ch] text-body" style={{ color: PALETTE.fog }}>
                  تسجيل الحضور، وطباعة البطاقات، والتحقق على البوابة، والصلاحيات — في نظام واحد
                  للمؤتمرات والمعارض.
                </p>
                <a
                  href="#"
                  className="mt-8 inline-block px-6 py-3 text-caption whitespace-nowrap"
                  style={{ border: `1px solid ${PALETTE.terracotta}`, color: PALETTE.terracotta }}
                >
                  اطلب عرضاً تجريبياً
                </a>
              </div>

              <div className="lg:col-span-7">
                <ScreenMock
                  title="codex-accreditation / بوابة ٣"
                  tint={PALETTE.clayDeep}
                  badge={{ value: "١٬٢٥٦", label: "دخول اليوم" }}
                  rows={[
                    { name: "أحمد سالم — صحافة", meta: "09:41 · بوابة ٣", state: true },
                    { name: "منى عبد الله — عارض", meta: "09:44 · بوابة ١", state: true },
                    { name: "خالد يوسف — زائر", meta: "بانتظار التحقق" },
                  ]}
                />
              </div>
            </div>
          </Container>
        </div>

        <div className="py-section" style={{ background: PALETTE.petrol }}>
          <Container>
            <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
              <div className="lg:col-span-7">
                <ScreenMock
                  title="daawa / قائمة الضيوف"
                  tint={PALETTE.petrolDeep}
                  badge={{ value: "٤١٢", label: "دعوة مُرسلة" }}
                  rows={[
                    { name: "عائلة الشريف — ٤ أفراد", meta: "أكّد الحضور", state: true },
                    { name: "د. هالة منصور", meta: "أكّدت الحضور", state: true },
                    { name: "شركة النيل للمقاولات", meta: "لم يرد بعد" },
                  ]}
                />
              </div>

              <div className="lg:col-span-5">
                <span className="font-mono text-micro" style={{ color: PALETTE.petrolBright }}>
                  منتج نشغّله
                </span>
                <h2
                  className="mt-5 font-display text-title-1 text-balance"
                  style={{ color: PALETTE.paper }}
                >
                  دعوة
                </h2>
                <p className="mt-5 max-w-[42ch] text-body" style={{ color: "#c9cfcf" }}>
                  أنشئ الدعوة، وأرسلها لقائمتك، وتابع من سيحضر، وسجّل دخول الضيوف على الباب.
                </p>
                <a
                  href="#"
                  className="mt-8 inline-block px-6 py-3 text-caption whitespace-nowrap"
                  style={{ background: PALETTE.paper, color: PALETTE.ink }}
                >
                  اطلب عرضاً تجريبياً
                </a>
              </div>
            </div>
          </Container>
        </div>
      </section>

      {/* ── How we work: a line with four stops ──────────────────────────── */}
      <section className="py-section" style={{ background: PALETTE.black }}>
        <Container>
          <h2
            className="max-w-[22ch] font-display text-title-1 text-balance"
            style={{ color: PALETTE.bone }}
          >
            أربع خطوات، بلا مفاجآت.
          </h2>

          <ol className="mt-14 grid gap-8 md:grid-cols-4">
            {STEPS.map((step, index) => (
              <li key={step.title} className="relative pt-8">
                <span
                  aria-hidden
                  className="absolute inset-x-0 top-0 h-px"
                  style={{ background: index === 0 ? PALETTE.terracotta : LINE.base }}
                />
                <span
                  aria-hidden
                  className="absolute top-0 size-2 -translate-y-1/2"
                  style={{
                    background: PALETTE.terracotta,
                    insetInlineStart: 0,
                  }}
                />
                <span className="font-mono text-micro" style={{ color: PALETTE.ash }}>
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-3 font-display text-title-3" style={{ color: PALETTE.bone }}>
                  {step.title}
                </h3>
                <p className="mt-2 text-caption" style={{ color: PALETTE.fog }}>
                  {step.body}
                </p>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      {/* ── Facts + closing on one deep band ─────────────────────────────── */}
      <section className="py-section" style={{ background: PALETTE.petrolDeep }}>
        <Container>
          <dl className="grid grid-cols-2 gap-y-10 lg:grid-cols-4">
            {FACTS.map((fact) => (
              <div key={fact.label}>
                <dd
                  className="font-display text-title-2"
                  style={{ color: PALETTE.terracottaBright }}
                >
                  {fact.value}
                </dd>
                <dt className="mt-2 text-caption" style={{ color: "#9fb0b0" }}>
                  {fact.label}
                </dt>
              </div>
            ))}
          </dl>

          <div
            className="mt-16 grid gap-8 pt-12 md:grid-cols-12 md:items-end"
            style={{ borderTop: `1px solid ${PALETTE.petrol}` }}
          >
            <h2
              className="max-w-[20ch] font-display text-title-1 text-balance md:col-span-7"
              style={{ color: PALETTE.paper }}
            >
              اعرف سعر مشروعك.
            </h2>

            <div className="flex flex-wrap items-center gap-4 md:col-span-5 md:justify-end">
              <a
                href="#"
                className="px-7 py-3.5 text-caption"
                style={{ background: PALETTE.terracotta, color: PALETTE.ink }}
              >
                ابدأ مشروعك
              </a>
              <span className="font-mono text-micro" dir="ltr" style={{ color: "#9fb0b0" }}>
                info@codex-tech.ai
              </span>
            </div>
          </div>
        </Container>
      </section>
    </main>
  );
}
