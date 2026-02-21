import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

const lines = [
  'Crafting digital',
  'experiences that',
  'leave a mark',
];

export function TextRevealSection() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const lineEls = gsap.utils.toArray<HTMLElement>('.reveal-line');

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: '+=200%',
          pin: true,
          scrub: 1,
        },
      });

      lineEls.forEach((line, i) => {
        tl.from(
          line,
          {
            xPercent: 110,
            letterSpacing: '0.5em',
            duration: 1,
            ease: 'power3.out',
          },
          i * 0.3,
        );
      });
    },
    { scope: sectionRef },
  );

  return (
    <section ref={sectionRef} className="h-screen flex items-center justify-end overflow-hidden">
      <div className="pr-8 md:pr-16 lg:pr-24 text-right">
        {lines.map((line, i) => (
          <div key={i} className="overflow-hidden">
            <div className="reveal-line text-4xl md:text-6xl lg:text-8xl font-bold text-foreground whitespace-nowrap leading-tight">
              {line}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
