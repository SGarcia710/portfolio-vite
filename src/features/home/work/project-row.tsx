import { useTranslation } from 'react-i18next';
import { ArrowRight, DeviceMobile, Desktop } from '@phosphor-icons/react';
import type { ClientProject } from '../../../content/projects';

interface ProjectRowProps {
  project: ClientProject;
  onOpen: () => void;
  onHover: (id: string | null) => void;
}

export function ProjectRow({ project, onOpen, onHover }: ProjectRowProps) {
  const { t } = useTranslation('projects');
  const Icon = project.platform === 'mobile' ? DeviceMobile : Desktop;

  return (
    <li className="group/row border-b border-line">
      <button
        type="button"
        onClick={onOpen}
        onPointerEnter={() => onHover(project.id)}
        onPointerLeave={() => onHover(null)}
        onFocus={() => onHover(project.id)}
        onBlur={() => onHover(null)}
        aria-haspopup="dialog"
        aria-label={`${t(`items.${project.id}.title`)}, ${project.client}. ${t('open')}`}
        className="grid w-full grid-cols-[3.5rem_1fr_auto] items-center gap-4 py-5 text-left transition-opacity duration-500 group-hover/list:opacity-35 hover:!opacity-100 focus-visible:!opacity-100 md:grid-cols-[4rem_1fr_10rem_auto] md:py-6"
      >
        <img
          src={project.image}
          alt=""
          loading="lazy"
          decoding="async"
          className="aspect-square w-14 rounded-[0.6rem] object-cover md:hidden"
        />
        <span className="hidden text-meta text-fg-muted md:block">{project.year}</span>
        <span className="min-w-0">
          <span className="block truncate text-[clamp(1.375rem,1rem+1.4vw,2.25rem)] leading-[1.05] font-semibold tracking-[-0.04em] transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover/row:translate-x-3">
            {t(`items.${project.id}.title`)}
          </span>
          <span className="mt-1.5 flex items-center gap-2 text-sm text-fg-muted">
            {project.client}
            <span className="text-fg-muted md:hidden">/ {project.year}</span>
          </span>
        </span>
        <span className="hidden items-center gap-2 text-sm text-fg-muted md:flex">
          <Icon size={16} aria-hidden="true" />
          {t(`items.${project.id}.category`)}
        </span>
        <span className="grid h-10 w-10 place-items-center rounded-full border border-line-strong transition-all duration-500 ease-[var(--ease-out-expo)] group-hover/row:border-fg group-hover/row:bg-fg group-hover/row:text-ink-950">
          <ArrowRight size={16} aria-hidden="true" className="transition-transform duration-500 group-hover/row:-rotate-45" />
        </span>
      </button>
    </li>
  );
}
