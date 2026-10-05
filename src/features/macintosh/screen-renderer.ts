import * as THREE from 'three';
import { SCREEN } from './constants';
import { ARROW, ENVELOPE, HAPPY_MAC, drawBitmap } from './pixel-art';

export interface ScreenContent {
  id: string;
  file: string;
  title: string;
  line: string;
}

type Phase = 'off' | 'boot' | 'zoom' | 'typing' | 'idle';

const W = SCREEN.pixels.width;
const H = SCREEN.pixels.height;
const WINDOW = { x: 30, y: 34, w: 452, h: 290 };
const SCROLLBAR = { x: WINDOW.x + WINDOW.w - 17, y: WINDOW.y + 20, w: 17 };
const PIXEL_FONT = '"Geist Pixel", monospace';
const BOOT_DURATION = 1.1;
const ZOOM_DURATION = 0.32;
const CHAR_DELAY = 0.075;

/**
 * Draws a System 1 style desktop into a 1-bit 512x342 canvas used as the
 * Macintosh display texture. The window title types itself whenever the
 * active section changes and reports each key so the 3D keyboard can press it.
 */
export class ScreenRenderer {
  readonly texture: THREE.CanvasTexture;
  /** Cursor position in display pixels. */
  readonly cursor = new THREE.Vector2(W * 0.7, H * 0.72);
  dragging = false;

  private readonly canvas: HTMLCanvasElement;
  private readonly ctx: CanvasRenderingContext2D;
  private phase: Phase = 'off';
  private phaseTime = 0;
  private content: ScreenContent | null = null;
  private pending: ScreenContent | null = null;
  private typed = 0;
  private lineTyped = 0;
  private time = 0;
  private progress = 0;
  private lastScroll = -10;
  private caretOn = true;
  private dirty = true;
  private readonly cursorTarget = new THREE.Vector2(W * 0.7, H * 0.72);

  constructor(private readonly onKey: (char: string) => void) {
    this.canvas = document.createElement('canvas');
    this.canvas.width = W;
    this.canvas.height = H;
    this.ctx = this.canvas.getContext('2d', { willReadFrequently: true })!;
    this.ctx.imageSmoothingEnabled = false;
    this.texture = new THREE.CanvasTexture(this.canvas);
    this.texture.colorSpace = THREE.SRGBColorSpace;
    this.texture.magFilter = THREE.NearestFilter;
    this.texture.minFilter = THREE.LinearMipmapLinearFilter;
    this.texture.anisotropy = 4;
    this.draw();
  }

  /** Starts the power-on sequence. */
  boot() {
    if (this.phase !== 'off') return;
    this.setPhase('boot');
  }

  /** Opens a new window for `content`, typing its title. */
  show(content: ScreenContent) {
    if (this.content?.id === content.id && this.content.title === content.title) return;
    if (this.phase === 'off' || this.phase === 'boot') {
      this.pending = content;
      return;
    }
    this.content = content;
    this.typed = 0;
    this.lineTyped = 0;
    this.setPhase('zoom');
  }

  /** Feeds page scroll progress (0..1) and whether the visitor is scrolling. */
  scroll(progress: number, moving: boolean) {
    if (Math.abs(progress - this.progress) > 0.0005) this.dirty = true;
    this.progress = progress;
    if (moving) this.lastScroll = this.time;
  }

  update(delta: number): boolean {
    this.time += delta;
    this.phaseTime += delta;

    if (this.phase === 'boot' && this.phaseTime > BOOT_DURATION) {
      this.content = this.pending;
      this.pending = null;
      this.setPhase(this.content ? 'zoom' : 'idle');
    } else if (this.phase === 'zoom') {
      this.dirty = true;
      if (this.phaseTime > ZOOM_DURATION) this.setPhase('typing');
    } else if (this.phase === 'typing' && this.content) {
      this.advanceTyping();
    }

    const caret = Math.floor(this.time * 1.8) % 2 === 0;
    if (caret !== this.caretOn) {
      this.caretOn = caret;
      this.dirty = true;
    }

    this.updateCursor(delta);

    if (this.dirty) {
      this.draw();
      this.dirty = false;
      return true;
    }
    return false;
  }

