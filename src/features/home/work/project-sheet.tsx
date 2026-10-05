import * as Dialog from '@radix-ui/react-dialog';
import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { AppStoreLogo, ArrowLeft, ArrowRight, ArrowUpRight, GlobeSimple, GooglePlayLogo, X } from '@phosphor-icons/react';
import type { ClientProject, ProjectLinks } from '../../../content/projects';
import { gsap, useGSAP } from '../../../lib/gsap';
import { prefersReducedMotion } from '../../../lib/media';

interface ProjectSheetProps {
  project: ClientProject | null;
  onClose: () => void;
  onStep: (direction: 1 | -1) => void;
  position: { index: number; total: number };
}

const linkMeta: Record<keyof ProjectLinks, { icon: typeof GlobeSimple; label: string }> = {
  website: { icon: GlobeSimple, label: 'buttons.website' },
  appStore: { icon: AppStoreLogo, label: 'buttons.appStore' },
  playStore: { icon: GooglePlayLogo, label: 'buttons.playStore' },
};

export function ProjectSheet({ project, onClose, onStep, position }: ProjectSheetProps) {
  const { t } = useTranslation('projects');
  const { t: tc } = useTranslation('common');
  const body = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!project || prefersReducedMotion()) return;
    gsap.from('[data-sheet-item]', { autoAlpha: 0, y: 24, duration: 0.9, stagger: 0.05, delay: 0.1 });
    gsap.from('[data-sheet-image]', { clipPath: 'inset(0 0 100% 0)', duration: 1.1, ease: 'expo.inOut' });
  }, { scope: body, dependencies: [project?.id], revertOnUpdate: true });

  return (
    <Dialog.Root open={project !== null} onOpenChange={(open) => !open && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="sheet-overlay fixed inset-0 z-[var(--z-overlay)] bg-ink-950/70 backdrop-blur-sm" />
        <Dialog.Content
          className="sheet-content fixed inset-y-0 right-0 z-[var(--z-overlay)] flex w-full max-w-[44rem] flex-col border-l border-line bg-ink-925 outline-none"
          aria-describedby={undefined}
          data-lenis-prevent
        >
          {project && (
            <>
              <div className="flex items-center justify-between gap-4 border-b border-line px-6 py-4 md:px-10">
                <span className="text-meta text-fg-muted tabular-nums">
                  {String(position.index + 1).padStart(2, '0')} / {String(position.total).padStart(2, '0')}
                </span>
                <div className="flex items-center gap-2">
                  <button type="button" className="icon-btn" onClick={() => onStep(-1)} aria-label={t('prev')}>
                    <ArrowLeft size={16} />
                  </button>
                  <button type="button" className="icon-btn" onClick={() => onStep(1)} aria-label={t('next')}>
                    <ArrowRight size={16} />
                  </button>
                  <Dialog.Close className="icon-btn ml-2" aria-label={t('close')}>
                    <X size={16} />
                  </Dialog.Close>
                </div>
              </div>

              <div ref={body} className="flex-1 overflow-y-auto overscroll-contain px-6 pt-6 pb-12 md:px-10 md:pt-8">
                <div data-sheet-image className="overflow-hidden rounded-[1.25rem] bg-surface-raised">
                  <img src={project.image} alt="" className="aspect-[16/10] w-full object-cover" />
                </div>

                <Dialog.Title data-sheet-item className="mt-8 text-title">{t(`items.${project.id}.title`)}</Dialog.Title>

                <dl data-sheet-item className="mt-6 grid grid-cols-2 gap-4 border-y border-line py-5 sm:grid-cols-3">
                  <div>
                    <dt className="text-meta text-fg-muted">{t('client')}</dt>
                    <dd className="mt-1 text-sm">{project.client}</dd>
                  </div>
                  <div>
                    <dt className="text-meta text-fg-muted">{t('year')}</dt>
                    <dd className="mt-1 text-sm tabular-nums">{project.year}</dd>
                  </div>
                  <div>
                    <dt className="text-meta text-fg-muted">{t(`platform.${project.platform}`)}</dt>
                    <dd className="mt-1 text-sm">{t(`items.${project.id}.category`)}</dd>
                  </div>
                </dl>

                <p data-sheet-item className="mt-6 text-fg-soft leading-relaxed">{t(`items.${project.id}.description`)}</p>

                <p data-sheet-item className="mt-8 mb-3 text-meta text-fg-muted">{t('stack')}</p>
                <ul data-sheet-item className="flex flex-wrap gap-1.5">
                  {project.tags.map((tag) => <li key={tag} className="tag">{tag}</li>)}
                </ul>

                <div data-sheet-item className="mt-10 flex flex-wrap gap-3">
                  {(Object.keys(linkMeta) as (keyof ProjectLinks)[]).map((key, index) => {
                    const href = project.links[key];
                    if (!href) return null;
                    const { icon: Icon, label } = linkMeta[key];
                    return (
                      <a key={key} href={href} target="_blank" rel="noopener noreferrer" className={index === 0 ? 'btn btn-primary' : 'btn btn-ghost'}>
                        <Icon size={18} aria-hidden="true" />
                        <span>{tc(label)}</span>
                        <ArrowUpRight size={14} aria-hidden="true" />
                        <span className="sr-only">({tc('a11y.external')})</span>
                      </a>
                    );
                  })}
                </div>
              </div>
            </>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
