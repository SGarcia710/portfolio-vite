import { useState, useEffect, lazy, Suspense } from 'react';
import { Navigation } from './components/navigation';
import { HeroSection } from './components/hero-section';
import { ToastProvider } from './components/ui/toast';

const TimelineSection = lazy(() => import('./components/timeline-section').then(m => ({ default: m.TimelineSection })));
const ProjectsSection = lazy(() => import('./components/projects-section').then(m => ({ default: m.ProjectsSection })));
const Footer = lazy(() => import('./components/footer').then(m => ({ default: m.Footer })));

export default function App() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Check system preference
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setIsDark(prefersDark);

    if (prefersDark) {
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <ToastProvider>
      <div className="min-h-screen bg-background text-foreground antialiased overflow-x-hidden">
        <Navigation isDark={isDark} onThemeToggle={toggleTheme} />
        
        <main>
          <HeroSection />
          <Suspense>
            <TimelineSection />
            <ProjectsSection />
          </Suspense>
        </main>

        <Suspense>
          <Footer isDark={isDark} />
        </Suspense>
      </div>
    </ToastProvider>
  );
}
