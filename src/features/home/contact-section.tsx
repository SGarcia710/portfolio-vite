import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowUpRight, Check, Copy, EnvelopeSimple } from '@phosphor-icons/react';
import { site } from '../../content/site';
import { gsap, SplitText, useGSAP } from '../../lib/gsap';
import { REDUCED_MOTION } from '../../lib/media';
import { useTrackedSection } from '../../lib/section-tracker';

export function ContactSection() {
  const { t, i18n } = useTranslation('footer');
  const { t: tc } = useTranslation('common');
  const section = useTrackedSection<HTMLElement>('contact');
  const heading = useRef<HTMLHeadingElement>(null);
  const [copied, setCopied] = useState(false);

  useGSAP(() => {
    gsap.matchMedia().add(`not ${REDUCED_MOTION}`, () => {
      if (!heading.current) return;
      const split = SplitText.create(heading.current, { type: 'lines,words', mask: 'lines', linesClass: 'split-line' });
      gsap.from(split.words, {
        yPercent: 110,
        duration: 1.3,
        stagger: 0.06,
        scrollTrigger: { trigger: heading.current, start: 'top 80%', once: true },
      });
      gsap.from('[data-contact-fade]', {
        autoAlpha: 0,
        y: 30,
        duration: 1.2,
        stagger: 0.08,
        scrollTrigger: { trigger: heading.current, start: 'top 75%', once: true },
      });
      return () => split.revert();
    });
  }, { scope: section, dependencies: [i18n.resolvedLanguage], revertOnUpdate: true });

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(site.email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2200);
    } catch {
      window.location.href = `mailto:${site.email}`;
    }
  };

  return (
    <section
      ref={section}
      id="contact"
      aria-labelledby="contact-title"
      className="relative z-[var(--z-content)] flex items-start pt-[clamp(6rem,16vh,12rem)] pb-[clamp(5rem,12vh,8rem)] lg:min-h-[100svh] lg:items-center lg:py-32"
    >
      <div className="shell grid w-full lg:grid-cols-12">
        <div className="lg:col-span-7">
          {/* SplitText rewrites the heading's DOM, so remount it when the copy changes language. */}
          <h2 key={i18n.resolvedLanguage} id="contact-title" ref={heading} className="text-headline">{t('ctaTitle')}</h2>
          <p data-contact-fade className="mt-6 max-w-[44ch] text-lede text-fg-muted">{t('ctaDescription')}</p>

          <a
            data-contact-fade
            href={`mailto:${site.email}`}
            className="group mt-10 inline-flex max-w-full items-center gap-3 text-[clamp(1.125rem,0.8rem+1.4vw,1.875rem)] font-medium tracking-[-0.03em]"
          >
            <span className="link-draw truncate">{site.email}</span>
            <ArrowUpRight size={22} aria-hidden="true" className="shrink-0 text-accent transition-transform duration-500 group-hover:translate-x-1 group-hover:-translate-y-1" />
          </a>

          <div data-contact-fade className="mt-8 flex flex-wrap gap-3">
            <a href={`mailto:${site.email}`} className="btn btn-primary">
              <EnvelopeSimple size={18} aria-hidden="true" />
              <span>{tc('buttons.getInTouch')}</span>
            </a>
            <button type="button" onClick={copy} className="btn btn-ghost">
              {copied ? <Check size={16} aria-hidden="true" className="text-accent" /> : <Copy size={16} aria-hidden="true" />}
              <span>{copied ? tc('buttons.copied') : tc('buttons.copyEmail')}</span>
            </button>
            <span className="sr-only" role="status">{copied ? tc('buttons.copied') : ''}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
