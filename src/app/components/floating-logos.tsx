import { useMemo } from 'react';
import { motion } from 'motion/react';
import { PixelLogo, PIXEL_LOGOS } from './pixel-logos';

interface FloatingLogoPosition {
  x: string;
  y: string;
  size: number;
  delay: number;
  duration: number;
  floatRange: number;
  rotateRange: number;
}

// Predefined positions that spread logos around the edges of the hero,
// avoiding the center text area.
const POSITIONS: FloatingLogoPosition[] = [
  // Top-left area
  { x: '8%', y: '12%', size: 56, delay: 0, duration: 6, floatRange: 18, rotateRange: 8 },
  // Top-right area
  { x: '85%', y: '8%', size: 48, delay: 0.8, duration: 7, floatRange: 15, rotateRange: -6 },
  // Left side
  { x: '5%', y: '55%', size: 52, delay: 1.5, duration: 8, floatRange: 20, rotateRange: 10 },
  // Right side
  { x: '88%', y: '45%', size: 60, delay: 0.3, duration: 6.5, floatRange: 16, rotateRange: -8 },
  // Bottom-left
  { x: '12%', y: '80%', size: 44, delay: 2, duration: 7.5, floatRange: 14, rotateRange: 6 },
  // Bottom-right
  { x: '82%', y: '78%', size: 50, delay: 1.2, duration: 6, floatRange: 18, rotateRange: -10 },
  // Mid-left (lower)
  { x: '18%', y: '35%', size: 40, delay: 0.5, duration: 8.5, floatRange: 12, rotateRange: 5 },
  // Mid-right (upper)
  { x: '78%', y: '25%', size: 46, delay: 1.8, duration: 7, floatRange: 16, rotateRange: -7 },
];

export function FloatingLogos() {
  const logos = useMemo(() => {
    return PIXEL_LOGOS.map((config, i) => ({
      config,
      position: POSITIONS[i % POSITIONS.length],
    }));
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
      {logos.map(({ config, position }) => (
        <motion.div
          key={config.name}
          className="absolute"
          style={{
            left: position.x,
            top: position.y,
            filter: `drop-shadow(0 0 12px ${config.glowColor}40)`,
          }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            delay: position.delay + 0.8,
            duration: 0.6,
            type: 'spring',
            stiffness: 200,
            damping: 15,
          }}
        >
          {/* Floating animation */}
          <motion.div
            animate={{
              y: [-position.floatRange, position.floatRange, -position.floatRange],
              rotate: [-position.rotateRange, position.rotateRange, -position.rotateRange],
            }}
            transition={{
              duration: position.duration,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            {/* Glow pulse */}
            <motion.div
              animate={{
                opacity: [0.6, 1, 0.6],
              }}
              transition={{
                duration: position.duration * 0.7,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: position.delay,
              }}
            >
              <PixelLogo config={config} size={position.size} />
            </motion.div>
          </motion.div>

          {/* Label tooltip */}
          <motion.span
            className="block text-center text-[10px] mt-1 font-mono opacity-0"
            animate={{ opacity: [0, 0.5, 0] }}
            transition={{
              duration: position.duration,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: position.delay + 1,
            }}
            style={{ color: config.glowColor }}
          >
            {config.name}
          </motion.span>
        </motion.div>
      ))}
    </div>
  );
}
