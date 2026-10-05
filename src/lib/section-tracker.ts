import { useEffect, useRef, useSyncExternalStore } from 'react';
import { gsap, ScrollTrigger } from './gsap';

interface Measured {
  id: string;
  top: number;
  height: number;
}

/**
 * Continuous scroll state shared by the DOM (header, progress rail) and the
 * WebGL scene. It is mutated on the GSAP ticker instead of React state so the
 * scene can read it every frame without re-rendering anything.
 */
export interface ScrollSnapshot {
  /** Section index plus 0..1 progress of the transition towards the next one. */
  float: number;
  /** 0..1 progress through the "hold" range of the current section. */
  hold: number;
  /** Page progress 0..1. */
  progress: number;
  /** Smoothed scroll velocity in px/frame. */
  velocity: number;
  activeId: string | null;
  activeIndex: number;
}

export const scrollState: ScrollSnapshot = {
  float: 0,
  hold: 0,
  progress: 0,
  velocity: 0,
  activeId: null,
  activeIndex: 0,
};

const elements = new Map<string, HTMLElement>();
let measured: Measured[] = [];
let lastY = 0;
let running = false;
let observer: ResizeObserver | null = null;
const listeners = new Set<() => void>();

function measure() {
  const y = window.scrollY;
  measured = [...elements].map(([id, el]) => {
    const rect = el.getBoundingClientRect();
    return { id, top: rect.top + y, height: rect.height };
  }).sort((a, b) => a.top - b.top);
}

/** Ids of the tracked sections in document order. */
export function getSectionIds(): string[] {
  return measured.map((section) => section.id);
}

function setActive(index: number) {
  const id = measured[index]?.id ?? null;
  if (id === scrollState.activeId) return;
  scrollState.activeId = id;
  scrollState.activeIndex = index;
  listeners.forEach((listener) => listener());
}

function update() {
  if (!measured.length) return;
  const y = window.scrollY;
  const vh = window.innerHeight;
  scrollState.velocity += (y - lastY - scrollState.velocity) * 0.2;
  lastY = y;

  const max = Math.max(1, document.documentElement.scrollHeight - vh);
  scrollState.progress = Math.min(1, Math.max(0, y / max));

  // Each section holds its pose while it fills the viewport and hands over to
  // the next one while that one scrolls in from the bottom.
  let float = 0;
  let hold = 0;
  for (let i = 0; i < measured.length; i += 1) {
    const section = measured[i];
    const holdEnd = Math.max(section.top, section.top + section.height - vh);
    const next = measured[i + 1];
    if (y < holdEnd || !next) {
      float = i;
      const range = holdEnd - section.top;
      hold = range > 0 ? Math.min(1, Math.max(0, (y - section.top) / range)) : 0;
      if (y < section.top) hold = 0;
      break;
    }
    if (y < next.top) {
      float = i + (y - holdEnd) / Math.max(1, next.top - holdEnd);
      hold = 1;
      break;
    }
  }
  scrollState.float = float;
  scrollState.hold = hold;

  const probe = y + vh * 0.45;
  let active = 0;
  measured.forEach((section, index) => {
    if (probe >= section.top) active = index;
  });
  setActive(active);
}

function start() {
  if (running) return;
  running = true;
  lastY = window.scrollY;
  observer = new ResizeObserver(() => measure());
  observer.observe(document.body);
  ScrollTrigger.addEventListener('refresh', measure);
  gsap.ticker.add(update);
}

function stop() {
  running = false;
  observer?.disconnect();
  observer = null;
  ScrollTrigger.removeEventListener('refresh', measure);
  gsap.ticker.remove(update);
  scrollState.activeId = null;
  listeners.forEach((listener) => listener());
}

export function registerSection(id: string, el: HTMLElement) {
  elements.set(id, el);
  start();
  measure();
  return () => {
    elements.delete(id);
    measure();
    if (!elements.size) stop();
  };
}

export function subscribeActiveSection(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/** Attach to a section root so the tracker (and the scene) follows it. */
export function useTrackedSection<T extends HTMLElement>(id: string) {
  const ref = useRef<T>(null);
  useEffect(() => {
    if (!ref.current) return undefined;
    return registerSection(id, ref.current);
  }, [id]);
  return ref;
}

export function useActiveSection(): string | null {
  return useSyncExternalStore(subscribeActiveSection, () => scrollState.activeId, () => null);
}
