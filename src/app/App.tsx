import { useState, useEffect, lazy, Suspense } from 'react';
import { AnimatePresence } from 'motion/react';
import { Navigation } from './components/navigation';
import { HeroSection } from './components/hero-section';
import { Preloader } from './components/preloader';
import { TextRevealSection } from './components/text-reveal-section';
import { ScrollToTop } from './components/ui/scroll-to-top';
import { ToastProvider } from './components/ui/toast';
import { CustomCursor } from './components/custom-cursor';

const TimelineSection = lazy(() => import('./components/timeline-section').then(m => ({ default: m.TimelineSection })));
const ProjectsSection = lazy(() => import('./components/projects-section').then(m => ({ default: m.ProjectsSection })));
const Footer = lazy(() => import('./components/footer').then(m => ({ default: m.Footer })));

export default function App() {
  const [isDark, setIsDark] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check system preference
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setIsDark(prefersDark);

    if (prefersDark) {
      document.documentElement.classList.add('dark');
    }
  }, []);

  useEffect(() => {
    if (isLoading) {
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
      document.body.style.height = '100%';
    } else {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.height = '';
    }
    return () => {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.height = '';
    };
  }, [isLoading]);

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <ToastProvider>
      <CustomCursor />
      <AnimatePresence>
        {isLoading && <Preloader isDark={isDark} onComplete={() => setIsLoading(false)} />}
      </AnimatePresence>
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
    </ToastProvider>
  );
}
