import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, useMotionValue, useSpring } from 'motion/react';
import { useLocation } from 'react-router';

export function CustomCursor() {
  const location = useLocation();
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const reticleRef = useRef<HTMLDivElement>(null);
  const pulseRef = useRef<HTMLSpanElement>(null);
  const isKTCodex = location.pathname === '/projects/ktcodex';

  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  const springConfig = { damping: 25, stiffness: 200, mass: 0.5 };
  const outerX = useSpring(mouseX, springConfig);
  const outerY = useSpring(mouseY, springConfig);

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      if (!isVisible) setIsVisible(true);
    },
    [mouseX, mouseY, isVisible],
  );

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [handleMouseMove]);

  useEffect(() => {
    if (!isKTCodex) return;
    let animations: Animation[] = [];
    const handleClick = (event: MouseEvent) => {
      if (event.detail === 0 || window.matchMedia('(pointer: coarse), (prefers-reduced-motion: reduce)').matches) return;
      const reticle = reticleRef.current;
      const pulse = pulseRef.current;
      if (!reticle || !pulse) return;

      mouseX.set(event.clientX);
      mouseY.set(event.clientY);
      setIsVisible(true);
      animations.forEach((animation) => animation.cancel());
      animations = [
        reticle.animate([
          { scale: '1', filter: 'brightness(1)' },
          { scale: '0.72', filter: 'brightness(1.9)', offset: 0.18 },
          { scale: '1.16', filter: 'brightness(1.3)', offset: 0.5 },
          { scale: '1', filter: 'brightness(1)' },
        ], { duration: 380, easing: 'ease-out' }),
        pulse.animate([
          { transform: 'scale(0.65)', opacity: 0.9 },
          { transform: 'scale(2.1)', opacity: 0 },
        ], { duration: 480, easing: 'cubic-bezier(0.16, 1, 0.3, 1)' }),
      ];
    };
    // Capture also catches clicks on controls that stop event propagation.
    document.addEventListener('click', handleClick, true);
    return () => {
      document.removeEventListener('click', handleClick, true);
      animations.forEach((animation) => animation.cancel());
    };
  }, [isKTCodex, mouseX, mouseY]);

  useEffect(() => {
    const handleOver = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest(
        'a, button, [role="button"], input[type="submit"], .cursor-hover',
      );
      if (target) setIsHovering(true);
    };
    const handleOut = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest(
        'a, button, [role="button"], input[type="submit"], .cursor-hover',
      );
      if (target) setIsHovering(false);
    };

    document.addEventListener('mouseover', handleOver);
    document.addEventListener('mouseout', handleOut);
    return () => {
      document.removeEventListener('mouseover', handleOver);
      document.removeEventListener('mouseout', handleOut);
    };
  }, []);

  // Hide on touch devices
  useEffect(() => {
    const isTouch = window.matchMedia('(pointer: coarse)').matches;
    if (isTouch) return;

    document.body.style.cursor = 'none';
    const style = document.createElement('style');
    style.id = 'custom-cursor-hide';
    style.textContent = '*, *::before, *::after { cursor: none !important; }';
    document.head.appendChild(style);

    return () => {
      document.body.style.cursor = '';
      style.remove();
    };
  }, []);

  // Don't render on touch devices
  if (typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches) {
    return null;
  }

  if (isKTCodex) {
    return (
      <>
        <motion.div
          ref={reticleRef}
          className="ktc-reticle-cursor"
          style={{ left: outerX, top: outerY, x: '-50%', y: '-50%', opacity: isVisible ? 1 : 0 }}
          animate={{ scale: isHovering ? 1.38 : 1, rotate: isHovering ? 45 : 0 }}
          transition={{ type: 'spring', damping: 22, stiffness: 280 }}
          aria-hidden="true"
        >
          <span ref={pulseRef} className="ktc-reticle-pulse" />
          <span className="ktc-reticle-tick ktc-reticle-tick-top" />
          <span className="ktc-reticle-tick ktc-reticle-tick-right" />
          <span className="ktc-reticle-tick ktc-reticle-tick-bottom" />
          <span className="ktc-reticle-tick ktc-reticle-tick-left" />
        </motion.div>
        <motion.div
          className="ktc-reticle-core"
          style={{ left: mouseX, top: mouseY, x: '-50%', y: '-50%', opacity: isVisible ? 1 : 0 }}
          aria-hidden="true"
        />
      </>
    );
  }

  return (
    <>
      {/* Outer circle - blend mode */}
      <motion.div
        style={{
          position: 'fixed',
          left: outerX,
          top: outerY,
          width: 40,
          height: 40,
          borderRadius: '50%',
          backgroundColor: 'white',
          mixBlendMode: 'difference',
          pointerEvents: 'none',
          zIndex: 9999,
          x: '-50%',
          y: '-50%',
          opacity: isVisible ? 1 : 0,
        }}
        animate={{
          scale: isHovering ? 1.8 : 1,
        }}
        transition={{ type: 'spring', damping: 20, stiffness: 300 }}
      />
      {/* Inner dot */}
      <motion.div
        style={{
          position: 'fixed',
          left: mouseX,
          top: mouseY,
          width: 8,
          height: 8,
          borderRadius: '50%',
          backgroundColor: 'var(--accent)',
          pointerEvents: 'none',
          zIndex: 10000,
          x: '-50%',
          y: '-50%',
          opacity: isVisible ? 1 : 0,
        }}
      />
    </>
  );
}
