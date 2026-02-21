import React from 'react';
import { motion } from 'motion/react';
import { Check } from 'lucide-react';

export interface CheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const sizeClasses = {
  sm: 'w-4 h-4',
  md: 'w-5 h-5',
  lg: 'w-6 h-6',
};

export function Checkbox({
  checked,
  onChange,
  label,
  disabled = false,
  size = 'md',
}: CheckboxProps) {
  return (
    <label className="inline-flex items-center gap-2 cursor-pointer">
      <div className="relative">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          disabled={disabled}
          className="sr-only"
        />
        <motion.div
          whileTap={!disabled ? { scale: 0.9 } : {}}
          className={`
            ${sizeClasses[size]}
            rounded border-2
            flex items-center justify-center
            transition-colors duration-200
            ${
              checked
                ? 'bg-accent border-accent'
                : 'bg-transparent border-input'
            }
            ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          `}
        >
          <motion.div
            initial={false}
            animate={{ scale: checked ? 1 : 0, opacity: checked ? 1 : 0 }}
            transition={{ duration: 0.15 }}
          >
            <Check className="w-full h-full text-white" strokeWidth={3} />
          </motion.div>
        </motion.div>
      </div>
      {label && (
        <span className={`text-sm ${disabled ? 'opacity-50' : ''}`}>
          {label}
        </span>
      )}
    </label>
  );
}
