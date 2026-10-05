import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import useEmblaCarousel from 'embla-carousel-react';
import { ArrowLeft, ArrowRight, ArrowUpRight } from '@phosphor-icons/react';
import { sideProjects } from '../../content/side-projects';
import { useTrackedSection } from '../../lib/section-tracker';
import { SideProjectCard, UpcomingProjectCard } from '../side-projects/side-project-card';
import { Reveal } from './reveal';

export function LabSection() {
  const { t } = useTranslation('lab');
  const section = useTrackedSection<HTMLElement>('lab');
  const [viewport, embla] = useEmblaCarousel({ align: 'start', containScroll: 'trimSnaps', dragFree: false });
  const [state, setState] = useState({ prev: false, next: false, progress: 0 });

  const sync = useCallback(() => {
    if (!embla) return;
    setState({ prev: embla.canScrollPrev(), next: embla.canScrollNext(), progress: Math.max(0, Math.min(1, embla.scrollProgress())) });
  }, [embla]);

  useEffect(() => {
    if (!embla) return undefined;
    sync();
    embla.on('select', sync).on('scroll', sync).on('reInit', sync);
    return () => { embla.off('select', sync).off('scroll', sync).off('reInit', sync); };
  }, [embla, sync]);

  const scrollable = state.prev || state.next;

  return (
    <section
      ref={section}
      id="lab"
      aria-labelledby="lab-title"
      aria-roledescription="carousel"
      className="relative z-[var(--z-content)] overflow-hidden py-[clamp(6rem,14vh,10rem)]"
    >
      <div className="shell grid lg:grid-cols-12">
        <div className="lg:col-span-7 lg:col-start-6">
          <Reveal>
            <h2 id="lab-title" className="text-headline">
              {t('sectionTitle')}
              <span className="ml-3 align-top text-meta tracking-normal text-fg-muted tabular-nums">({sideProjects.length})</span>
            </h2>
            <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <p className="max-w-[40ch] text-lede text-fg-muted">{t('sectionDescription')}</p>
              <Link to="/projects" className="inline-flex shrink-0 items-center gap-2 text-sm text-fg-soft hover:text-fg">
                <span className="link-draw">{t('viewAll')}</span>
                <ArrowUpRight size={14} aria-hidden="true" />
              </Link>
            </div>
          </Reveal>

          <Reveal className="mt-12">
            <div ref={viewport} className="-mr-[var(--gutter)] overflow-visible lg:-mr-[50vw]">
              <div className="flex touch-pan-y gap-4 md:gap-5">
                {sideProjects.map((project, index) => (
                  <div key={project.id} role="group" aria-roledescription="slide" aria-label={`${index + 1} / ${sideProjects.length + 1}`} className="min-w-0 shrink-0 basis-[86%] sm:basis-[70%] lg:basis-[min(46rem,52vw)]">
                    <SideProjectCard project={project} />
                  </div>
                ))}
                <div role="group" aria-roledescription="slide" className="min-w-0 shrink-0 basis-[70%] sm:basis-[45%] lg:basis-[min(24rem,26vw)]">
                  <UpcomingProjectCard />
                </div>
              </div>
            </div>
          </Reveal>

          {scrollable && (
            <div className="mt-8 flex items-center gap-4">
              <button type="button" className="icon-btn" disabled={!state.prev} onClick={() => embla?.scrollPrev()} aria-label={t('prev')}>
                <ArrowLeft size={16} />
              </button>
              <button type="button" className="icon-btn" disabled={!state.next} onClick={() => embla?.scrollNext()} aria-label={t('next')}>
                <ArrowRight size={16} />
              </button>
              <div aria-hidden="true" className="relative h-px flex-1 bg-line">
                <span className="absolute inset-y-0 left-0 w-full origin-left bg-fg" style={{ transform: `scaleX(${0.15 + state.progress * 0.85})` }} />
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
