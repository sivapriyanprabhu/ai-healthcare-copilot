import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { Sun, Moon } from 'lucide-react';

interface ThemeToggleProps {
  variant?: 'button' | 'badge' | 'switch';
  className?: string;
  showLabel?: boolean;
}

export default function ThemeToggle({
  variant = 'badge',
  className = '',
  showLabel = true
}: ThemeToggleProps) {
  const { theme, setTheme, isDark, toggleTheme } = useTheme();

  if (variant === 'switch') {
    return (
      <div className={`inline-flex items-center p-1 rounded-2xl bg-slate-200/80 dark:bg-slate-800/90 border border-slate-300/80 dark:border-slate-700/80 shadow-xs ${className}`}>
        <button
          type="button"
          onClick={() => setTheme('light')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
            !isDark
              ? 'bg-white text-slate-900 shadow-sm'
              : 'text-slate-500 hover:text-slate-200'
          }`}
          title="Activate Light Mode"
        >
          <Sun className="w-3.5 h-3.5 text-amber-500" />
          <span>Light</span>
        </button>

        <button
          type="button"
          onClick={() => setTheme('dark')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
            isDark
              ? 'bg-teal-600 text-white shadow-sm shadow-teal-600/30'
              : 'text-slate-500 hover:text-slate-900'
          }`}
          title="Activate Dark Mode"
        >
          <Moon className="w-3.5 h-3.5 text-teal-200" />
          <span>Dark</span>
        </button>
      </div>
    );
  }

  // Default interactive toggle badge
  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-2xl border text-xs font-bold transition-all active:scale-95 cursor-pointer shadow-xs ${
        isDark
          ? 'bg-slate-900/95 hover:bg-slate-800 text-teal-300 border-teal-500/40 shadow-teal-500/10'
          : 'bg-white/95 hover:bg-slate-50 text-slate-800 border-slate-200 shadow-slate-200/50'
      } ${className}`}
      title={isDark ? "Click to switch to Light Mode" : "Click to switch to Dark Mode"}
      aria-label="Toggle Theme Mode"
    >
      {/* Pulsing state dot */}
      <span className="relative flex h-2 w-2">
        <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isDark ? 'bg-teal-400' : 'bg-amber-400'}`}></span>
        <span className={`relative inline-flex rounded-full h-2 w-2 ${isDark ? 'bg-teal-500' : 'bg-amber-500'}`}></span>
      </span>

      <div className="flex items-center gap-1.5">
        {isDark ? (
          <>
            <Moon className="w-3.5 h-3.5 text-teal-400 fill-teal-400/20" />
            {showLabel && <span>Dark Mode</span>}
          </>
        ) : (
          <>
            <Sun className="w-3.5 h-3.5 text-amber-500 fill-amber-500/20" />
            {showLabel && <span>Light Mode</span>}
          </>
        )}
      </div>
    </button>
  );
}
