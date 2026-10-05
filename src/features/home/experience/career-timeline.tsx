import { useEffect, useRef, type CSSProperties, type KeyboardEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { experiences, toYearFraction, type Experience } from '../../../content/experience';
import { cn } from '../../../lib/cn';
import { AXIS_HEIGHT, ROW_GAP, ROW_HEIGHT, TRACK_PADDING, useTimelineScale } from './timeline-scale';

interface CareerTimelineProps {
  selectedId: string;
  onSelect: (id: string) => void;
  panelId: string;
}

function initials(company: string) {
  return company.split(/\s+/).filter((word) => /^[A-Z0-9]/i.test(word)).slice(0, 2).map((word) => word[0]).join('').toUpperCase();
}

const shortYear = (year: number) => `'${String(year).slice(-2)}`;

/**
 * Gantt-style career timeline: one row per role, newest on top, with a live
 * "now" marker. Rows act as tabs that drive the details panel.
 */
export function CareerTimeline({ selectedId, onSelect, panelId }: CareerTimelineProps) {
  const { t } = useTranslation('timeline');
  const scroller = useRef<HTMLDivElement>(null);
  const scale = useTimelineScale(scroller);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const years = Array.from({ length: scale.endYear - scale.startYear + 1 }, (_, i) => scale.startYear + i);

  // Start scrolled to the present on narrow screens.
  useEffect(() => {
    const element = scroller.current;
    if (!element || element.scrollWidth <= element.clientWidth) return;
    element.scrollLeft = scale.x(toYearFraction(experiences[1].start)) - element.clientWidth * 0.08;
  }, [scale.yearWidth]); // eslint-disable-line react-hooks/exhaustive-deps

  const select = (index: number) => {
    const role = experiences[(index + experiences.length) % experiences.length];
    onSelect(role.id);
    const tab = tabs.current[experiences.indexOf(role)];
    tab?.focus({ preventScroll: true });
    tab?.scrollIntoView({ block: 'nearest', inline: 'nearest', behavior: 'smooth' });
  };

  const handleKey = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const moves: Record<string, number> = { ArrowDown: 1, ArrowRight: -1, ArrowUp: -1, ArrowLeft: 1 };
    if (event.key in moves) {
      event.preventDefault();
      select(index + moves[event.key]);
    } else if (event.key === 'Home' || event.key === 'End') {
      event.preventDefault();
      select(event.key === 'Home' ? 0 : experiences.length - 1);
    }
  };

  return (
    <div className="panel relative overflow-hidden">
      <div
        ref={scroller}
        className="overflow-x-auto overscroll-x-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden [mask-image:linear-gradient(90deg,transparent,black_2.5rem,black_calc(100%-2.5rem),transparent)]"
      >
        <div className="relative" style={{ width: scale.width, height: scale.height }}>
          <div aria-hidden="true">
            {years.map((year) => (
              <span key={year}>
                <span className="absolute top-0 bottom-0 w-px bg-line" style={{ left: scale.x(year) }} />
                <span className="absolute top-3 -translate-x-1/2 text-meta text-fg-muted" style={{ left: scale.x(year) }}>
                  {year}
                </span>
                {year < scale.endYear && [0.25, 0.5, 0.75].map((quarter) => (
                  <span
                    key={quarter}
                    className="absolute bottom-0 w-px bg-line opacity-40"
                    style={{ left: scale.x(year + quarter), top: AXIS_HEIGHT }}
                  />
                ))}
              </span>
            ))}
            <span className="absolute inset-x-0 h-px bg-line" style={{ top: AXIS_HEIGHT }} />

            <span className="absolute top-0 bottom-0 w-px bg-brand shadow-[0_0_14px_var(--color-brand)]" style={{ left: scale.x(scale.now) }}>
              <span className="absolute top-[30px] left-1/2 h-2.5 w-2.5 -translate-x-1/2 bg-brand" />
              <span className="absolute bottom-3 left-2.5 text-meta whitespace-nowrap text-brand">{t('now')}</span>
            </span>
          </div>

          <div role="tablist" aria-label={t('yearsAxis')} aria-orientation="vertical">
            {experiences.map((role, index) => (
              <TimelineBar
                key={role.id}
                buttonRef={(element) => { tabs.current[index] = element; }}
                role={role}
                label={t(`experiences.${role.id}.role`)}
                selected={role.id === selectedId}
                panelId={panelId}
                style={{
                  left: scale.x(toYearFraction(role.start)),
                  top: AXIS_HEIGHT + TRACK_PADDING / 2 + index * (ROW_HEIGHT + ROW_GAP),
                  height: ROW_HEIGHT,
                  '--duration': `${(toYearFraction(role.end ?? new Date()) - toYearFraction(role.start)) * scale.yearWidth}px`,
                } as CSSProperties}
                onClick={() => onSelect(role.id)}
                onKeyDown={(event) => handleKey(event, index)}
              />
            ))}
          </div>
        </div>
      </div>
      <p className="px-6 pb-4 text-meta text-fg-muted lg:hidden">{t('dragHint')}</p>
    </div>
  );
}

