import type { Theme } from '../types';

const THEME_STORAGE_KEY = 'measureover-theme';

export function getStoredTheme(): Theme {
  if (typeof window === 'undefined') {
    return { mode: 'light', color: 'default' };
  }

  let stored: string | null = null;
  try {
    stored = localStorage.getItem(THEME_STORAGE_KEY);
  } catch {
    stored = null;
  }

  if (stored) {
    try {
      // Validate rather than cast: a corrupt value like {"mode":"x"} used to put
      // class "x" on <html> permanently, leaving no theme applied at all.
      const parsed = JSON.parse(stored) as Partial<Theme>;
      const mode = parsed?.mode === 'dark' ? 'dark' : parsed?.mode === 'light' ? 'light' : null;
      const color =
        parsed?.color === 'high-contrast'
          ? 'high-contrast'
          : parsed?.color === 'default'
            ? 'default'
            : 'default';
      if (mode) return { mode, color };
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

/**
 * Persist only. Callers apply the theme themselves — this used to also call
 * applyTheme, so every toggle applied the classes twice.
 */
export function saveTheme(theme: Theme): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(THEME_STORAGE_KEY, JSON.stringify(theme));
  } catch {
    // Storage full or blocked (private mode). The in-memory theme still
    // applies for this session; losing the preference is not worth an alert.
  }
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
