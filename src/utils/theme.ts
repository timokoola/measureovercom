import type { Theme } from '../types';

const THEME_STORAGE_KEY = 'measureover-theme';

export function getStoredTheme(): Theme {
  if (typeof window === 'undefined') {
    return { mode: 'light', color: 'default' };
  }

  const stored = localStorage.getItem(THEME_STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored) as Theme;
    } catch {
      // Invalid stored theme, use default
    }
  }

  // Check system preference
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  return {
    mode: prefersDark ? 'dark' : 'light',
    color: 'default',
  };
}

export function saveTheme(theme: Theme): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(THEME_STORAGE_KEY, JSON.stringify(theme));
  applyTheme(theme);
}

export function applyTheme(theme: Theme): void {
  if (typeof document === 'undefined') return;

  const root = document.documentElement;
  root.classList.remove('light', 'dark', 'high-contrast');
  root.classList.add(theme.mode);
  if (theme.color === 'high-contrast') {
    root.classList.add('high-contrast');
  }
}
