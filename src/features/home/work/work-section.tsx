import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { clientProjects, type ProjectPlatform } from '../../../content/projects';
import { setScrollLocked } from '../../../lib/smooth-scroll';
import { useTrackedSection } from '../../../lib/section-tracker';
import { cn } from '../../../lib/cn';
import { Reveal } from '../reveal';
import { CursorPreview } from './cursor-preview';
import { ProjectRow } from './project-row';
import { ProjectSheet } from './project-sheet';

type Filter = 'all' | ProjectPlatform;
const filters: Filter[] = ['all', 'mobile', 'web'];

export function WorkSection() {
  const { t } = useTranslation('projects');
  const section = useTrackedSection<HTMLElement>('projects');
  const [filter, setFilter] = useState<Filter>('all');
  const [hovered, setHovered] = useState<string | null>(null);
  const [openId, setOpenId] = useState<string | null>(null);

  const visible = useMemo(
    () => clientProjects.filter((project) => filter === 'all' || project.platform === filter),
    [filter],
  );
  const openIndex = visible.findIndex((project) => project.id === openId);

  const open = (id: string | null) => {
    setOpenId(id);
    setHovered(null);
    setScrollLocked(id !== null);
  };

  return (
    <section
      ref={section}
      id="projects"
      aria-labelledby="projects-title"
      className="relative z-[var(--z-content)] py-[clamp(6rem,14vh,10rem)]"
    >
      <div className="shell grid lg:grid-cols-12">
        <div className="lg:col-span-7">
          <Reveal>
            <h2 id="projects-title" className="text-headline">
              {t('sectionTitle')}
              <span className="ml-3 align-top text-meta tracking-normal text-fg-muted tabular-nums">({clientProjects.length})</span>
            </h2>
            <p className="mt-6 max-w-[46ch] text-lede text-fg-muted">{t('sectionDescription')}</p>
          </Reveal>

          <div role="group" aria-label={t('filters.label')} className="mt-10 flex flex-wrap gap-2">
            {filters.map((value) => {
              const count = value === 'all' ? clientProjects.length : clientProjects.filter((project) => project.platform === value).length;
              return (
                <button
                  key={value}
                  type="button"
                  aria-pressed={filter === value}
                  onClick={() => setFilter(value)}
                  className={cn(
                    'inline-flex h-9 items-center gap-2 rounded-full border px-4 text-sm transition-colors duration-300',
                    filter === value ? 'border-fg bg-fg text-ink-950' : 'border-line-strong text-fg-soft hover:border-fg/60 hover:text-fg',
                  )}
                >
                  {t(`filters.${value}`)}
                  <span className="text-meta opacity-60 tabular-nums">{count}</span>
                </button>
              );
            })}
          </div>

          <ul className="group/list mt-8 border-t border-line" aria-live="polite">
            {visible.map((project) => (
              <ProjectRow key={project.id} project={project} onOpen={() => open(project.id)} onHover={setHovered} />
            ))}
          </ul>
        </div>
      </div>

      <CursorPreview projects={clientProjects} activeId={openId ? null : hovered} />
      <ProjectSheet
        project={openIndex >= 0 ? visible[openIndex] : null}
        position={{ index: openIndex, total: visible.length }}
        onClose={() => open(null)}
        onStep={(direction) => setOpenId(visible[(openIndex + direction + visible.length) % visible.length].id)}
      />
    </section>
  );
}
