import type { CSSProperties } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import { ArrowUpRight } from '@phosphor-icons/react';
import type { SideProject } from '../../content/side-projects';
import { cn } from '../../lib/cn';

interface SideProjectCardProps {
  project: SideProject;
  className?: string;
}

/** Tinted poster card: app icon, live screenshot and the essentials. The whole card links to the project page. */
export function SideProjectCard({ project, className }: SideProjectCardProps) {
  const { t } = useTranslation('lab');

  return (
    <Link
      to={project.href}
      className={cn(
        'group/card relative isolate flex min-h-[34rem] flex-col overflow-hidden rounded-[var(--radius-panel)] border border-line p-6 md:min-h-[38rem] md:p-8',
        className,
      )}
      style={{ '--tint': project.tint } as CSSProperties}
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[radial-gradient(120%_80%_at_80%_100%,color-mix(in_srgb,var(--tint)_55%,transparent),transparent_60%),linear-gradient(180deg,var(--color-ink-850),var(--color-ink-925))] transition-transform duration-1000 ease-[var(--ease-out-expo)] group-hover/card:scale-[1.04]"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 opacity-[0.15] [background-image:linear-gradient(var(--color-line-strong)_1px,transparent_1px),linear-gradient(90deg,var(--color-line-strong)_1px,transparent_1px)] [background-size:2.5rem_2.5rem] [mask-image:linear-gradient(180deg,black,transparent_70%)]"
      />

      <div className="flex items-start justify-between gap-4">
        <img src={project.icon} alt="" width={64} height={64} loading="lazy" className="h-14 w-14 rounded-[0.95rem] shadow-[0_12px_30px_-10px_var(--tint)] md:h-16 md:w-16" />
        <span className="inline-flex h-7 items-center gap-2 rounded-full border border-line-strong bg-ink-950/50 px-3 text-meta text-fg-soft">
          <span aria-hidden="true" className="h-1.5 w-1.5 animate-pulse rounded-full bg-[var(--tint)]" />
          {t(`status.${project.status}`)}
        </span>
      </div>

      <div className="pointer-events-none absolute right-[-6%] bottom-[-18%] w-[46%] max-w-[15rem] rotate-[8deg] transition-transform duration-1000 ease-[var(--ease-out-expo)] group-hover/card:-translate-y-6 group-hover/card:rotate-[4deg]">
        <div className="overflow-hidden rounded-[1.6rem] border-[6px] border-ink-950 shadow-[0_40px_80px_-20px_rgb(0_0_0/0.8)]">
          <img src={project.screen} alt="" loading="lazy" className="w-full" />
        </div>
      </div>

      <div className="relative mt-auto max-w-[58%] md:max-w-[52%]">
        <p className="text-meta text-fg-muted">{project.platforms.join(' + ')} / {project.year}</p>
        <h3 className="mt-3 text-title">{project.name}</h3>
        <p className="mt-2 text-lede text-fg">{t(`items.${project.id}.tagline`)}</p>
        <p className="mt-3 text-sm leading-relaxed text-fg-muted">{t(`items.${project.id}.description`)}</p>
        <span className="mt-6 inline-flex items-center gap-2 text-sm font-medium">
          <span className="link-draw group-hover/card:bg-[length:100%_1px]">{t('view')}</span>
          <ArrowUpRight size={16} aria-hidden="true" className="transition-transform duration-500 group-hover/card:translate-x-0.5 group-hover/card:-translate-y-0.5" />
        </span>
      </div>
    </Link>
  );
}

export function UpcomingProjectCard({ className }: { className?: string }) {
  const { t } = useTranslation('lab');
  return (
    <div className={cn('flex min-h-[34rem] flex-col justify-end rounded-[var(--radius-panel)] border border-dashed border-line-strong p-6 md:min-h-[38rem] md:p-8', className)}>
      <span aria-hidden="true" className="text-pixel text-[5rem] leading-none text-ink-700">+</span>
      <h3 className="mt-6 text-title text-fg-soft">{t('upcoming.title')}</h3>
      <p className="mt-3 max-w-[30ch] text-sm leading-relaxed text-fg-muted">{t('upcoming.body')}</p>
    </div>
  );
}
