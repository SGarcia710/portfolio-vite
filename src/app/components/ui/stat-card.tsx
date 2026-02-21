import React from 'react';
import { motion } from 'motion/react';

export interface StatCardProps {
  value: string | number;
  label: string;
  icon?: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  variant?: 'default' | 'accent' | 'gradient';
}

export function StatCard({ value, label, icon, trend, variant = 'default' }: StatCardProps) {
  const variantStyles = {
    default: 'bg-card border border-border',
    accent: 'bg-accent/10 border border-accent/20',
    gradient: 'bg-gradient-to-br from-accent/20 to-purple-500/20 border border-accent/30',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className={`rounded-2xl p-6 ${variantStyles[variant]}`}
    >
      <div className="flex items-start justify-between mb-4">
        {icon && (
          <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center text-accent">
            {icon}
          </div>
        )}
        {trend && (
          <div
            className={`text-sm font-medium ${
              trend.isPositive ? 'text-green-500' : 'text-red-500'
            }`}
          >
            {trend.isPositive ? '+' : '-'}
            {Math.abs(trend.value)}%
          </div>
        )}
      </div>
      <div className="text-3xl md:text-4xl font-bold mb-2">{value}</div>
      <div className="text-sm text-muted-foreground">{label}</div>
    </motion.div>
  );
}
