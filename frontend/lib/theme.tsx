'use client';

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

export type AppTheme = 'dark' | 'light';

type ThemeContextValue = {
  theme: AppTheme;
  setTheme: (theme: AppTheme) => void;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

const STORAGE_KEY = 'ahar-theme';

function applyThemeToDom(theme: AppTheme) {
  document.documentElement.dataset.theme = theme;
}

function getInitialTheme(): AppTheme {
  // Keep SSR deterministic (defaults to dark). We'll reconcile on mount.
  return 'dark';
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<AppTheme>(getInitialTheme);

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY) as AppTheme | null;
    if (stored === 'dark' || stored === 'light') {
      setThemeState(stored);
      applyThemeToDom(stored);
      return;
    }

    const prefersDark = window.matchMedia?.('(prefers-color-scheme: dark)')?.matches;
    const inferred: AppTheme = prefersDark ? 'dark' : 'light';
    setThemeState(inferred);
    applyThemeToDom(inferred);
  }, []);

  const setTheme = useCallback((next: AppTheme) => {
    setThemeState(next);
    window.localStorage.setItem(STORAGE_KEY, next);
    applyThemeToDom(next);
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme((theme === 'dark' ? 'light' : 'dark') as AppTheme);
  }, [setTheme, theme]);

  const value = useMemo<ThemeContextValue>(() => ({ theme, setTheme, toggleTheme }), [theme, setTheme, toggleTheme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}

