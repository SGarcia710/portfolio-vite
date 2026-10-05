import { useEffect } from 'react';
import { useLocation } from 'react-router';
import { ScrollTrigger } from '../lib/gsap';
import { scrollToTarget } from '../lib/smooth-scroll';

/** Resets scroll on navigation and resolves `/#section` once that section has mounted. */
export function RouteScroll() {
  const { pathname, hash, key } = useLocation();

  useEffect(() => {
    if (!hash) {
      scrollToTarget(0, { immediate: true });
      ScrollTrigger.refresh();
      return undefined;
    }

    const go = () => {
      const target = document.getElementById(decodeURIComponent(hash.slice(1)));
      if (!target) return false;
      ScrollTrigger.refresh();
      scrollToTarget(target, { immediate: true });
      return true;
    };

    const observer = new MutationObserver(() => go() && observer.disconnect());
    const timeout = window.setTimeout(() => observer.disconnect(), 4000);
    // Wait a frame so pinned sections have their spacers before measuring.
    const frame = requestAnimationFrame(() => {
      if (!go()) observer.observe(document.body, { childList: true, subtree: true });
    });
    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(timeout);
      observer.disconnect();
    };
  }, [pathname, hash, key]);

  return null;
}
