/**
 * Regenerates the CODEX TECH logo outlines from the supplied raster.
 *
 * The brand asset we were given is a JPEG: no alpha channel, black field baked
 * in. That is unusable as site chrome — it would drop an opaque rectangle over
 * the page and fight the header's difference blend. So the two marks are
 * separated by hue, converted to coverage masks, and traced to Bezier outlines.
 * The result is resolution independent, transparent, and recolourable.
 *
 * Run manually; the output is committed. Tracing dependencies are deliberately
 * not in package.json because this runs roughly never:
 *
 *   npm i --no-save potrace jimp
 *   node scripts/trace-logo.mjs
 *   npm run format
 *
 * If a real vector (SVG/AI/PDF) of the logo ever arrives, delete this script
 * and use it directly — a trace is a reproduction, not the master.
 */
import fs from "node:fs";
import { Jimp } from "jimp";
import potrace from "potrace";

const SOURCE = "assets/brand/codex-logo-source.jpg";
const PATHS_OUT = "src/components/ui/logo-paths.ts";
const SVG_OUT = "public/logo/codex.svg";

// Measured off the asset rather than guessed. The wordmark is near-white and
// desaturated; the brackets, slash and caret bar are terracotta.
const CREAM_LUM = 249;
const ACCENT_LUM = 141;
const HUE_SPLIT = 40; // terracotta separates from cream by a wide red/blue gap
const BACKGROUND_LUM = 24; // anything darker is the baked-in black field

const img = await Jimp.read(SOURCE);
const { width: srcW, height: srcH, data } = img.bitmap;
const lumAt = (i) => 0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2];
const isAccentAt = (i) => data[i] - data[i + 2] > HUE_SPLIT;

// Tight-crop to the marks. Padding is a layout concern and belongs in CSS, so
// the viewBox must carry none of it or every consumer inherits the asset's.
let minX = srcW;
let minY = srcH;
let maxX = -1;
let maxY = -1;
for (let y = 0; y < srcH; y += 1) {
  for (let x = 0; x < srcW; x += 1) {
    if (lumAt((y * srcW + x) * 4) > BACKGROUND_LUM) {
      if (x < minX) minX = x;
      if (y < minY) minY = y;
      if (x > maxX) maxX = x;
      if (y > maxY) maxY = y;
    }
  }
}
const width = maxX - minX + 1;
const height = maxY - minY + 1;

/**
 * Builds a greyscale coverage mask for one of the two marks. Potrace
 * thresholds at 128, so encoding partial coverage as grey lands the traced
 * contour on the glyph's true 50% edge rather than on a hard staircase.
 */
async function buildMask(wantAccent) {
  const mask = new Jimp({ width, height, color: 0xffffffff });
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const si = ((y + minY) * srcW + (x + minX)) * 4;
      if (isAccentAt(si) !== wantAccent) continue;
      const coverage = Math.min(1, lumAt(si) / (wantAccent ? ACCENT_LUM : CREAM_LUM));
      const value = Math.round(255 * (1 - coverage));
      const di = (y * width + x) * 4;
      mask.bitmap.data[di] = value;
      mask.bitmap.data[di + 1] = value;
      mask.bitmap.data[di + 2] = value;
      mask.bitmap.data[di + 3] = 255;
    }
  }
  const file = `scripts/.mask-${wantAccent ? "accent" : "cream"}.png`;
  fs.writeFileSync(file, await mask.getBuffer("image/png"));
  return file;
}

function tracePath(file) {
  return new Promise((resolve, reject) => {
    const tracer = new potrace.Potrace({
      threshold: 128,
      blackOnWhite: true,
      turdSize: 4, // clears JPEG ringing specks without eating real detail
      alphaMax: 1,
      optCurve: true,
      optTolerance: 0.2,
    });
    tracer.loadImage(file, (err) => {
      if (err) return reject(err);
      const match = tracer.getPathTag().match(/ d="([^"]+)"/);
      if (!match) return reject(new Error("potrace returned no path data"));
      resolve(match[1]);
    });
  });
}

/** Averages interior pixels only, so JPEG edge ringing cannot skew the hex. */
function measureColour(wantAccent) {
  let r = 0;
  let g = 0;
  let b = 0;
  let n = 0;
  for (let i = 0; i < data.length; i += 4) {
    if (isAccentAt(i) !== wantAccent) continue;
    const lum = lumAt(i);
    const interior = wantAccent ? lum > 120 && lum < 165 : lum > 225;
    if (!interior) continue;
    r += data[i];
    g += data[i + 1];
    b += data[i + 2];
    n += 1;
  }
  return (
    "#" +
    [r / n, g / n, b / n]
      .map((v) => Math.round(v).toString(16).padStart(2, "0"))
      .join("")
      .toUpperCase()
  );
}

const creamMask = await buildMask(false);
const accentMask = await buildMask(true);
const wordmark = await tracePath(creamMask);
const accent = await tracePath(accentMask);
fs.rmSync(creamMask);
fs.rmSync(accentMask);

const creamHex = measureColour(false);
const accentHex = measureColour(true);

fs.mkdirSync("public/logo", { recursive: true });
fs.writeFileSync(
  SVG_OUT,
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}" role="img" aria-label="CODEX TECH">
  <path fill="${creamHex}" fill-rule="evenodd" d="${wordmark}"/>
  <path fill="${accentHex}" fill-rule="evenodd" d="${accent}"/>
</svg>
`,
);

fs.writeFileSync(
  PATHS_OUT,
  `// Generated by scripts/trace-logo.mjs from ${SOURCE}. Do not edit by hand.

export const LOGO_VIEWBOX = "0 0 ${width} ${height}";
export const LOGO_ASPECT = ${(width / height).toFixed(4)};

/** Brand colours measured off the source asset. */
export const LOGO_WORDMARK_COLOUR = "${creamHex}";
export const LOGO_ACCENT_COLOUR = "${accentHex}";

/** The "codex" wordmark. */
export const LOGO_WORDMARK_PATH =
  "${wordmark}";

/** The angle brackets, slash and trailing caret bar. */
export const LOGO_ACCENT_PATH =
  "${accent}";
`,
);

console.log(`traced ${width}x${height}`);
console.log(`  wordmark ${wordmark.length}B  ${creamHex}`);
console.log(`  accent   ${accent.length}B  ${accentHex}`);
console.log(`wrote ${PATHS_OUT}`);
console.log(`wrote ${SVG_OUT}`);
