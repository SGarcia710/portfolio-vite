import { lazy, Suspense } from 'react';
import { HeroSection } from '../components/hero-section';
import { TextRevealSection } from '../components/text-reveal-section';

const TimelineSection = lazy(() => import('../components/timeline-section').then(m => ({ default: m.TimelineSection })));
const ProjectsSection = lazy(() => import('../components/projects-section').then(m => ({ default: m.ProjectsSection })));

export function HomePage() {
  return (
    <>
      <HeroSection />
      <TextRevealSection />
      <Suspense>
        <TimelineSection />
        <ProjectsSection />
      </Suspense>
    </>
  );
}
