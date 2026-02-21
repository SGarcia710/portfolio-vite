import React from 'react';
import { motion } from 'motion/react';
import { X } from 'lucide-react';

export interface ChipProps {
  label: string;
  selected?: boolean;
  removable?: boolean;
  onClick?: () => void;
  onRemove?: () => void;
  variant?: 'default' | 'primary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
}

const variantStyles = {
  default: {
    base: 'bg-secondary text-secondary-foreground border border-transparent',
    selected: 'bg-primary text-primary-foreground',
  },
  primary: {
    base: 'bg-accent/10 text-accent border border-accent/20',
    selected: 'bg-accent text-accent-foreground',
  },
  outline: {
    base: 'bg-transparent text-foreground border border-border',
    selected: 'bg-primary text-primary-foreground border-primary',
  },
};

const sizeStyles = {
  sm: 'h-7 px-3 text-xs gap-1',
  md: 'h-8 px-4 text-sm gap-1.5',
  lg: 'h-10 px-5 text-base gap-2',
};

export function Chip({
  label,
  selected = false,
  removable = false,
  onClick,
  onRemove,
  variant = 'default',
  size = 'md',
}: ChipProps) {
  const styles = selected ? variantStyles[variant].selected : variantStyles[variant].base;

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`
        inline-flex items-center
        rounded-full font-medium
        transition-all duration-200
        cursor-pointer
        ${styles}
        ${sizeStyles[size]}
      `}
      onClick={onClick}
    >
      <span>{label}</span>
      {removable && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove?.();
          }}
          className="ml-1 hover:bg-black/10 dark:hover:bg-white/10 rounded-full p-0.5 transition-colors"
        >
          <X className="w-3 h-3" />
        </button>
      )}
    </motion.div>
  );
}
