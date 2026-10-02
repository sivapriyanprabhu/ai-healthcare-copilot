import React, { createContext, useContext, useEffect, useState } from 'react';

export type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: ThemeMode;
  setTheme: (mode: ThemeMode) => void;
  isDark: boolean;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const updateDOMTheme = (darkActive: boolean) => {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  const body = document.body;

  if (darkActive) {
    root.classList.add('dark');
    root.setAttribute('data-theme', 'dark');
    if (body) {
      body.classList.add('dark');
      body.setAttribute('data-theme', 'dark');
    }
    root.style.colorScheme = 'dark';
  } else {
    root.classList.remove('dark');
    root.setAttribute('data-theme', 'light');
    if (body) {
      body.classList.remove('dark');
      body.setAttribute('data-theme', 'light');
    }
    root.style.colorScheme = 'light';
  }
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<ThemeMode>(() => {
    if (typeof localStorage === 'undefined') return 'dark';
    const saved = localStorage.getItem('app_theme') as ThemeMode;
    // Default to 'dark' or stored preference for impressive futuristic look
    return saved === 'light' || saved === 'dark' || saved === 'system' ? saved : 'dark';
  });

  const [isDark, setIsDark] = useState<boolean>(() => {
    if (typeof window === 'undefined') return true;
    if (theme === 'dark') return true;
    if (theme === 'light') return false;
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // Apply immediately on mount
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const resolveDarkActive = (currentTheme: ThemeMode) => {
      if (currentTheme === 'dark') return true;
      if (currentTheme === 'light') return false;
      return mediaQuery.matches;
    };

    const active = resolveDarkActive(theme);
    setIsDark(active);
    updateDOMTheme(active);

    const listener = (e: MediaQueryListEvent) => {
      if (theme === 'system') {
        setIsDark(e.matches);
        updateDOMTheme(e.matches);
      }
    };

    mediaQuery.addEventListener('change', listener);
    return () => mediaQuery.removeEventListener('change', listener);
  }, [theme]);

  const setTheme = (mode: ThemeMode) => {
    setThemeState(mode);
    try {
      localStorage.setItem('app_theme', mode);
    } catch (e) {}

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const darkActive = mode === 'dark' || (mode === 'system' && mediaQuery.matches);
    setIsDark(darkActive);
    updateDOMTheme(darkActive);
  };

  const toggleTheme = () => {
    const currentIsDark = document.documentElement.classList.contains('dark') || isDark;
    const nextMode: ThemeMode = currentIsDark ? 'light' : 'dark';
    setTheme(nextMode);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
