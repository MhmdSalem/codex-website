/**
 * The code the homepage writes.
 *
 * A real slice of the Accreditation gate loop, tokenised by hand so it can be
 * rendered as coloured spans on the server and animated on the client without
 * a syntax highlighter in the bundle. Token kinds map to the `.t*` classes in
 * build.module.css.
 */
export type TokenKind = "k" | "f" | "s" | "n" | "c" | "p" | "v";

export interface Token {
  kind: TokenKind;
  text: string;
}

export type CodeLine = Token[];

const k = (text: string): Token => ({ kind: "k", text });
const f = (text: string): Token => ({ kind: "f", text });
const s = (text: string): Token => ({ kind: "s", text });
const p = (text: string): Token => ({ kind: "p", text });
const v = (text: string): Token => ({ kind: "v", text });

/** The full file, as the hero types it. */
export const GATE_CODE: readonly CodeLine[] = [
  [k("import"), p(" { "), v("Gate"), p(", "), v("Guest"), p(" } "), k("from"), p(" "), s('"@codex/accreditation"'), p(";")],
  [],
  [k("const"), p(" "), v("gate"), p(" = "), k("await"), p(" "), v("Gate"), p("."), f("open"), p("("), s('"gate-03"'), p(");")],
  [],
  [k("for await"), p(" ("), k("const"), p(" "), v("scan"), p(" "), k("of"), p(" "), v("gate"), p("."), f("scans"), p("()) {")],
  [p("  "), k("const"), p(" "), v("guest"), p(" = "), k("await"), p(" "), v("Guest"), p("."), f("verify"), p("("), v("scan"), p("."), v("badgeId"), p(");")],
  [p("  "), k("if"), p(" (!"), v("guest"), p("."), f("allowed"), p("("), v("gate"), p("."), v("zone"), p(")) {")],
  [p("    "), k("await"), p(" "), v("gate"), p("."), f("deny"), p("("), v("scan"), p(", "), s('"zone"'), p("); "), k("continue"), p(";")],
  [p("  }")],
  [p("  "), k("await"), p(" "), v("gate"), p("."), f("admit"), p("("), v("guest"), p(");")],
  [p("  "), v("metrics"), p("."), f("increment"), p("("), s('"checkins"'), p(", { "), v("zone"), p(": "), v("gate"), p("."), v("zone"), p(" });")],
  [p("}")],
];

/**
 * The lines the build scene steps through, and what each one produces.
 *
 * `pieces` are the parts of the product interface that appear when the line
 * executes; they match the `data-piece` ids in BuildScene.
 */
export interface BuildStep {
  line: CodeLine;
  number: number;
  pieces: readonly number[];
}

export const BUILD_STEPS: readonly BuildStep[] = [
  { number: 1, line: GATE_CODE[0]!, pieces: [0] },
  { number: 3, line: GATE_CODE[2]!, pieces: [1] },
  { number: 6, line: GATE_CODE[5]!, pieces: [2] },
  { number: 8, line: [k("await"), p(" "), v("gate"), p("."), f("deny"), p("("), v("scan"), p(", "), s('"zone"'), p(");")], pieces: [4] },
  { number: 10, line: [k("await"), p(" "), v("gate"), p("."), f("admit"), p("("), v("guest"), p(");")], pieces: [3, 5] },
  { number: 11, line: [v("metrics"), p("."), f("increment"), p("("), s('"checkins"'), p(");")], pieces: [6] },
];

/** Background planes: loose fragments from across the stack. */
export const PLANE_SNIPPETS: readonly string[] = [
  "export async function handler(req: Request) {",
  "  const session = await auth(req);",
  "  if (!session) return unauthorized();",
  "  const rows = await db.query(sql`select * from guests where event_id = ${id}`);",
  "  return json(rows.map(toDTO));",
  "}",
  "",
  'const queue = new Queue("badges", { retries: 3 });',
  "queue.process(async (job) => { await printer.print(job.data) });",
  "",
  "CREATE INDEX idx_checkins_zone ON checkins (zone, created_at desc);",
  "",
  'resolver.on("rsvp:accepted", (g) => notify.whatsapp(g.phone, tpl.confirm));',
  'await model.classify(document, { labels: ["invoice", "contract", "id"] });',
  'pipeline.stage("deploy").run(({ env }) => vercel.deploy(env));',
];

export function planeText(seed: number, lines = 46): string {
  let out = "";
  for (let index = 0; index < lines; index += 1) {
    out += `${PLANE_SNIPPETS[(index * 7 + seed) % PLANE_SNIPPETS.length]}\n`;
  }
  return out;
}

export function lineLength(line: CodeLine): number {
  return line.reduce((total, token) => total + token.text.length, 0);
}
