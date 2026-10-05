import { useSyncExternalStore } from 'react';

const subscribers = new Map<string, (onChange: () => void) => () => void>();

function subscribe(query: string) {
  let subscriber = subscribers.get(query);
  if (!subscriber) {
    subscriber = (onChange: () => void) => {
      const media = window.matchMedia(query);
      media.addEventListener('change', onChange);
      return () => media.removeEventListener('change', onChange);
    };
    subscribers.set(query, subscriber);
  }
  return subscriber;
}

export function useMediaQuery(query: string): boolean {
  return useSyncExternalStore(subscribe(query), () => window.matchMedia(query).matches, () => false);
}

export const REDUCED_MOTION = '(prefers-reduced-motion: reduce)';
export const DESKTOP = '(min-width: 1024px)';

export const usePrefersReducedMotion = () => useMediaQuery(REDUCED_MOTION);

export const prefersReducedMotion = () => window.matchMedia(REDUCED_MOTION).matches;
