import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { gsap, SplitText, useGSAP } from '../../lib/gsap';
import { REDUCED_MOTION } from '../../lib/media';
import { useTrackedSection } from '../../lib/section-tracker';
import { cn } from '../../lib/cn';

const alignments = ['self-start', 'self-center lg:pl-[12vw]', 'self-end text-right'];

/**
 * Pinned statement. Each line is drawn as an outline first and fills in,
 * letter by letter, as the visitor scrolls, echoing the logo loader.
 */
export function ManifestoSection() {
  const { t, i18n } = useTranslation('textReveal');
  const lines = t('lines', { returnObjects: true }) as string[];
  const wrapper = useTrackedSection<HTMLDivElement>('manifesto');
  const pinned = useRef<HTMLElement>(null);

  useGSAP(() => {
    const media = gsap.matchMedia();
    media.add(`not ${REDUCED_MOTION}`, () => {
      const fills = gsap.utils.toArray<HTMLElement>('[data-fill-line]', pinned.current);
      const splits = fills.map((line) => SplitText.create(line, { type: 'chars' }));
      const chars = splits.flatMap((split) => split.chars);
      gsap.set(chars, { opacity: 0 });
      gsap.timeline({
        scrollTrigger: { trigger: pinned.current, start: 'top top', end: '+=160%', pin: true, scrub: 0.6, anticipatePin: 1 },
      })
        .to(chars, { opacity: 1, stagger: 0.04, ease: 'none', duration: 0.2 })
        .fromTo('[data-line]', { xPercent: (i) => (i === 1 ? -6 : 6) }, { xPercent: 0, ease: 'none', duration: chars.length * 0.04 }, 0);
      return () => splits.forEach((split) => split.revert());
    });
    return () => media.revert();
  }, { scope: wrapper, dependencies: [i18n.resolvedLanguage], revertOnUpdate: true });

  return (
    <div ref={wrapper} id="manifesto" className="relative z-[var(--z-content)]">
      <section ref={pinned} aria-label={lines.join(' ')} className="flex min-h-[100svh] items-center overflow-hidden">
        <div className="shell flex flex-col gap-[0.06em] text-[clamp(1.75rem,7.6vw,8rem)] leading-[0.95] font-semibold tracking-[-0.055em] [font-kerning:none] mix-blend-difference" aria-hidden="true">
          {lines.map((line, index) => (
            <div key={line} data-line className={cn('whitespace-nowrap', alignments[index % alignments.length])}>
              <span className="relative inline-block">
                <span className="text-transparent [-webkit-text-stroke:1px_rgb(248_249_250/0.28)]">{line}</span>
                <span data-fill-line className="absolute inset-0 text-fg">{line}</span>
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
