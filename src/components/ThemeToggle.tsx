import { useEffect, useState } from 'preact/hooks';
import { getStoredTheme, saveTheme } from '../utils/theme';
import type { Theme } from '../types';

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>(() => getStoredTheme());

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('light', 'dark', 'high-contrast');
    root.classList.add(theme.mode);
    if (theme.color === 'high-contrast') {
      root.classList.add('high-contrast');
    }
  }, [theme]);

  const toggleMode = () => {
    const newTheme: Theme = {
      ...theme,
      mode: theme.mode === 'light' ? 'dark' : 'light',
    };
    setTheme(newTheme);
    saveTheme(newTheme);
  };

  const toggleColor = () => {
    const newTheme: Theme = {
      ...theme,
      color: theme.color === 'default' ? 'high-contrast' : 'default',
    };
    setTheme(newTheme);
    saveTheme(newTheme);
  };

  return (
    <div class="flex gap-2 items-center">
      <button
        onClick={toggleMode}
        aria-label={`Switch to ${theme.mode === 'light' ? 'dark' : 'light'} mode`}
        class="px-3 py-2 rounded-md bg-burnt-orange text-white hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-burnt-orange focus:ring-offset-2 dark:focus:ring-offset-dark-bg transition-colors"
      >
        {theme.mode === 'light' ? '🌙' : '☀️'}
      </button>
      <button
        onClick={toggleColor}
        aria-label={`Switch to ${theme.color === 'default' ? 'high contrast' : 'default'} color mode`}
        class="px-3 py-2 rounded-md bg-burnt-orange text-white hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-burnt-orange focus:ring-offset-2 dark:focus:ring-offset-dark-bg transition-colors"
      >
        {theme.color === 'default' ? '🎨' : '🌈'}
      </button>
    </div>
  );
}