  /** Forces a redraw, e.g. once the pixel font has loaded. */
  invalidate() {
    this.dirty = true;
  }

  dispose() {
    this.texture.dispose();
  }

  private setPhase(phase: Phase) {
    this.phase = phase;
    this.phaseTime = 0;
    this.dirty = true;
  }

  private advanceTyping() {
    const content = this.content!;
    const title = [...content.title];
    const line = [...content.line];
    const elapsed = this.phaseTime;
    // A little rhythm makes the typing read as human.
    const jitter = (i: number) => (Math.sin(i * 12.9898) * 0.5 + 0.5) * 0.05;
    let titleTarget = 0;
    let t = 0;
    while (titleTarget < title.length && elapsed > t + CHAR_DELAY + jitter(titleTarget)) {
      t += CHAR_DELAY + jitter(titleTarget);
      titleTarget += 1;
    }
    while (this.typed < titleTarget) {
      this.onKey(title[this.typed]);
      this.typed += 1;
      this.dirty = true;
    }
    if (this.typed < title.length) return;

    const lineStart = t + 0.35;
    const lineTarget = Math.min(line.length, Math.max(0, Math.floor((elapsed - lineStart) / 0.028)));
    if (this.lineTyped === 0 && lineTarget > 0) this.onKey('\n');
    if (lineTarget !== this.lineTyped) {
      this.lineTyped = lineTarget;
      this.dirty = true;
    }
    if (this.lineTyped >= line.length) this.setPhase('idle');
  }

  private thumbY() {
    const top = SCROLLBAR.y + 16;
    const bottom = WINDOW.y + WINDOW.h - 17 - 16 - 16;
    return top + (bottom - top) * this.progress;
  }

  private updateCursor(delta: number) {
    const scrolling = this.time - this.lastScroll < 0.45 && this.phase !== 'off' && this.phase !== 'boot';
    this.dragging = scrolling;
    if (scrolling) {
      this.cursorTarget.set(SCROLLBAR.x + 8, this.thumbY() + 7);
    } else if (this.content && this.phase !== 'zoom') {
      this.cursorTarget.set(WINDOW.x + 250 + Math.sin(this.time * 0.6) * 30, WINDOW.y + 214 + Math.cos(this.time * 0.45) * 14);
    }
    const before = this.cursor.clone();
    const ease = 1 - Math.exp(-delta * (scrolling ? 22 : 3));
    this.cursor.lerp(this.cursorTarget, ease);
    if (before.distanceToSquared(this.cursor) > 0.04) this.dirty = true;
  }

  private draw() {
    const { ctx } = this;
    if (this.phase === 'off') {
      ctx.fillStyle = '#000';
      ctx.fillRect(0, 0, W, H);
      this.texture.needsUpdate = true;
      return;
    }

    this.drawDesktop();

    if (this.phase === 'boot') {
      ctx.fillStyle = '#fff';
      ctx.fillRect(0, 0, W, H);
      drawBitmap(ctx, HAPPY_MAC, W / 2 - 24, H / 2 - 40, 3);
      this.text('Welcome to Macintosh.', W / 2, H / 2 + 46, 12, 'center');
    } else {
      this.drawMenuBar();
      if (this.phase === 'zoom') this.drawZoom(this.phaseTime / ZOOM_DURATION);
      else if (this.content) this.drawWindow(this.content);
      drawBitmap(ctx, ARROW, Math.round(this.cursor.x), Math.round(this.cursor.y), 1);
    }

    this.quantize();
    this.texture.needsUpdate = true;
  }

  private drawDesktop() {
    const { ctx } = this;
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = '#000';
    for (let y = 20; y < H; y += 2) {
      for (let x = (y / 2) % 2 === 0 ? 0 : 2; x < W; x += 4) ctx.fillRect(x, y, 1, 1);
    }
  }

