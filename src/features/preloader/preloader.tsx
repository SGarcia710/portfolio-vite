import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { LOGO_VIEWBOX, logoPaths } from '../../components/logo';
import { getBootProgress, registerBootTask, startIntro } from '../../lib/boot';
import { gsap, useGSAP } from '../../lib/gsap';
import { prefersReducedMotion } from '../../lib/media';
import { setScrollLocked } from '../../lib/smooth-scroll';

const MAX_WAIT = 7;

const fonts = registerBootTask('fonts');
document.fonts.ready.then(fonts.done);

/**
 * Draws the SG mark as an outline while assets load, then floods it with
 * color from the bottom up and lifts away to reveal the page.
 */
export function Preloader() {
  const { t } = useTranslation('common');
  const root = useRef<HTMLDivElement>(null);
  const counter = useRef<HTMLSpanElement>(null);
  const [visible, setVisible] = useState(true);

  useGSAP(() => {
    setScrollLocked(true);
    const finish = () => {
      setScrollLocked(false);
      setVisible(false);
    };

    if (prefersReducedMotion()) {
      gsap.timeline({ onComplete: finish })
        .set('[data-fill]', { clipPath: 'inset(0% 0 0 0)' })
        .to(root.current, { autoAlpha: 0, duration: 0.4, delay: 0.3, onStart: startIntro });
      return;
    }

    const shown = { value: 0 };
    const started = performance.now();
    const intro = gsap.timeline({ paused: true, onComplete: finish });

    intro
      .to('[data-fill]', { clipPath: 'inset(0% 0 0 0)', duration: 1.1, ease: 'expo.inOut' })
      .to('[data-outline]', { autoAlpha: 0, duration: 0.4 }, '-=0.35')
      .to('[data-loader-meta]', { autoAlpha: 0, y: -8, duration: 0.4 }, '<')
      .to('[data-loader-logo]', { scale: 0.86, duration: 0.7, ease: 'expo.in' }, '+=0.1')
      .to(root.current, { clipPath: 'inset(0 0 100% 0)', duration: 1.1, ease: 'expo.inOut' }, '-=0.25')
      .add(startIntro, '-=0.75');

    gsap.timeline()
      .set('[data-outline] path', { drawSVG: '0%' })
      .to('[data-outline] path', { drawSVG: '100%', duration: 1.6, ease: 'power2.inOut', stagger: 0.14 });

    // The counter eases towards real progress and waits for the outline to finish drawing.
    const tick = (_time: number, deltaMs: number) => {
      const elapsed = (performance.now() - started) / 1000;
      const target = elapsed > MAX_WAIT ? 1 : Math.min(getBootProgress(), elapsed / 1.9);
      shown.value += (target - shown.value) * (1 - Math.exp(-deltaMs / 1000 * 5));
      if (target === 1 && shown.value > 0.995) shown.value = 1;
      if (counter.current) counter.current.textContent = String(Math.round(shown.value * 100)).padStart(3, '0');
      if (shown.value === 1) {
        gsap.ticker.remove(tick);
        intro.play();
      }
    };
    gsap.ticker.add(tick);
    return () => gsap.ticker.remove(tick);
  }, { scope: root });

  if (!visible) return null;

  return (
    <div
      ref={root}
      role="status"
      aria-live="polite"
      aria-label={t('loader.label')}
      className="fixed inset-0 z-[var(--z-loader)] grid place-items-center bg-ink-950"
      style={{ clipPath: 'inset(0 0 0% 0)' }}
    >
      <div data-loader-logo className="relative w-[clamp(6.5rem,12vw,10rem)]">
        <svg viewBox={LOGO_VIEWBOX} className="absolute inset-0 w-full" aria-hidden="true">
          {[...logoPaths.brand, ...logoPaths.ink].map((d) => <path key={d} d={d} fill="var(--color-fg)" opacity={0.035} />)}
        </svg>
        <svg data-outline viewBox={LOGO_VIEWBOX} className="relative w-full overflow-visible" aria-hidden="true" fill="none" strokeWidth={1.5} strokeLinejoin="round">
          {logoPaths.brand.map((d) => <path key={d} d={d} stroke="var(--color-brand)" vectorEffect="non-scaling-stroke" />)}
          {logoPaths.ink.map((d) => <path key={d} d={d} stroke="var(--color-fg)" vectorEffect="non-scaling-stroke" />)}
        </svg>
        <svg data-fill viewBox={LOGO_VIEWBOX} className="absolute inset-0 w-full" aria-hidden="true" style={{ clipPath: 'inset(100% 0 0 0)' }}>
          {logoPaths.brand.map((d) => <path key={d} d={d} fill="var(--color-brand)" />)}
          {logoPaths.ink.map((d) => <path key={d} d={d} fill="var(--color-fg)" />)}
        </svg>
      </div>

      <div data-loader-meta className="absolute inset-x-0 bottom-0 shell flex items-end justify-between pb-8 text-meta text-fg-muted">
        <span>Sebastián García</span>
        <span className="text-pixel text-2xl text-fg tabular-nums" aria-hidden="true">
          <span ref={counter}>000</span>
        </span>
      </div>
    </div>
  );
}
