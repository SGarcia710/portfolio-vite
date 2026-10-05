import { useRef, type ElementType, type ReactNode } from 'react';
import { gsap, useGSAP } from '../../lib/gsap';
import { REDUCED_MOTION } from '../../lib/media';

interface RevealProps {
  children: ReactNode;
  className?: string;
  as?: ElementType;
  /** Animate direct children one after another instead of the wrapper. */
  stagger?: boolean;
}

/** Fades content up the first time it scrolls into view. */
export function Reveal({ children, className, as: Tag = 'div', stagger = false }: RevealProps) {
  const root = useRef<HTMLElement>(null);

  useGSAP(() => {
    const element = root.current;
    if (!element) return;
    gsap.matchMedia().add(`not ${REDUCED_MOTION}`, () => {
      gsap.from(stagger ? element.children : element, {
        autoAlpha: 0,
        y: 48,
        duration: 1.3,
        stagger: 0.08,
        scrollTrigger: { trigger: element, start: 'top 88%', once: true },
      });
    });
  }, { scope: root });

  return <Tag ref={root} className={className}>{children}</Tag>;
}
