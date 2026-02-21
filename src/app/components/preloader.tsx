import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import logoWhite from '../../../assets/LogoSG-IconWhite.svg';
import logoBlack from '../../../assets/LogoSG-IconBlack.svg';

interface PreloaderProps {
  isDark: boolean;
  onComplete: () => void;
}

function RollingDigit({ digit }: { digit: number }) {
  return (
    <span className="inline-block h-[1.2em] overflow-hidden relative" style={{ width: '0.65em' }}>
      <motion.span
        className="block"
        animate={{ y: `${-digit * 1.2}em` }}
        transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
      >
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
          <span key={n} className="block h-[1.2em] leading-[1.2em]">
            {n}
          </span>
        ))}
      </motion.span>
    </span>
  );
}

export function Preloader({ isDark, onComplete }: PreloaderProps) {
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [isExiting, setIsExiting] = useState(false);
  const startTimeRef = useRef<number>(0);
  const rafRef = useRef<number>(0);

  const DURATION = 4000;

  const easeInOutCubic = (t: number) => {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  };

  const animate = useCallback(
    (timestamp: number) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp;
      const elapsed = timestamp - startTimeRef.current;
      const t = Math.min(elapsed / DURATION, 1);
      const easedProgress = Math.round(easeInOutCubic(t) * 100);

      setProgress(easedProgress);

      if (t < 1) {
        rafRef.current = requestAnimationFrame(animate);
      } else {
        // Reached 100 — wait, then exit
        setTimeout(() => {
          setIsExiting(true);
        }, 400);
      }
    },
    [],
  );

  useEffect(() => {
    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [animate]);

  const handleExitComplete = () => {
    setIsVisible(false);
    onComplete();
  };

  // Decompose progress into 3 digits
  const hundreds = Math.floor(progress / 100);
  const tens = Math.floor((progress % 100) / 10);
  const ones = progress % 10;

  if (!isVisible) return null;

  return (
    <AnimatePresence onExitComplete={handleExitComplete}>
      {!isExiting && (
        <motion.div
          key="preloader"
          exit={{ y: '-100%' }}
          transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
          className="fixed inset-0 z-[9999] bg-background flex flex-col"
        >
          {/* Centered logo */}
          <div className="flex-1 flex items-center justify-center">
            <motion.img
              src={isDark ? logoWhite : logoBlack}
              alt="SG"
              className="h-16 w-auto"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
            />
          </div>

          {/* Bottom section: loading text + counter + progress line */}
          <div className="px-8 pb-8 md:px-12 md:pb-12">
            <div className="flex items-end justify-between gap-4">
              <span className="text-xs tracking-[0.2em] uppercase text-foreground-secondary font-medium">
                Loading
              </span>
              <div className="flex items-baseline gap-0.5">
                <span
                  className="text-2xl md:text-3xl font-bold text-foreground"
                  style={{ fontVariantNumeric: 'tabular-nums' }}
                >
                  <RollingDigit digit={hundreds} />
                  <RollingDigit digit={tens} />
                  <RollingDigit digit={ones} />
                </span>
                <span className="text-sm font-medium text-foreground-secondary">%</span>
              </div>
            </div>

            {/* Progress line */}
            <div className="mt-3 h-[1px] bg-border/30 relative overflow-hidden">
              <motion.div
                className="absolute inset-y-0 left-0 bg-foreground"
                initial={{ width: '0%' }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.1, ease: 'linear' }}
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