  private drawMenuBar() {
    const { ctx } = this;
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, W, 19);
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 19, W, 1);
    // SG monogram in place of the Apple menu.
    ctx.fillRect(12, 4, 9, 2);
    ctx.fillRect(12, 4, 2, 6);
    ctx.fillRect(12, 9, 9, 2);
    ctx.fillRect(19, 9, 2, 6);
    ctx.fillRect(12, 14, 9, 2);
    ['File', 'Edit', 'View', 'Special'].forEach((item, index) => {
      this.text(item, 36 + [0, 40, 80, 124][index], 14, 12);
    });
  }

  private drawZoom(progress: number) {
    const { ctx } = this;
    ctx.fillStyle = '#000';
    for (let i = 0; i < 4; i += 1) {
      const p = Math.min(1, Math.max(0, progress * 1.3 - i * 0.1));
      const w = 24 + (WINDOW.w - 24) * p;
      const h = 16 + (WINDOW.h - 16) * p;
      const x = W / 2 + (WINDOW.x + WINDOW.w / 2 - W / 2) * p - w / 2;
      const y = H / 2 + 40 * (1 - p) + (WINDOW.y + WINDOW.h / 2 - H / 2 - 40) * p - h / 2;
      ctx.strokeStyle = '#000';
      ctx.lineWidth = 1;
      ctx.setLineDash([2, 2]);
      ctx.strokeRect(Math.round(x) + 0.5, Math.round(y) + 0.5, Math.round(w), Math.round(h));
    }
    ctx.setLineDash([]);
  }

  private drawWindow(content: ScreenContent) {
    const { ctx } = this;
    const { x, y, w, h } = WINDOW;

    ctx.fillStyle = '#000';
    ctx.fillRect(x + 2, y + 2, w, h);
    ctx.fillStyle = '#fff';
    ctx.fillRect(x, y, w, h);
    ctx.fillStyle = '#000';
    ctx.fillRect(x, y, w, 1);
    ctx.fillRect(x, y + h - 1, w, 1);
    ctx.fillRect(x, y, 1, h);
    ctx.fillRect(x + w - 1, y, 1, h);

    // Title bar.
    for (let i = 0; i < 6; i += 1) ctx.fillRect(x + 2, y + 4 + i * 2, w - 4, 1);
    ctx.fillRect(x, y + 19, w, 1);
    ctx.fillStyle = '#fff';
    ctx.fillRect(x + 8, y + 3, 13, 13);
    ctx.fillStyle = '#000';
    ctx.strokeStyle = '#000';
    ctx.strokeRect(x + 9.5, y + 4.5, 10, 10);
    ctx.font = `12px ${PIXEL_FONT}`;
    const titleWidth = ctx.measureText(content.file).width + 16;
    ctx.fillStyle = '#fff';
    ctx.fillRect(x + w / 2 - titleWidth / 2, y + 2, titleWidth, 16);
    this.text(content.file, x + w / 2, y + 14, 12, 'center');

    // Scrollbar tracks page progress.
    const sb = SCROLLBAR;
    const trackBottom = y + h - 17;
    ctx.fillStyle = '#000';
    ctx.fillRect(sb.x, sb.y, 1, trackBottom - sb.y);
    for (let py = sb.y + 16; py < trackBottom - 16; py += 1) {
      for (let px = sb.x + 1 + (py % 2); px < sb.x + sb.w - 1; px += 2) ctx.fillRect(px, py, 1, 1);
    }
    this.arrowBox(sb.x, sb.y, true);
    this.arrowBox(sb.x, trackBottom - 16, false);
    const thumb = Math.round(this.thumbY());
    ctx.fillStyle = '#000';
    ctx.fillRect(sb.x, thumb, sb.w - 1, 16);
    ctx.fillStyle = this.dragging ? '#000' : '#fff';
    ctx.fillRect(sb.x + 1, thumb + 1, sb.w - 3, 14);
    ctx.fillStyle = '#000';
    ctx.fillRect(x, trackBottom, w, 1);
    ctx.fillRect(x + w - 17, trackBottom, 1, 17);

    // Content.
    const left = x + 26;
    const maxWidth = w - 70;
    const typedTitle = [...content.title].slice(0, this.typed).join('');
    let size = 40;
    ctx.font = `${size}px ${PIXEL_FONT}`;
    while (size > 22 && ctx.measureText(content.title).width > maxWidth) {
      size -= 4;
      ctx.font = `${size}px ${PIXEL_FONT}`;
    }
    const titleY = y + 92;
    this.text(typedTitle, left, titleY, size);
    const typing = this.phase === 'typing' && this.typed < [...content.title].length;
    if (this.caretOn || typing) {
      const caretX = left + ctx.measureText(typedTitle).width + 3;
      if (this.lineTyped === 0) ctx.fillRect(Math.round(caretX), titleY - size * 0.72, Math.max(3, size * 0.12), size * 0.82);
    }
    if (this.lineTyped > 0) {
      const line = `> ${[...content.line].slice(0, this.lineTyped).join('')}`;
      this.text(line, left, titleY + 30, 12);
      if (this.caretOn) {
        ctx.font = `12px ${PIXEL_FONT}`;
        ctx.fillRect(Math.round(left + ctx.measureText(line).width + 2), titleY + 20, 7, 12);
      }
    }
    ctx.fillRect(left, titleY + 46, maxWidth, 1);
    this.drawGlyph(content.id, left, titleY + 62, maxWidth);
  }

  /** Small section-specific illustration under the title. */
  private drawGlyph(id: string, x: number, y: number, width: number) {
    const { ctx } = this;
    ctx.fillStyle = '#000';
    if (id === 'experience') {
      const rows = 7;
      for (let i = 0; i < rows; i += 1) {
        const barX = x + (rows - 1 - i) * 44;
        const barW = i === 0 ? width - barX + x : 34 + (i % 3) * 12;
        ctx.fillRect(barX, y + i * 9, barW, 6);
      }
    } else if (id === 'projects') {
      for (let i = 0; i < 11; i += 1) {
        const cx = x + i * 30;
        ctx.strokeRect(cx + 0.5, y + 0.5, 22, 28);
        if (i % 3 !== 1) ctx.fillRect(cx + 4, y + 4, 15, 14);
        ctx.fillRect(cx + 4, y + 22, 12, 2);
      }
    } else if (id === 'lab') {
      ctx.fillRect(x, y, 40, 40);
      ctx.fillStyle = '#fff';
      ctx.fillRect(x + 8, y + 8, 24, 24);
      ctx.fillStyle = '#000';
      ctx.fillRect(x + 14, y + 14, 12, 12);
      ctx.setLineDash([3, 3]);
      ctx.strokeRect(x + 56.5, y + 0.5, 40, 40);
      ctx.setLineDash([]);
      this.text('+ more soon', x + 112, y + 26, 12);
    } else if (id === 'contact') {
      drawBitmap(ctx, ENVELOPE, x, y + 4, 2);
      this.text('reply < 48h', x + 56, y + 24, 12);
    } else if (id === 'top') {
      drawBitmap(ctx, HAPPY_MAC, x, y, 2);
      this.text('ready.', x + 46, y + 24, 12);
    } else {
      for (let i = 0; i < 3; i += 1) ctx.fillRect(x, y + i * 12, width * (0.9 - i * 0.22), 4);
    }
  }

  private arrowBox(x: number, y: number, up: boolean) {
    const { ctx } = this;
    ctx.fillStyle = '#fff';
    ctx.fillRect(x + 1, y, 15, 16);
    ctx.fillStyle = '#000';
    ctx.fillRect(x, up ? y + 16 : y, 17, 1);
    for (let i = 0; i < 5; i += 1) {
      const rowY = up ? y + 4 + i : y + 11 - i;
      ctx.fillRect(x + 8 - i, rowY, i * 2 + 1, 1);
    }
  }

  private text(value: string, x: number, y: number, size: number, align: CanvasTextAlign = 'left') {
    const { ctx } = this;
    ctx.font = `${size}px ${PIXEL_FONT}`;
    ctx.textAlign = align;
    ctx.textBaseline = 'alphabetic';
    ctx.fillStyle = '#000';
    ctx.fillText(value, Math.round(x), Math.round(y));
    ctx.textAlign = 'left';
  }

  /** Snap anti-aliased text back to pure 1-bit pixels. */
  private quantize() {
    const image = this.ctx.getImageData(0, 0, W, H);
    const data = image.data;
    for (let i = 0; i < data.length; i += 4) {
      const value = data[i] > 140 ? 255 : 0;
      data[i] = data[i + 1] = data[i + 2] = value;
    }
    this.ctx.putImageData(image, 0, 0);
  }
}
