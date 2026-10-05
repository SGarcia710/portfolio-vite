import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { experiences } from '../../../content/experience';
import { useTrackedSection } from '../../../lib/section-tracker';
import { Reveal } from '../reveal';
import { CareerTimeline } from './career-timeline';
import { RoleDetails } from './role-details';

const PANEL_ID = 'role-details';

export function ExperienceSection() {
  const { t } = useTranslation('timeline');
  const section = useTrackedSection<HTMLElement>('experience');
  const [selectedId, setSelectedId] = useState(experiences[0].id);
  const selected = experiences.find((role) => role.id === selectedId) ?? experiences[0];

  return (
    <section
      ref={section}
      id="experience"
      aria-labelledby="experience-title"
      className="relative z-[var(--z-content)] py-[clamp(6rem,14vh,10rem)]"
    >
      <div className="shell">
        <Reveal className="lg:ml-[50%] lg:min-h-[44vh]">
          <h2 id="experience-title" className="text-headline">
            {t('sectionTitle')}
            <span className="ml-3 align-top text-meta tracking-normal text-fg-muted">{t('sectionSubtitle')}</span>
          </h2>
          <p className="mt-6 max-w-[48ch] text-lede text-fg-muted">{t('sectionDescription')}</p>
        </Reveal>

        <Reveal className="mt-14 lg:mt-6">
          <CareerTimeline selectedId={selected.id} onSelect={setSelectedId} panelId={PANEL_ID} />
        </Reveal>

        <RoleDetails role={selected} panelId={PANEL_ID} />
      </div>
    </section>
  );
}
