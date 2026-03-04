import { useEffect, useRef } from 'react';

// Each logo is a 16x16 grid. null = transparent, string = hex color.
type PixelGrid = (string | null)[][];

const _ = null; // shorthand for transparent

// ── React (Atom symbol - cyan on transparent) ───────────────────────
const REACT_LOGO: PixelGrid = (() => {
  const c = '#61DAFB';
  return [
    [_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_],
    [_,_,_,_,_,c,c,c,c,c,c,_,_,_,_,_],
    [_,_,_,c,c,_,_,_,_,_,_,c,c,_,_,_],
    [_,_,c,_,_,_,_,_,_,_,_,_,_,c,_,_],
    [_,c,_,_,_,_,_,_,_,_,_,_,_,_,c,_],
    [_,c,_,_,_,_,_,_,_,_,_,_,_,_,c,_],
    [c,_,_,_,_,_,_,c,c,_,_,_,_,_,_,c],
    [c,_,_,_,_,_,c,c,c,c,_,_,_,_,_,c],
    [c,_,_,_,_,_,c,c,c,c,_,_,_,_,_,c],
    [c,_,_,_,_,_,_,c,c,_,_,_,_,_,_,c],
    [_,c,_,_,_,_,_,_,_,_,_,_,_,_,c,_],
    [_,c,_,_,_,_,_,_,_,_,_,_,_,_,c,_],
    [_,_,c,_,_,_,_,_,_,_,_,_,_,c,_,_],
    [_,_,_,c,c,_,_,_,_,_,_,c,c,_,_,_],
    [_,_,_,_,_,c,c,c,c,c,c,_,_,_,_,_],
    [_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_],
  ];
})();

// ── Zustand (Bear face - brown) ────────────────────────────────────
const ZUSTAND_LOGO: PixelGrid = (() => {
  const b = '#453726'; // dark brown
  const f = '#D4A574'; // fur/tan
  const n = '#2C1810'; // nose dark
  const e = '#1a1a1a'; // eyes
  const w = '#FFFFFF'; // white
  return [
    [_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_],
    [_,_,b,b,_,_,_,_,_,_,_,_,b,b,_,_],
    [_,b,f,f,b,_,_,_,_,_,_,b,f,f,b,_],
    [_,b,f,f,b,_,_,_,_,_,_,b,f,f,b,_],
    [_,_,b,b,b,b,b,b,b,b,b,b,b,b,_,_],
    [_,_,b,f,f,f,f,f,f,f,f,f,f,b,_,_],
    [_,b,f,f,f,f,f,f,f,f,f,f,f,f,b,_],
    [_,b,f,f,e,e,f,f,f,f,e,e,f,f,b,_],
    [_,b,f,f,e,w,f,f,f,f,e,w,f,f,b,_],
    [_,b,f,f,f,f,f,n,n,f,f,f,f,f,b,_],
    [_,b,f,f,f,f,n,n,n,n,f,f,f,f,b,_],
    [_,_,b,f,f,f,f,n,n,f,f,f,f,b,_,_],
    [_,_,b,f,f,f,f,f,f,f,f,f,f,b,_,_],
    [_,_,_,b,b,f,f,f,f,f,f,b,b,_,_,_],
    [_,_,_,_,_,b,b,b,b,b,b,_,_,_,_,_],
    [_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_],
  ];
})();

// ── React Native (Atom + mobile frame outline) ─────────────────────
const REACT_NATIVE_LOGO: PixelGrid = (() => {
  const c = '#61DAFB';
  const f = '#888888'; // frame
  return [
    [_,_,_,_,f,f,f,f,f,f,f,f,_,_,_,_],
    [_,_,_,_,f,_,_,_,_,_,_,f,_,_,_,_],
    [_,_,_,_,f,_,_,_,_,_,_,f,_,_,_,_],
    [_,_,_,_,f,_,c,c,c,_,_,f,_,_,_,_],
    [_,_,_,_,f,c,_,_,_,c,_,f,_,_,_,_],
    [_,_,_,_,f,c,_,_,_,c,_,f,_,_,_,_],
    [_,_,_,_,f,_,_,c,_,_,_,f,_,_,_,_],
    [_,_,_,_,f,c,_,_,_,c,_,f,_,_,_,_],
    [_,_,_,_,f,c,_,_,_,c,_,f,_,_,_,_],
    [_,_,_,_,f,_,c,c,c,_,_,f,_,_,_,_],
    [_,_,_,_,f,_,_,_,_,_,_,f,_,_,_,_],
    [_,_,_,_,f,_,_,_,_,_,_,f,_,_,_,_],
    [_,_,_,_,f,_,_,f,_,_,_,f,_,_,_,_],
    [_,_,_,_,f,f,f,f,f,f,f,f,_,_,_,_],
    [_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_],
    [_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_],
  ];
})();

