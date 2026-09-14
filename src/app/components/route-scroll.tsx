import { useEffect } from 'react';
import { useLocation } from 'react-router';

export function RouteScroll() {
  const { pathname, hash, key } = useLocation();

  useEffect(() => {
    if (!hash) {
      window.scrollTo({ top: 0, behavior: 'instant' });
      return;
    }

    const scrollToSection = () => {
      // Wait for home content above the footer before calculating anchor positions.
      if (pathname === '/' && (!document.getElementById('experience') || !document.getElementById('projects'))) {
        return false;
      }
      const section = document.getElementById(hash.slice(1));
      if (!section) return false;
      const top = section.getBoundingClientRect().top + window.scrollY - 96;
      window.scrollTo({ top: Math.max(0, top) });
      return true;
    };

    if (scrollToSection()) return;

    // Home sections load lazily, so wait until the requested anchor is mounted.
    const observer = new MutationObserver(() => {
      if (scrollToSection()) observer.disconnect();
    });
    observer.observe(document.getElementById('root')!, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, [pathname, hash, key]);

  return null;
}
