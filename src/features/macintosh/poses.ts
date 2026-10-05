/**
 * Where the Macintosh sits for each home section. x/y are fractions of the
 * viewport measured from its center, `size` is the rig height as a fraction
 * of the viewport height. The scene interpolates between consecutive poses
 * while the next section scrolls in.
 */
export interface Pose {
  x: number;
  y: number;
  size: number;
  /** Max rig width as a fraction of the viewport width. */
  maxWidth?: number;
  rx: number;
  ry: number;
  rz?: number;
  /** 0 = beige plastic, 1 = blueprint wireframe. */
  xray?: number;
  /** Keycaps float off the keyboard. */
  explode?: number;
  /** Full turns added while the section is held on screen. */
  spin?: number;
  /** Fit inside the floating dock frame instead of using x/y/size. */
  docked?: boolean;
}

export interface DockBox {
  x: number;
  y: number;
  size: number;
  maxWidth: number;
}

type PoseMap = Record<string, Pose>;

/** Floating frame the compact layout docks the Macintosh into. Mirrors `.mac-dock` in CSS. */
export const DOCK = { width: 0.34, maxPx: 148, marginPx: 14 };

export function dockBox(viewportWidth: number, viewportHeight: number): DockBox {
  const side = Math.min(viewportWidth * DOCK.width, DOCK.maxPx);
  const center = DOCK.marginPx + side / 2;
  return {
    x: 0.5 - center / viewportWidth,
    y: -(0.5 - center / viewportHeight),
    size: (side * 0.74) / viewportHeight,
    maxWidth: (side * 0.84) / viewportWidth,
  };
}

export const desktopPoses: PoseMap = {
  top: { x: 0.27, y: 0.02, size: 0.54, maxWidth: 0.44, rx: 0.16, ry: -0.52 },
  manifesto: { x: 0, y: 0.02, size: 0.6, rx: 0.28, ry: 0.55, xray: 1, explode: 1, spin: 1 },
  experience: { x: -0.28, y: 0.2, size: 0.36, maxWidth: 0.32, rx: 0.12, ry: 0.5 },
  projects: { x: 0.32, y: 0.02, size: 0.44, maxWidth: 0.33, rx: 0.14, ry: -0.45 },
  lab: { x: -0.31, y: 0.02, size: 0.42, maxWidth: 0.32, rx: 0.16, ry: 0.5 },
  contact: { x: 0.22, y: -0.04, size: 0.62, maxWidth: 0.5, rx: 0.06, ry: -0.2 },
};

const docked: Pose = { x: 0, y: 0, size: 0, rx: 0.12, ry: -0.36, docked: true };

export const compactPoses: PoseMap = {
  top: { x: 0.02, y: 0.255, size: 0.29, maxWidth: 0.9, rx: 0.16, ry: -0.42 },
  manifesto: { ...docked, xray: 1, explode: 1, spin: 1 },
  experience: docked,
  projects: docked,
  lab: docked,
  contact: { x: 0, y: -0.2, size: 0.3, maxWidth: 0.9, rx: 0.1, ry: -0.18 },
};

export type ResolvedPose = Required<Omit<Pose, 'docked'>>;

const TAU = Math.PI * 2;

const smooth = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

function resolve(pose: Pose | undefined, turns: number, dock: DockBox | null): ResolvedPose {
  const base = pose ?? desktopPoses.top;
  const frame = base.docked && dock ? dock : base;
  return {
    x: frame.x,
    y: frame.y,
    size: frame.size,
    maxWidth: frame.maxWidth ?? 0.9,
    rx: base.rx,
    ry: base.ry + turns * TAU,
    rz: base.rz ?? 0,
    xray: base.xray ?? 0,
    explode: base.explode ?? 0,
    spin: base.spin ?? 0,
  };
}

/** Pose for a continuous section position (`float`) and hold progress. */
export function poseAt(ids: string[], poses: PoseMap, float: number, hold: number, out: ResolvedPose, dock: DockBox | null = null) {
  const index = Math.max(0, Math.min(ids.length - 1, Math.floor(float)));
  const t = smooth(Math.min(1, Math.max(0, float - index)));

  let turnsBefore = 0;
  for (let i = 0; i < index; i += 1) turnsBefore += poses[ids[i]]?.spin ?? 0;
  const current = resolve(poses[ids[index]], turnsBefore + (poses[ids[index]]?.spin ?? 0) * (float - index > 0 ? 1 : hold), dock);
  const next = resolve(poses[ids[index + 1]] ?? poses[ids[index]], turnsBefore + (poses[ids[index]]?.spin ?? 0), dock);

  (Object.keys(current) as (keyof ResolvedPose)[]).forEach((key) => {
    out[key] = lerp(current[key], next[key], t);
  });
  return out;
}
