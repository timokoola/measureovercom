import { useState, useEffect } from 'preact/hooks';
import { setLanguage, getLanguage, type Language } from '../utils/i18n';

export function LanguageSelector() {
  const [currentLang, setCurrentLang] = useState<Language>(getLanguage());

  useEffect(() => {
    setCurrentLang(getLanguage());
  }, []);

  const handleChange = (lang: Language) => {
    setLanguage(lang);
    setCurrentLang(lang);
    localStorage.setItem('measureover-language', lang);
    // Trigger a re-render by dispatching a custom event
    window.dispatchEvent(new Event('languagechange'));
  };

  return (
    <div class="flex items-center gap-2">
      <label for="language-select" class="sr-only">
        Select language
      </label>
      <select
        id="language-select"
        value={currentLang}
        onChange={(e) => handleChange(e.currentTarget.value as Language)}
        class="px-2 py-1 text-xs bg-white dark:bg-dark-surface border border-gray-300 dark:border-gray-700 rounded text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-burnt-orange focus:ring-offset-2"
        aria-label="Select language"
      >
        <option value="en">🇬🇧 English</option>
        <option value="fi">🇫🇮 Suomi</option>
        <option value="sv">🇸🇪 Svenska</option>
      </select>
    </div>
  );
}
