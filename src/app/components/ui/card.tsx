import React from 'react';
import { motion } from 'motion/react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'bordered' | 'glass';
  hoverable?: boolean;
  clickable?: boolean;
}

const variantStyles = {
  default: 'bg-card border border-border',
  elevated: 'bg-card shadow-lg',
  bordered: 'bg-card border-2 border-border',
  glass: 'glass',
};

export function Card({
  variant = 'default',
  hoverable = false,
  clickable = false,
  className = '',
  children,
  ...props
}: CardProps) {
  const Component = clickable || hoverable ? motion.div : 'div';
  const motionProps = clickable || hoverable ? {
    whileHover: hoverable ? { 
      y: -4,
      boxShadow: 'var(--shadow-xl)',
      transition: { duration: 0.2 }
    } : {},
    whileTap: clickable ? { scale: 0.98 } : {},
  } : {};

  return (
    <Component
      className={`
        rounded-2xl overflow-hidden
        transition-all duration-300
        ${variantStyles[variant]}
        ${clickable ? 'cursor-pointer' : ''}
        ${className}
      `}
      {...motionProps}
      {...props}
    >
      {children}
    </Component>
  );
}

export function CardHeader({
  className = '',
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`p-6 ${className}`} {...props}>
      {children}
    </div>
  );
}

export function CardContent({
  className = '',
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`p-6 pt-0 ${className}`} {...props}>
      {children}
    </div>
  );
}

export function CardFooter({
  className = '',
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`p-6 pt-0 ${className}`} {...props}>
      {children}
    </div>
  );
}
