import { useEffect, useState } from 'preact/hooks';
import { getStoredTheme, saveTheme } from '../utils/theme';
import type { Theme } from '../types';
import { t } from '../utils/i18n';

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
        aria-label={`${t('switchToMode')} ${theme.mode === 'light' ? t('darkMode') : t('lightMode')}`}
        class="p-2.5 rounded-lg bg-white dark:bg-dark-surface border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-dark-surface/80 hover:border-gray-400 dark:hover:border-gray-600 focus:outline-none focus:ring-2 focus:ring-burnt-orange focus:ring-offset-2 dark:focus:ring-offset-dark-bg transition-all shadow-sm hover:shadow-md"
        title={`${t('switchToMode')} ${theme.mode === 'light' ? t('darkMode') : t('lightMode')}`}
      >
        {theme.mode === 'light' ? '🌙' : '☀️'}
      </button>
      <button
        onClick={toggleColor}
        aria-label={`${t('switchColorMode')} ${theme.color === 'default' ? t('colorModeHighContrast') : t('colorModeDefault')}`}
        class="p-2.5 rounded-lg bg-white dark:bg-dark-surface border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-dark-surface/80 hover:border-gray-400 dark:hover:border-gray-600 focus:outline-none focus:ring-2 focus:ring-burnt-orange focus:ring-offset-2 dark:focus:ring-offset-dark-bg transition-all shadow-sm hover:shadow-md"
        title={`${t('switchColorMode')} ${theme.color === 'default' ? t('colorModeHighContrast') : t('colorModeDefault')}`}
      >
        {theme.color === 'default' ? '🎨' : '🌈'}
      </button>
    </div>
  );
}
