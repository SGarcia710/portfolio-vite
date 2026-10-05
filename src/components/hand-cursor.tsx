import { useEffect, useRef } from 'react';
import { gsap } from '../lib/gsap';
import { FINE_POINTER, prefersReducedMotion, useMediaQuery } from '../lib/media';

/** Same set as the native cursor rule in base.css. */
const INTERACTIVE = 'a[href], button:not(:disabled), [role="button"], [role="tab"], label[for], select, summary';
/** Fingertip in the 21x24 art (tools/cursors/hand.py). */
const HOTSPOT = { x: 7, y: 1 };
const ORIGIN = `${HOTSPOT.x}px ${HOTSPOT.y}px`;

/**
 * The classic pointing hand as the only cursor on fine pointers. It follows
 * the mouse 1:1, grows and waves over anything clickable, taps while it
 * waits there and squashes on press. Touch devices keep the system cursor.
 */
export function HandCursor() {
  const fine = useMediaQuery(FINE_POINTER);
  const root = useRef<HTMLDivElement>(null);
  const hover = useRef<HTMLSpanElement>(null);
  const hand = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const el = root.current;
    const grow = hover.current;
    const finger = hand.current;
    if (!fine || !el || !grow || !finger) return undefined;

    const html = document.documentElement;
    const reduced = prefersReducedMotion();
    let target: Element | null = null;
    let pressed = false;
    let tapping: gsap.core.Timeline | null = null;
    gsap.set([grow, finger], { transformOrigin: ORIGIN });

    const startTapping = () => {
      tapping?.kill();
      if (reduced) return;
      tapping = gsap.timeline({ repeat: -1, repeatDelay: 1.3, delay: 0.7 })
        .to(finger, { y: 1.5, scaleY: 0.9, duration: 0.07, ease: 'power2.in' })
        .to(finger, { y: 0, scaleY: 1, duration: 0.14, ease: 'back.out(3)' })
        .to(finger, { y: 1.5, scaleY: 0.9, duration: 0.07, ease: 'power2.in' }, '+=0.06')
        .to(finger, { y: 0, scaleY: 1, duration: 0.18, ease: 'back.out(3)' });
    };

    const stopTapping = () => {
      tapping?.kill();
      tapping = null;
      gsap.to(finger, { y: 0, scaleY: 1, duration: 0.15, overwrite: 'auto' });
    };

    const enter = () => {
      gsap.killTweensOf(grow);
      if (reduced) {
        gsap.to(grow, { scale: 1.4, duration: 0.2 });
        return;
      }
      gsap.timeline()
        .to(grow, { scale: 1.5, duration: 0.55, ease: 'back.out(3)' }, 0)
        .to(grow, { keyframes: { rotation: [-16, 12, -6, 0] }, duration: 0.6, ease: 'sine.inOut' }, 0);
      startTapping();
    };

    const leave = () => {
      stopTapping();
      gsap.killTweensOf(grow);
      gsap.to(grow, { scale: 1, rotation: 0, duration: 0.4 });
    };

    const show = (visible: boolean) => gsap.to(el, { autoAlpha: visible ? 1 : 0, duration: 0.2, overwrite: 'auto' });

    const onMove = (event: PointerEvent) => {
      if (event.pointerType === 'touch') return;
      el.style.transform = `translate3d(${event.clientX - HOTSPOT.x}px, ${event.clientY - HOTSPOT.y}px, 0)`;
      if (el.style.visibility !== 'inherit') show(true);
      const next = (event.target as Element | null)?.closest?.(INTERACTIVE) ?? null;
      if (next === target) return;
      target = next;
      if (target) enter();
      else leave();
    };

    const onDown = (event: PointerEvent) => {
      if (event.pointerType === 'touch') return;
      pressed = true;
      tapping?.pause();
      gsap.to(finger, { scale: 0.8, y: 1, duration: 0.08, ease: 'power2.out', overwrite: 'auto' });
    };

    const onUp = () => {
      if (!pressed) return;
      pressed = false;
      gsap.to(finger, { scale: 1, y: 0, duration: 0.35, ease: 'back.out(4)', overwrite: 'auto' });
      if (target) startTapping();
    };

    const onLeaveWindow = (event: MouseEvent) => {
      if (!event.relatedTarget) show(false);
    };
    const onBlur = () => show(false);

    html.classList.add('has-hand-cursor');
    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerdown', onDown, { passive: true });
    window.addEventListener('pointerup', onUp, { passive: true });
    document.addEventListener('mouseout', onLeaveWindow);
    window.addEventListener('blur', onBlur);

    return () => {
      html.classList.remove('has-hand-cursor');
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointerup', onUp);
      document.removeEventListener('mouseout', onLeaveWindow);
      window.removeEventListener('blur', onBlur);
      tapping?.kill();
      gsap.killTweensOf([el, grow, finger]);
    };
  }, [fine]);

  if (!fine) return null;

  return (
    <div ref={root} aria-hidden="true" className="hand-cursor">
      <span ref={hover} className="block">
        <img ref={hand} src="/cursors/hand@2x.png" alt="" width={21} height={24} draggable={false} />
      </span>
    </div>
  );
}