// ── Tailwind CSS (Wind/wave shape - teal) ──────────────────────────
const TAILWIND_LOGO: PixelGrid = (() => {
  const t = '#06B6D4';
  return [
    [_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_],
    [_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_],
    [_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_],
    [_,_,_,_,t,t,_,_,_,_,t,t,_,_,_,_],
    [_,_,_,t,t,t,t,_,_,t,t,t,t,_,_,_],
    [_,_,t,t,_,t,t,t,t,t,_,t,t,t,_,_],
    [_,t,t,_,_,_,t,t,t,_,_,_,t,t,_,_],
    [_,t,t,_,_,_,_,t,_,_,_,_,t,t,_,_],
    [_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_],
    [_,_,t,t,_,_,_,_,t,_,_,_,t,t,_,_],
    [_,_,t,t,_,_,_,t,t,t,_,_,_,t,t,_],
    [_,_,_,t,t,t,t,t,_,t,t,t,t,_,_,_],
    [_,_,_,_,t,t,_,_,_,_,t,t,_,_,_,_],
    [_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_],
    [_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_],
    [_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_],
  ];
})();

// ── CSS3 (Shield with "CSS" text) ──────────────────────────────────
const CSS_LOGO: PixelGrid = (() => {
  const b = '#264DE4'; // blue
  const w = '#FFFFFF'; // white text
  return [
    [_,b,b,b,b,b,b,b,b,b,b,b,b,b,b,_],
    [_,b,b,b,b,b,b,b,b,b,b,b,b,b,b,_],
    [_,b,b,_,_,_,_,_,_,_,_,_,_,b,b,_],
    [_,b,b,_,_,_,_,_,_,_,_,_,_,b,b,_],
    [_,b,b,_,w,w,_,w,w,_,w,w,_,b,b,_],
    [_,b,b,_,w,_,_,w,_,_,w,_,_,b,b,_],
    [_,b,b,_,w,_,_,w,w,_,w,w,_,b,b,_],
    [_,b,b,_,w,_,_,_,w,_,_,w,_,b,b,_],
    [_,b,b,_,w,w,_,w,w,_,w,w,_,b,b,_],
    [_,b,b,_,_,_,_,_,_,_,_,_,_,b,b,_],
    [_,b,b,_,_,_,_,_,_,_,_,_,_,b,b,_],
    [_,_,b,b,b,b,b,b,b,b,b,b,b,b,_,_],
    [_,_,_,b,b,b,b,b,b,b,b,b,b,_,_,_],
    [_,_,_,_,b,b,b,b,b,b,b,b,_,_,_,_],
    [_,_,_,_,_,_,b,b,b,b,_,_,_,_,_,_],
    [_,_,_,_,_,_,_,b,b,_,_,_,_,_,_,_],
  ];
})();

// ── HTML5 (Shield with "< >" text) ─────────────────────────────────
const HTML_LOGO: PixelGrid = (() => {
  const o = '#E44D26'; // orange
  const w = '#FFFFFF';
  return [
    [_,o,o,o,o,o,o,o,o,o,o,o,o,o,o,_],
    [_,o,o,o,o,o,o,o,o,o,o,o,o,o,o,_],
    [_,o,o,_,_,_,_,_,_,_,_,_,_,o,o,_],
    [_,o,o,_,_,_,_,_,_,_,_,_,_,o,o,_],
    [_,o,o,_,_,w,_,_,_,_,w,_,_,o,o,_],
    [_,o,o,_,w,_,_,_,_,_,_,w,_,o,o,_],
    [_,o,o,w,_,_,_,w,_,_,_,_,w,o,o,_],
    [_,o,o,_,w,_,_,_,_,_,_,w,_,o,o,_],
    [_,o,o,_,_,w,_,_,_,_,w,_,_,o,o,_],
    [_,o,o,_,_,_,_,_,_,_,_,_,_,o,o,_],
    [_,o,o,_,_,_,_,_,_,_,_,_,_,o,o,_],
    [_,_,o,o,o,o,o,o,o,o,o,o,o,o,_,_],
    [_,_,_,o,o,o,o,o,o,o,o,o,o,_,_,_],
    [_,_,_,_,o,o,o,o,o,o,o,o,_,_,_,_],
    [_,_,_,_,_,_,o,o,o,o,_,_,_,_,_,_],
    [_,_,_,_,_,_,_,o,o,_,_,_,_,_,_,_],
  ];
})();

