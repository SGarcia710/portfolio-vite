import { useSyncExternalStore } from 'react';

/**
 * Tracks the work the preloader waits for (fonts, the WebGL scene) and
 * broadcasts when the intro may start. Tasks can register late; the loader
 * reads the aggregated progress on every frame.
 */
const tasks = new Map<string, number>();
const introListeners = new Set<() => void>();
let introStarted = false;

export function registerBootTask(name: string) {
  if (!tasks.has(name)) tasks.set(name, 0);
  return {
    progress: (value: number): void => { tasks.set(name, Math.max(tasks.get(name) ?? 0, Math.min(1, value))); },
    done: (): void => { tasks.set(name, 1); },
  };
}

export function getBootProgress(): number {
  if (!tasks.size) return 1;
  let total = 0;
  tasks.forEach((value) => { total += value; });
  return total / tasks.size;
}

export function startIntro() {
  if (introStarted) return;
  introStarted = true;
  document.documentElement.classList.remove('is-loading');
  introListeners.forEach((listener) => listener());
}

function subscribeIntro(listener: () => void) {
  introListeners.add(listener);
  return () => introListeners.delete(listener);
}

export function useIntroStarted(): boolean {
  return useSyncExternalStore(subscribeIntro, () => introStarted, () => false);
}
