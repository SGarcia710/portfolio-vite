import { useRef } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { ArrowUpRight, EnvelopeSimple } from '@phosphor-icons/react';
import { site } from '../../content/site';
import { useIntroStarted } from '../../lib/boot';
import { gsap, SplitText, useGSAP } from '../../lib/gsap';
import { prefersReducedMotion } from '../../lib/media';
import { useTrackedSection } from '../../lib/section-tracker';

export function HeroSection() {
  const { t } = useTranslation('hero');
  const { t: tc } = useTranslation('common');
  const section = useTrackedSection<HTMLElement>('top');
  const title = useRef<HTMLHeadingElement>(null);
  const started = useIntroStarted();

  useGSAP(() => {
    if (!started || !title.current) return;
    if (prefersReducedMotion()) {
      gsap.set('[data-hero-intro]', { autoAlpha: 1 });
      return;
    }
    const split = SplitText.create(title.current, { type: 'lines,chars', mask: 'lines', linesClass: 'split-line' });
    gsap.timeline({ delay: 0.15 })
      .set('[data-hero-intro]', { autoAlpha: 1 })
      .from(split.chars, { yPercent: 110, duration: 1.4, stagger: 0.028, ease: 'expo.out' })
      .from('[data-hero-fade]', { autoAlpha: 0, y: 24, duration: 1.2, stagger: 0.09 }, 0.45);
    return () => split.revert();
  }, { scope: section, dependencies: [started] });

  return (
    <section
      ref={section}
      id="top"
      aria-labelledby="hero-title"
      className="relative z-[var(--z-content)] flex min-h-[100svh] flex-col pt-[var(--header-height)] pb-[max(3rem,9vh)] lg:flex-row lg:items-center lg:pt-0 lg:pb-0"
    >
      {/* Small screens: the Macintosh scene fits itself inside this box, so it never covers the copy. */}
      <div data-mac-anchor aria-hidden="true" className="min-h-[clamp(12rem,36svh,21rem)] w-full flex-1 lg:hidden" />
      <div className="shell grid w-full lg:grid-cols-12">
        <div data-hero-intro className="lg:col-span-7 lg:pt-[var(--header-height)]">
          <h1 id="hero-title" ref={title} className="text-display">
            Sebastián<br />García
          </h1>

          <p data-hero-fade className="mt-6 flex items-center gap-3 text-title text-fg-soft lg:mt-8">
            <span aria-hidden="true" className="inline-block h-[0.55em] w-[0.55em] bg-brand" />
            {t('title')}
          </p>

          <p data-hero-fade className="mt-5 max-w-[44ch] text-lede text-fg-muted">
            <Trans
              i18nKey="description"
              ns="hero"
              components={[<span className="text-fg" />, <span className="text-fg" />]}
            />
          </p>

          <div data-hero-fade className="mt-9 flex flex-wrap gap-3">
            <a href={`mailto:${site.email}`} className="btn btn-primary">
              <EnvelopeSimple size={18} aria-hidden="true" />
              <span>{tc('buttons.getInTouch')}</span>
            </a>
            <a href={site.github} target="_blank" rel="noopener noreferrer" className="btn btn-ghost">
              <span>{tc('buttons.viewGithub')}</span>
              <ArrowUpRight size={16} aria-hidden="true" />
              <span className="sr-only">({tc('a11y.external')})</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
