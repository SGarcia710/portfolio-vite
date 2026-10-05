import Lenis from 'lenis';
import { useEffect, type ReactNode } from 'react';
import { gsap, ScrollTrigger } from './gsap';
import { usePrefersReducedMotion } from './media';

let lenis: Lenis | null = null;

const HEADER_OFFSET = -88;

/** Scrolls through Lenis when it is running, natively otherwise. */
export function scrollToTarget(target: HTMLElement | number, options: { immediate?: boolean } = {}) {
  if (lenis) {
    lenis.scrollTo(target, { offset: typeof target === 'number' ? 0 : HEADER_OFFSET, immediate: options.immediate, duration: 1.4 });
    return;
  }
  const top = typeof target === 'number' ? target : target.getBoundingClientRect().top + window.scrollY + HEADER_OFFSET;
  window.scrollTo({ top: Math.max(0, top), behavior: options.immediate ? 'instant' : 'smooth' });
}

/** Lets React commit and pinned sections rebuild. A timer, not rAF: rAF never fires in hidden tabs. */
const settle = () => new Promise((resolve) => setTimeout(resolve, 80));

/**
 * Runs a re-render that changes page height (e.g. a language switch rebuilding
 * pinned sections) and keeps the element at the top of the viewport in place.
 */
export async function keepScrollAnchor(task: () => Promise<unknown>) {
  // Closest first; outer sections back up inner elements that remount with the new copy.
  const anchors = [...document.querySelectorAll<HTMLElement>('main [id], main section')]
    .map((element) => ({ element, rect: element.getBoundingClientRect() }))
    .filter(({ rect }) => rect.top <= 1 && rect.bottom > 0)
    .sort((a, b) => b.rect.top - a.rect.top);

  await task();
  await settle();
  ScrollTrigger.refresh();
  const anchor = anchors.find(({ element }) => element.isConnected);
  if (!anchor) return;
  const delta = anchor.element.getBoundingClientRect().top - anchor.rect.top;
  if (Math.abs(delta) > 1) scrollToTarget(window.scrollY + delta, { immediate: true });
}

export function setScrollLocked(locked: boolean) {
  if (lenis) {
    if (locked) lenis.stop();
    else lenis.start();
  }
  document.documentElement.classList.toggle('is-scroll-locked', locked);
}

export function SmoothScroll({ children }: { children: ReactNode }) {
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    if (reduced) return;
    const instance = new Lenis({ lerp: 0.1, wheelMultiplier: 0.9, anchors: false, allowNestedScroll: true });
    lenis = instance;
    instance.on('scroll', ScrollTrigger.update);
    const tick = (time: number) => instance.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    return () => {
      gsap.ticker.remove(tick);
      instance.destroy();
      lenis = null;
    };
  }, [reduced]);

  return children;
}
