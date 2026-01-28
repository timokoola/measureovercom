import { useEffect, useState } from 'preact/hooks';
import { applyTheme, getStoredTheme, saveTheme } from '../utils/theme';
import type { Theme } from '../types';

interface ThemeProviderProps {
  children: preact.ComponentChildren;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(() => getStoredTheme());

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  const updateTheme = (newTheme: Theme) => {
    setTheme(newTheme);
    saveTheme(newTheme);
  };

  return (
    <div data-theme-provider>
      {children}
      <script
        dangerouslySetInnerHTML={{
          __html: `
            (function() {
              const theme = ${JSON.stringify(theme)};
              const root = document.documentElement;
              root.classList.remove('light', 'dark', 'high-contrast');
              root.classList.add(theme.mode);
              if (theme.color === 'high-contrast') {
                root.classList.add('high-contrast');
              }
            })();
          `,
        }}
      />
    </div>
  );
}