interface TimelineBarProps {
  buttonRef: (element: HTMLButtonElement | null) => void;
  role: Experience;
  label: string;
  selected: boolean;
  panelId: string;
  style: CSSProperties;
  onClick: () => void;
  onKeyDown: (event: KeyboardEvent<HTMLButtonElement>) => void;
}

function TimelineBar({ buttonRef, role, label, selected, panelId, style, onClick, onKeyDown }: TimelineBarProps) {
  const { t } = useTranslation('timeline');
  const current = role.end === null;
  const start = Number(role.start.slice(0, 4));
  const end = role.end ? Number(role.end.slice(0, 4)) : null;

  return (
    <button
      ref={buttonRef}
      type="button"
      role="tab"
      id={`role-tab-${role.id}`}
      aria-selected={selected}
      aria-controls={panelId}
      tabIndex={selected ? 0 : -1}
      onClick={onClick}
      onKeyDown={onKeyDown}
      style={style}
      className={cn(
        'group absolute flex min-w-[var(--duration)] items-center gap-2.5 rounded-[0.5rem] border pr-3 pl-1.5 text-left whitespace-nowrap',
        'transition-[border-color,background-color,box-shadow] duration-500 ease-[var(--ease-out-expo)]',
        current
          ? 'border-brand/60 bg-[linear-gradient(90deg,rgb(255_91_43/0.32),rgb(255_91_43/0.08)_var(--duration),transparent_var(--duration))] shadow-[0_0_32px_-8px_rgb(255_91_43/0.6)]'
          : 'border-line-strong bg-[linear-gradient(90deg,var(--color-ink-800)_var(--duration),transparent_var(--duration))]',
        selected ? 'border-fg ring-1 ring-fg/60' : 'hover:border-fg/50',
      )}
    >
      <span className="sticky left-10 flex items-center gap-2.5">
      <span
        aria-hidden="true"
        className={cn(
          'grid h-6 w-6 shrink-0 place-items-center rounded-[0.3rem] text-pixel text-[0.625rem] transition-colors duration-500',
          selected ? 'bg-fg text-ink-950' : current ? 'bg-brand text-ink-950' : 'bg-ink-700 text-fg-soft',
        )}
      >
        {initials(role.company)}
      </span>
      <span className="text-[0.8125rem] font-medium text-fg">{label}</span>
      <span className="text-[0.8125rem] text-fg-muted">{role.company}</span>
      <span className={cn('text-meta', current ? 'text-brand' : 'text-fg-muted')}>
        ({shortYear(start)}-{end ? shortYear(end) : t('now').toLowerCase()})
      </span>
      </span>
    </button>
  );
}
