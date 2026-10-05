import { useEffect, useRef, useState } from 'react';
import type { ClientProject } from '../../../content/projects';
import { gsap } from '../../../lib/gsap';
import { cn } from '../../../lib/cn';

interface CursorPreviewProps {
  projects: ClientProject[];
  activeId: string | null;
}

/** Floating image that trails the pointer while a project row is hovered. Fine pointers only. */
export function CursorPreview({ projects, activeId }: CursorPreviewProps) {
  const root = useRef<HTMLDivElement>(null);
  // Images mount the first time their row is hovered, so the list never preloads all of them.
  const [seen, setSeen] = useState<ReadonlySet<string>>(() => new Set());

  useEffect(() => {
    if (activeId && !seen.has(activeId)) setSeen(new Set(seen).add(activeId));
  }, [activeId, seen]);

  useEffect(() => {
    const element = root.current;
    if (!element || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return undefined;
    const x = gsap.quickTo(element, 'x', { duration: 0.7, ease: 'expo.out' });
    const y = gsap.quickTo(element, 'y', { duration: 0.7, ease: 'expo.out' });
    const rotate = gsap.quickTo(element, 'rotation', { duration: 0.9, ease: 'expo.out' });
    let lastX = 0;
    const onMove = (event: PointerEvent) => {
      x(event.clientX + 28);
      y(event.clientY - 120);
      rotate(Math.max(-8, Math.min(8, (event.clientX - lastX) * 0.4)));
      lastX = event.clientX;
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  }, []);

  useEffect(() => {
    if (!root.current) return;
    gsap.to(root.current, {
      autoAlpha: activeId ? 1 : 0,
      scale: activeId ? 1 : 0.85,
      duration: 0.5,
      ease: 'expo.out',
    });
  }, [activeId]);

  return (
    <div
      ref={root}
      aria-hidden="true"
      className="pointer-events-none invisible fixed top-0 left-0 z-[var(--z-overlay)] hidden aspect-[4/3] w-[clamp(16rem,22vw,22rem)] overflow-hidden rounded-[1rem] opacity-0 shadow-[0_30px_80px_-20px_rgb(0_0_0/0.8)] [@media(hover:hover)_and_(pointer:fine)]:block"
    >
      {projects.filter((project) => seen.has(project.id)).map((project) => (
        <img
          key={project.id}
          src={project.image}
          alt=""
          loading="lazy"
          decoding="async"
          className={cn(
            'absolute inset-0 h-full w-full object-cover transition-[opacity,transform] duration-700 ease-[var(--ease-out-expo)]',
            project.id === activeId ? 'scale-100 opacity-100' : 'scale-110 opacity-0',
          )}
        />
      ))}
    </div>
  );
}
