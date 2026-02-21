import { useState, useEffect, useCallback } from 'react';
import { motion, useMotionValue, useSpring } from 'motion/react';

export function CustomCursor() {
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

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
