/**
 * "Macintosh 128K" by kreems (CC BY 4.0), cleaned up in Blender: desk props
 * removed, keycaps split into named nodes and the CRT given a 0..1 UV.
 * The model is authored in meters with the desk surface at y = 0.
 */
export const MODEL = {
  url: '/models/macintosh-128k.glb',
  /** Meters to scene units: the case becomes 3.4 units tall. */
  scale: 3.4 / 0.4285,
  /** Desk travel in meters that maps the cursor across the whole display. */
  mouseTravel: { x: 0.028, z: 0.022 },
  keyTravel: 0.0035,
  /** Fraction of the CRT glass covered by the 512x342 raster (u0, v0, u1, v1). */
  raster: [0.075, 0.15, 0.925, 0.85] as const,
};

export const DESK_Y = -1.7;

export const SCREEN = {
  pixels: { width: 512, height: 342 },
} as const;

/** Bounds of the whole rig in scene units, used to fit it in the viewport. */
export const RIG = {
  width: 5.7,
  height: 3.6,
  center: [0.46, 0.05, 1.3] as const,
};

export const COLORS = {
  blueprint: '#0f1418',
  accent: '#4dabf7',
  brand: '#ff5b2b',
} as const;
