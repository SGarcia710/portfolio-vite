import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { gsap, ScrollTrigger, useGSAP } from '../../lib/gsap';
import teamDetail from './assets/team-detail.webp';


interface StoryChapter {
  title: string;
  body: string;
}

export function KTCodexScrollStory() {
  const root = useRef<HTMLElement>(null);
  const { t, i18n } = useTranslation('ktcodex');
  const chapters = t<'story.chapters', { returnObjects: true }, StoryChapter[]>('story.chapters', { returnObjects: true });

  useGSAP(() => {
    const matchMedia = gsap.matchMedia();

    matchMedia.add('(min-width: 1024px) and (min-height: 800px) and (prefers-reduced-motion: no-preference)', () => {
      const panels = gsap.utils.toArray<HTMLElement>('[data-story-panel]');
      const screenshot = root.current?.querySelector<HTMLElement>('[data-story-image]');
      const scan = root.current?.querySelector<HTMLElement>('[data-story-scan]');
      if (!root.current || panels.length < 2 || !screenshot || !scan) return;

      gsap.set(panels.slice(1), { autoAlpha: 0, yPercent: 16 });
      const timeline = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: root.current,
          start: 'top top',
          end: '+=240%',
          pin: true,
          scrub: 1,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      chapters.slice(1).forEach((_, index) => {
        timeline
          .to(panels[index], { autoAlpha: 0, yPercent: -12, duration: 0.35 })
          .to(panels[index + 1], { autoAlpha: 1, yPercent: 0, duration: 0.35 }, '<')
          .to(screenshot, { yPercent: -20 * (index + 1), scale: 1 + 0.035 * (index + 1), duration: 0.7 }, '<')
          .fromTo(scan, { yPercent: -120 }, { yPercent: 620, duration: 0.7 }, '<');
      });
      ScrollTrigger.sort();
      ScrollTrigger.refresh();
    });

    matchMedia.add({
      compact: '(max-width: 1023px), (max-height: 799px)',
      motion: '(prefers-reduced-motion: no-preference)',
    }, context => {
      if (!context.conditions?.compact || !context.conditions?.motion) return;
      const viewport = root.current?.querySelector<HTMLElement>('.ktc-scanner-window');
      const screenshot = root.current?.querySelector<HTMLImageElement>('[data-story-image]');
      const scan = root.current?.querySelector<HTMLElement>('[data-story-scan]');
      if (!viewport || !screenshot || !scan) return;

      // Scrub the preview as it crosses the viewport. The copy stays in normal
      // flow, so smaller screens keep the effect without a full-section pin.
      gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: viewport,
          start: 'top 85%',
          end: 'bottom 20%',
          scrub: 0.5,
          invalidateOnRefresh: true,
        },
      })
        .fromTo(screenshot, { y: 0 }, {
          y: () => -Math.max(0, screenshot.offsetHeight - viewport.clientHeight),
          duration: 1,
        }, 0)
        .fromTo(scan, { yPercent: -100 }, { yPercent: 560, duration: 1 }, 0);

      const refresh = () => ScrollTrigger.refresh();
      screenshot.addEventListener('load', refresh);
      ScrollTrigger.sort();
      ScrollTrigger.refresh();
      return () => screenshot.removeEventListener('load', refresh);
    });

    return () => matchMedia.revert();
  }, { scope: root, dependencies: [chapters.length, i18n.resolvedLanguage], revertOnUpdate: true });

  return (
    <section ref={root} className="ktc-story" aria-labelledby="ktc-story-title">
      <div className="container-premium ktc-story-grid">
        <div className="ktc-story-visual">
          <div className="ktc-scanner-frame">
            <div className="ktc-scanner-header">
              <span>{t('story.scannerLabel')}</span>
              <span aria-hidden="true">6 / 6</span>
            </div>
            <div className="ktc-scanner-window">
              <img data-story-image src={teamDetail} alt="" />
              <div data-story-scan className="ktc-scan-line" />
            </div>
          </div>
        </div>

        <div className="ktc-story-copy">
          <div className="ktc-story-heading">
            <h2 id="ktc-story-title">{t('story.title')}</h2>
            <p>{t('story.description')}</p>
          </div>
          <div className="ktc-story-panels">
            {chapters.map((chapter) => (
              <article data-story-panel className="ktc-story-panel" key={chapter.title}>
                <h3>{chapter.title}</h3>
                <p>{chapter.body}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
