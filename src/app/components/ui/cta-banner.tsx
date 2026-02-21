import React from 'react';
import { motion } from 'motion/react';
import { Button } from './button';
import { X } from 'lucide-react';

export interface CTABannerProps {
  title: string;
  description?: string;
  primaryAction: {
    label: string;
    onClick: () => void;
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };
  onDismiss?: () => void;
  variant?: 'default' | 'accent' | 'gradient';
}

export function CTABanner({
  title,
  description,
  primaryAction,
  secondaryAction,
  onDismiss,
  variant = 'default',
}: CTABannerProps) {
  const variantStyles = {
    default: 'bg-card border border-border',
    accent: 'bg-accent/10 border border-accent/20',
    gradient: 'bg-gradient-to-r from-accent/20 via-purple-500/20 to-orange-500/20 border border-accent/30',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-2xl p-6 md:p-8 relative ${variantStyles[variant]}`}
    >
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      )}

      <div className="max-w-3xl">
        <h3 className="text-2xl md:text-3xl font-bold mb-3">{title}</h3>
        {description && (
          <p className="text-foreground-secondary mb-6">{description}</p>
        )}

        <div className="flex flex-col sm:flex-row gap-3">
          <Button onClick={primaryAction.onClick} size="lg">
            {primaryAction.label}
          </Button>
          {secondaryAction && (
            <Button
              onClick={secondaryAction.onClick}
              variant="secondary"
              size="lg"
            >
              {secondaryAction.label}
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
