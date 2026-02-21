import React from 'react';
import { motion } from 'motion/react';

export interface RadioOption {
  value: string;
  label: string;
}

export interface RadioGroupProps {
  options: RadioOption[];
  value: string;
  onChange: (value: string) => void;
  name: string;
  disabled?: boolean;
  orientation?: 'horizontal' | 'vertical';
}

export function RadioGroup({
  options,
  value,
  onChange,
  name,
  disabled = false,
  orientation = 'vertical',
}: RadioGroupProps) {
  return (
    <div
      className={`flex ${
        orientation === 'horizontal' ? 'flex-row gap-6' : 'flex-col gap-3'
      }`}
    >
      {options.map((option) => (
        <Radio
          key={option.value}
          name={name}
          value={option.value}
          label={option.label}
          checked={value === option.value}
          onChange={() => onChange(option.value)}
          disabled={disabled}
        />
      ))}
    </div>
  );
}

export interface RadioProps {
  name: string;
  value: string;
  label: string;
  checked: boolean;
  onChange: () => void;
  disabled?: boolean;
}

export function Radio({
  name,
  value,
  label,
  checked,
  onChange,
  disabled = false,
}: RadioProps) {
  return (
    <label className="inline-flex items-center gap-2 cursor-pointer">
      <div className="relative">
        <input
          type="radio"
          name={name}
          value={value}
          checked={checked}
          onChange={onChange}
          disabled={disabled}
          className="sr-only"
        />
        <motion.div
          whileTap={!disabled ? { scale: 0.9 } : {}}
          className={`
            w-5 h-5 rounded-full border-2
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
            animate={{ scale: checked ? 1 : 0 }}
            transition={{ duration: 0.15 }}
            className="w-2 h-2 rounded-full bg-white"
          />
        </motion.div>
      </div>
      <span className={`text-sm ${disabled ? 'opacity-50' : ''}`}>
        {label}
      </span>
    </label>
  );
}
