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
