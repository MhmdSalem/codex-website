/**
 * The hero system — scene definition.
 *
 * One picture: a ground plane seen at a shallow angle, a light source where the
 * plane's axes meet, a burst of structure radiating out of it, and six labelled
 * panels standing on the plane around it.
 *
 * Every coordinate is normalised to the scene box (0–1) so the composition
 * survives any panel aspect ratio, and every rate is per second so the motion is
 * frame-rate independent. Numbers are tuned for "slow and inevitable": nothing
 * here completes a cycle in under four seconds.
 */

export const MODULE_IDS = [
  "webPlatforms",
  "aiSolutions",
  "mobileApps",
  "dataAnalytics",
  "automation",
  "integrations",
] as const;

export type ModuleId = (typeof MODULE_IDS)[number];

export interface ModulePanel {
  id: ModuleId;
  /** Centre of the panel inside the scene box. */
  x: number;
  y: number;
  /**
   * Orientation in degrees. The panels are plates standing on the plane, each
   * turned to face the core: `tiltY` is positive on the left of the core and
   * negative on the right, because a positive Y rotation swings a face to the
   * right. `tiltX` leans with the plane — back above the horizon, forward below
   * it — and `roll` is the small imprecision that stops six plates from looking
   * like a rendering of six plates.
   */
  tiltY: number;
  tiltX: number;
  roll: number;
  /**
   * Parallax weight. Panels further from the core read as nearer the viewer and
   * travel further under the pointer, which is what makes a flat scene deep.
   */
  depth: number;
}

/**
 * Deliberately uneven.
 *
 * A ring of six evenly spaced labels is an org chart. The reference scatters
 * them at different radii and heights so the system looks grown rather than
 * arranged, and the gaps carry as much of that as the positions do.
 */
export const modulePanels: readonly ModulePanel[] = [
  { id: "webPlatforms", x: 0.25, y: 0.31, tiltY: 24, tiltX: 9, roll: -3, depth: 0.8 },
  { id: "aiSolutions", x: 0.635, y: 0.24, tiltY: -15, tiltX: 9, roll: 2, depth: 0.55 },
  { id: "mobileApps", x: 0.845, y: 0.425, tiltY: -26, tiltX: 4, roll: 3, depth: 0.95 },
  { id: "dataAnalytics", x: 0.1, y: 0.565, tiltY: 28, tiltX: 3, roll: -4, depth: 1 },
  { id: "automation", x: 0.77, y: 0.655, tiltY: -21, tiltX: -8, roll: 4, depth: 0.75 },
  { id: "integrations", x: 0.36, y: 0.715, tiltY: 18, tiltX: -9, roll: -3, depth: 0.85 },
];

export const scene = {
  /** The light source, and the vanishing point of every axis in the scene. */
  core: { x: 0.48, y: 0.52 },

  /** The mark sits just above the core rather than on it, so it reads against
   *  the dark instead of dissolving into the light. */
  mark: { x: 0.49, y: 0.44 },

  /** Retina past this buys nothing on soft strokes and costs fill rate. */
  maxPixelRatio: 1.5,

  /**
   * Vertical compression of the plane.
   *
   * This single number is what makes the scene a place rather than a pinwheel:
   * it is the cosine of the camera's angle to the ground. Above ~0.5 the plane
   * reads as a flat target seen head-on; below ~0.2 it collapses to a line.
   */
  squash: 0.32,

  /**
   * Two radii, and the gap between them is the composition.
   *
   * `discScale` is the structured plane — rings, spokes, the feet of the shafts —
   * as a fraction of the box's short side. `fieldScale` is how far the loose
   * material scatters, off the long side. One radius for both gives an evenly
   * dense pinwheel; a tight disc inside a wide sparse field is what reads as a
   * system sitting in space.
   */
  discScale: 0.19,
  fieldScale: 0.55,

  /**
   * The burst, which is two different things drawn on top of each other.
   *
   * `rays` are light: they leave the core in every screen direction and are only
   * slightly squashed, because a ray is not lying on the ground — it is coming
   * towards the camera. `spokes` are structure: axes of the plane itself, squashed
   * exactly as much as the plane is. Drawing the burst as spokes alone flattens it
   * into a fan; drawing it as rays alone loses the plane.
   */
  rays: 190,
  raysLow: 76,
  raySquash: 0.82,
  rayReach: 0.48,

  spokes: 56,
  spokesLow: 28,
  spokeReach: 1.7,

  /** Concentric rings on the plane, plus the two that are drawn brighter. */
  rings: 13,
  orbits: [0.62, 0.95],

  /** The receding floor grid under the plane. */
  gridColumns: 44,
  gridRows: 11,

  /** Nodes on the plane, and how many neighbours each one links to. */
  nodes: 190,
  nodesLow: 64,
  links: 2,

  /** Radians per second the whole node field turns. One revolution ≈ 17 min. */
  fieldSpin: 0.006,

  /** Vertical light shafts rising out of the plane. */
  shafts: 70,
  shaftsLow: 26,

  /** Drifting dust. */
  particles: 110,
  particlesLow: 40,

  /** Packets in flight, and the fraction of a link covered per second. */
  packets: 16,
  packetSpeed: 0.16,

  /**
   * Pointer follow. Heavy on purpose — a 1:1 response reads as a mouse-over,
   * and this is meant to read as a camera on a long lens.
   */
  pointerLerp: 0.045,
  /** Pixels of travel at depth 1, at the extremes of the viewport. */
  parallax: 26,

  /** Seconds for the scene to rise on first paint. */
  introDuration: 2.2,
} as const;
