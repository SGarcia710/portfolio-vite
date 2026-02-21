import { useState, useEffect } from 'react';
import { Navigation } from './components/navigation';
import { HeroSection } from './components/hero-section';
import { TimelineSection } from './components/timeline-section';
import { ProjectsSection } from './components/projects-section';
import { Footer } from './components/footer';
import { ToastProvider } from './components/ui/toast';

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
          <TimelineSection />
          <ProjectsSection />
        </main>

        <Footer isDark={isDark} />
      </div>
    </ToastProvider>
  );
}
