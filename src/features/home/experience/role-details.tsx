import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { formatYearMonth, type Experience } from '../../../content/experience';
import { gsap, useGSAP } from '../../../lib/gsap';
import { prefersReducedMotion } from '../../../lib/media';

interface RoleDetailsProps {
  role: Experience;
  panelId: string;
}

export function RoleDetails({ role, panelId }: RoleDetailsProps) {
  const { t, i18n } = useTranslation('timeline');
  const root = useRef<HTMLDivElement>(null);
  const locale = i18n.resolvedLanguage ?? 'en';
  const period = `${formatYearMonth(role.start, locale)} - ${role.end ? formatYearMonth(role.end, locale) : t('present')}`;

  useGSAP(() => {
    if (prefersReducedMotion()) return;
    gsap.from('[data-detail]', { autoAlpha: 0, y: 18, duration: 0.9, stagger: 0.05 });
    gsap.from('[data-skill]', { autoAlpha: 0, y: 8, duration: 0.6, stagger: 0.015, delay: 0.15 });
  }, { scope: root, dependencies: [role.id], revertOnUpdate: true });

  return (
    <div
      ref={root}
      id={panelId}
      role="tabpanel"
      aria-labelledby={`role-tab-${role.id}`}
      aria-live="polite"
      className="grid gap-8 pt-10 md:grid-cols-12 md:gap-6 md:pt-14"
    >
      <div className="md:col-span-5">
        <p data-detail className="text-meta text-fg-muted">
          {period} / {t('typeFullTime')}
        </p>
        <h3 data-detail className="mt-3 text-title">{t(`experiences.${role.id}.role`)}</h3>
        <p data-detail className="mt-2 text-lede text-fg-soft">
          {t('at')} <span className="text-fg">{role.company}</span>
        </p>
      </div>
      <div className="md:col-span-7">
        <p data-detail className="max-w-[62ch] text-fg-soft leading-relaxed">{t(`experiences.${role.id}.description`)}</p>
        <p data-detail className="mt-6 mb-3 text-meta text-fg-muted">{t('stack')}</p>
        <ul className="flex flex-wrap gap-1.5">
          {role.skills.map((skill) => (
            <li key={skill} data-skill className="tag">{skill}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
