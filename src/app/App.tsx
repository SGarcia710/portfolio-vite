import { useState, useEffect, lazy, Suspense } from 'react';
import { Navigation } from './components/navigation';
import { HeroSection } from './components/hero-section';
import { TextRevealSection } from './components/text-reveal-section';
import { ScrollToTop } from './components/ui/scroll-to-top';

const CustomCursor = lazy(() => import('./components/custom-cursor').then(m => ({ default: m.CustomCursor })));
const TimelineSection = lazy(() => import('./components/timeline-section').then(m => ({ default: m.TimelineSection })));
const ProjectsSection = lazy(() => import('./components/projects-section').then(m => ({ default: m.ProjectsSection })));
const Footer = lazy(() => import('./components/footer').then(m => ({ default: m.Footer })));
const LIGHT_FAVICON = '/assets/favicon-black.ico';
const DARK_FAVICON = '/assets/favicon-white.ico';

export default function App() {
  const [isDark, setIsDark] = useState(false);
  const [shouldLoadCursor, setShouldLoadCursor] = useState(false);

  useEffect(() => {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setIsDark(prefersDark);
  }, []);

  useEffect(() => {
    const canUseCursor = window.matchMedia('(pointer: fine)').matches
      && window.matchMedia('(hover: hover)').matches;

    if (!canUseCursor) {
      return undefined;
    }

    const timeoutId = window.setTimeout(() => {
      setShouldLoadCursor(true);
    }, 1200);

    return () => window.clearTimeout(timeoutId);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);

    const favicon = document.getElementById('app-favicon') as HTMLLinkElement | null;
    if (favicon) {
      favicon.href = isDark ? DARK_FAVICON : LIGHT_FAVICON;
    }
  }, [isDark]);

  const toggleTheme = () => {
    setIsDark(current => !current);
  };

  return (
    <>
      {shouldLoadCursor && (
        <Suspense fallback={null}>
          <CustomCursor />
        </Suspense>
      )}
      <div className="min-h-screen bg-background text-foreground antialiased overflow-x-hidden">
        <Navigation isDark={isDark} onThemeToggle={toggleTheme} />
        
        <main>
          <HeroSection />
          <TextRevealSection />
          <Suspense>
            <TimelineSection />
            <ProjectsSection />
          </Suspense>
        </main>

        <Suspense>
          <Footer isDark={isDark} />
        </Suspense>

        <ScrollToTop />
      </div>
    </>
  );
}
