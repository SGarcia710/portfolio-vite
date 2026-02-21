import React from 'react';
import { motion } from 'motion/react';

export interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const sizeClasses = {
  sm: { track: 'w-8 h-4', thumb: 'w-3 h-3', translate: 'translate-x-4' },
  md: { track: 'w-11 h-6', thumb: 'w-5 h-5', translate: 'translate-x-5' },
  lg: { track: 'w-14 h-7', thumb: 'w-6 h-6', translate: 'translate-x-7' },
};

export function Switch({
  checked,
  onChange,
  label,
  disabled = false,
  size = 'md',
}: SwitchProps) {
  const sizes = sizeClasses[size];

  return (
    <label className="inline-flex items-center gap-3 cursor-pointer">
      <div className="relative">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          disabled={disabled}
          className="sr-only"
        />
        <motion.div
          animate={{
            backgroundColor: checked
              ? 'var(--accent)'
              : 'var(--switch-background)',
          }}
          className={`
            ${sizes.track}
            rounded-full
            transition-colors duration-200
            ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          `}
        >
          <motion.div
            animate={{
              x: checked ? sizes.translate : 'translate-x-0.5',
            }}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            className={`
              ${sizes.thumb}
              bg-white rounded-full
              shadow-md
              absolute top-1/2 -translate-y-1/2 left-0.5
            `}
          />
        </motion.div>
      </div>
      {label && (
        <span className={`text-sm font-medium ${disabled ? 'opacity-50' : ''}`}>
          {label}
        </span>
      )}
    </label>
  );
}