// ── JavaScript (Yellow box with "JS") ──────────────────────────────
const JS_LOGO: PixelGrid = (() => {
  const y = '#F7DF1E'; // yellow
  const d = '#323330'; // dark text
  return [
    [y,y,y,y,y,y,y,y,y,y,y,y,y,y,y,y],
    [y,y,y,y,y,y,y,y,y,y,y,y,y,y,y,y],
    [y,y,_,_,_,_,_,_,_,_,_,_,_,_,y,y],
    [y,y,_,_,_,_,_,_,_,_,_,_,_,_,y,y],
    [y,y,_,_,_,_,_,_,_,_,_,_,_,_,y,y],
    [y,y,_,_,_,_,d,_,_,d,d,d,_,_,y,y],
    [y,y,_,_,_,_,d,_,_,d,_,_,_,_,y,y],
    [y,y,_,_,_,_,d,_,_,d,d,d,_,_,y,y],
    [y,y,_,d,_,_,d,_,_,_,_,d,_,_,y,y],
    [y,y,_,d,_,_,d,_,_,_,_,d,_,_,y,y],
    [y,y,_,_,d,d,_,_,_,d,d,d,_,_,y,y],
    [y,y,_,_,_,_,_,_,_,_,_,_,_,_,y,y],
    [y,y,_,_,_,_,_,_,_,_,_,_,_,_,y,y],
    [y,y,_,_,_,_,_,_,_,_,_,_,_,_,y,y],
    [y,y,y,y,y,y,y,y,y,y,y,y,y,y,y,y],
    [y,y,y,y,y,y,y,y,y,y,y,y,y,y,y,y],
  ];
})();

// ── TypeScript (Blue box with "TS") ────────────────────────────────
const TS_LOGO: PixelGrid = (() => {
  const b = '#3178C6'; // blue
  const w = '#FFFFFF'; // white text
  return [
    [b,b,b,b,b,b,b,b,b,b,b,b,b,b,b,b],
    [b,b,b,b,b,b,b,b,b,b,b,b,b,b,b,b],
    [b,b,_,_,_,_,_,_,_,_,_,_,_,_,b,b],
    [b,b,_,_,_,_,_,_,_,_,_,_,_,_,b,b],
    [b,b,_,_,_,_,_,_,_,_,_,_,_,_,b,b],
    [b,b,_,w,w,w,_,_,_,w,w,w,_,_,b,b],
    [b,b,_,_,w,_,_,_,_,w,_,_,_,_,b,b],
    [b,b,_,_,w,_,_,_,_,w,w,w,_,_,b,b],
    [b,b,_,_,w,_,_,_,_,_,_,w,_,_,b,b],
    [b,b,_,_,w,_,_,_,_,_,_,w,_,_,b,b],
    [b,b,_,_,w,_,_,_,_,w,w,w,_,_,b,b],
    [b,b,_,_,_,_,_,_,_,_,_,_,_,_,b,b],
    [b,b,_,_,_,_,_,_,_,_,_,_,_,_,b,b],
    [b,b,_,_,_,_,_,_,_,_,_,_,_,_,b,b],
    [b,b,b,b,b,b,b,b,b,b,b,b,b,b,b,b],
    [b,b,b,b,b,b,b,b,b,b,b,b,b,b,b,b],
  ];
})();

// ── Logo registry ──────────────────────────────────────────────────
export interface PixelLogoConfig {
  name: string;
  grid: PixelGrid;
  glowColor: string;
}

export const PIXEL_LOGOS: PixelLogoConfig[] = [
  { name: 'React', grid: REACT_LOGO, glowColor: '#61DAFB' },
  { name: 'Zustand', grid: ZUSTAND_LOGO, glowColor: '#D4A574' },
  { name: 'React Native', grid: REACT_NATIVE_LOGO, glowColor: '#61DAFB' },
  { name: 'Tailwind', grid: TAILWIND_LOGO, glowColor: '#06B6D4' },
  { name: 'CSS', grid: CSS_LOGO, glowColor: '#264DE4' },
  { name: 'HTML', grid: HTML_LOGO, glowColor: '#E44D26' },
  { name: 'JavaScript', grid: JS_LOGO, glowColor: '#F7DF1E' },
  { name: 'TypeScript', grid: TS_LOGO, glowColor: '#3178C6' },
];

// ── Canvas-based Pixel Logo Renderer ───────────────────────────────
interface PixelLogoProps {
  config: PixelLogoConfig;
  size?: number; // total canvas size in px
}

export function PixelLogo({ config, size = 64 }: PixelLogoProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gridSize = config.grid.length;
  const pixelSize = size / gridSize;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Scale for retina displays
    const dpr = window.devicePixelRatio || 1;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    ctx.scale(dpr, dpr);

    // Clear
    ctx.clearRect(0, 0, size, size);

    // Disable image smoothing for crisp pixels
    ctx.imageSmoothingEnabled = false;

    // Draw each pixel
    for (let row = 0; row < gridSize; row++) {
      for (let col = 0; col < gridSize; col++) {
        const color = config.grid[row][col];
        if (color) {
          ctx.fillStyle = color;
          ctx.fillRect(
            Math.floor(col * pixelSize),
            Math.floor(row * pixelSize),
            Math.ceil(pixelSize),
            Math.ceil(pixelSize)
          );
        }
      }
    }
  }, [config, size, gridSize, pixelSize]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        width: size,
        height: size,
        imageRendering: 'pixelated',
      }}
      aria-label={`${config.name} pixel art logo`}
    />
  );
}
