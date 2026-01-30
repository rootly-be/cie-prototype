'use client';

import { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';

type Theme = 'light' | 'dark' | 'system';

interface ThemeContextValue {
  theme: Theme;
  resolvedTheme: 'light' | 'dark';
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

function getSystemTheme(): 'light' | 'dark' {
  if (typeof window === 'undefined') return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>('system');
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('light');
  const [mounted, setMounted] = useState(false);

  // Read from localStorage on mount (client-side only)
  useEffect(() => {
    setMounted(true);
    try {
      const stored = localStorage.getItem('theme') as Theme | null;
      if (stored && ['light', 'dark', 'system'].includes(stored)) {
        setTheme(stored);
      }
    } catch {
      // localStorage not available (SSR or private browsing)
    }
  }, []);

  // Apply theme changes and save to localStorage
  useEffect(() => {
    if (!mounted) return;

    // Save to localStorage
    try {
      localStorage.setItem('theme', theme);
    } catch {
      // localStorage not available
    }

    // Resolve actual theme
    let resolved: 'light' | 'dark' = 'light';
    if (theme === 'dark') {
      resolved = 'dark';
    } else if (theme === 'light') {
      resolved = 'light';
    } else {
      // system
      resolved = getSystemTheme();
    }

    setResolvedTheme(resolved);

    // Apply dark-mode class to html element (matches FOUC script)
    if (resolved === 'dark') {
      document.documentElement.classList.add('dark-mode');
    } else {
      document.documentElement.classList.remove('dark-mode');
    }
  }, [theme, mounted]);

  // Listen for system preference changes when theme is 'system'
  useEffect(() => {
    if (!mounted || theme !== 'system') return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = (e: MediaQueryListEvent) => {
      const newResolved = e.matches ? 'dark' : 'light';
      setResolvedTheme(newResolved);
      if (newResolved === 'dark') {
        document.documentElement.classList.add('dark-mode');
      } else {
        document.documentElement.classList.remove('dark-mode');
      }
    };

    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, [theme, mounted]);

  // Memoize context value to prevent unnecessary re-renders
  const value = useMemo<ThemeContextValue>(
    () => ({ theme, resolvedTheme, setTheme }),
    [theme, resolvedTheme]
  );

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
