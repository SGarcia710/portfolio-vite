import React from 'react';

interface ThemeToggleProps {
  isDark: boolean;
  onToggle: () => void;
}

export function ThemeToggle({ isDark, onToggle }: ThemeToggleProps) {
  return (
    <button
      onClick={onToggle}
      aria-label="Toggle theme"
      className="relative w-[52px] h-[26px] rounded-full cursor-pointer overflow-hidden transition-all duration-500 focus:outline-none focus:ring-2 focus:ring-ring"
      style={{
        background: isDark
          ? 'linear-gradient(to right, #0f1b3d, #1a237e, #283593)'
          : 'linear-gradient(to right, #4fc3f7, #29b6f6, #03a9f4)',
      }}
    >
      {/* Stars (visible in dark mode) */}
      <div
        className="absolute inset-0 transition-opacity duration-500"
        style={{ opacity: isDark ? 1 : 0 }}
      >
        <div className="absolute w-0.5 h-0.5 bg-white rounded-full top-1.5 left-2.5" />
        <div className="absolute w-1 h-1 bg-white rounded-full top-1 left-6" />
        <div className="absolute w-0.5 h-0.5 bg-white rounded-full top-3.5 left-4" />
        <div className="absolute w-0.5 h-0.5 bg-white rounded-full top-2.5 left-8" />
        <div className="absolute w-1 h-1 bg-white rounded-full top-4.5 left-6.5" />
      </div>

      {/* Clouds (visible in light mode) */}
      <div
        className="absolute inset-0 transition-opacity duration-500"
        style={{ opacity: isDark ? 0 : 1 }}
      >
        <svg className="absolute top-0.5 left-6" width="14" height="8" viewBox="0 0 14 8">
          <ellipse cx="7" cy="5.5" rx="7" ry="2.5" fill="white" opacity="0.6" />
          <ellipse cx="5" cy="4" rx="4" ry="3" fill="white" opacity="0.5" />
          <ellipse cx="10" cy="4" rx="3" ry="2.5" fill="white" opacity="0.5" />
        </svg>
        <svg className="absolute bottom-0 left-1.5" width="12" height="7" viewBox="0 0 12 7">
          <ellipse cx="6" cy="4.5" rx="6" ry="2.5" fill="white" opacity="0.4" />
          <ellipse cx="4" cy="3" rx="3.5" ry="2.5" fill="white" opacity="0.35" />
          <ellipse cx="9" cy="3" rx="3" ry="2" fill="white" opacity="0.35" />
        </svg>
      </div>

      {/* Thumb with Sun/Moon */}
      <div
        className="absolute top-[3px] w-5 h-5 rounded-full transition-all duration-500 ease-in-out flex items-center justify-center shadow-md"
        style={{
          transform: isDark ? 'translateX(29px)' : 'translateX(3px)',
          background: isDark ? '#e8e8e8' : '#fdd835',
        }}
      >
        {/* Sun rays (light mode) */}
        <div
          className="absolute inset-0 transition-opacity duration-500"
          style={{ opacity: isDark ? 0 : 1 }}
        >
          <div className="absolute inset-1 rounded-full bg-[#ffb300]" />
        </div>

        {/* Moon crater (dark mode) */}
        <div
          className="absolute inset-0 transition-opacity duration-500"
          style={{ opacity: isDark ? 1 : 0 }}
        >
          <div className="absolute w-2 h-2 rounded-full bg-[#bdbdbd] top-1 right-1.5" />
          <div className="absolute w-1 h-1 rounded-full bg-[#bdbdbd] bottom-1.5 left-1.5" />
        </div>
      </div>
    </button>
  );
}
