/**
 * Proportions follow the Macintosh 128K (M0001), its M0110 keyboard and
 * M0100 mouse, at roughly 1 unit = 4 inches.
 */
export const CASE = {
  width: 2.44,
  height: 3.4,
  depth: 2.75,
  frontDepth: 1.1,
  radius: 0.07,
} as const;

export const CASE_FRONT_Z = CASE.depth / 2;
export const DESK_Y = -CASE.height / 2 - 0.08;

export const SCREEN = {
  /** Bezel opening on the front face. */
  outer: { width: 2.02, height: 1.64, y: 0.62 },
  /** Opening at the back of the sloped recess. */
  inner: { width: 1.74, height: 1.32 },
  depth: 0.17,
  /** Visible phosphor area, 512x342 like the original display. */
  display: { width: 1.56, height: 1.04 },
  pixels: { width: 512, height: 342 },
} as const;

export const KEYBOARD = {
  width: 3.3,
  depth: 1.4,
  height: 0.16,
  position: [0, DESK_Y + 0.09, CASE_FRONT_Z + 1.12] as const,
};

export const MOUSE = {
  width: 0.6,
  depth: 1.04,
  height: 0.28,
  position: [2.25, DESK_Y + 0.14, CASE_FRONT_Z + 1.05] as const,
  /** Desk travel that maps the on-screen cursor across the whole display. */
  travel: { x: 0.55, z: 0.45 },
};

/** Approximate bounds of the whole rig, used to fit it in the viewport. */
export const RIG = {
  width: 4.9,
  height: 3.7,
  center: [0.3, 0, 0.9] as const,
};

export const COLORS = {
  plastic: '#d9d0bc',
  plasticShade: '#c4bba6',
  keycap: '#cfc6b1',
  keycapMod: '#bdb49f',
  slot: '#151515',
  glass: '#1c1f22',
  blueprint: '#0f1418',
  accent: '#4dabf7',
  brand: '#ff5b2b',
  phosphor: '#e9f1ff',
} as const;
