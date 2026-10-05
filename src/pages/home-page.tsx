import { lazy, Suspense, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { site } from '../content/site';
import { ContactSection } from '../features/home/contact-section';
import { ExperienceSection } from '../features/home/experience/experience-section';
import { HeroSection } from '../features/home/hero-section';
import { LabSection } from '../features/home/lab-section';
import { ManifestoSection } from '../features/home/manifesto-section';
import { WorkSection } from '../features/home/work/work-section';
import { registerBootTask } from '../lib/boot';
import { useDocumentMeta } from '../lib/use-document-meta';

const MacintoshScene = lazy(() => import('../features/macintosh/macintosh-scene'));

export function HomePage() {
  const { t } = useTranslation('hero');
  // Registered during render so the preloader waits for the scene only on this route.
  const [sceneTask] = useState(() => registerBootTask('scene'));

  useDocumentMeta({
    title: site.name,
    description: `${site.name}, ${t('title')}. ${t('description').replace(/<\/?\d>/g, '')}`,
  });

  return (
    <>
      <Suspense fallback={null}>
        <MacintoshScene onReady={sceneTask.done} />
      </Suspense>
      <HeroSection />
      <ManifestoSection />
      <ExperienceSection />
      <WorkSection />
      <LabSection />
      <ContactSection />
    </>
  );
}
