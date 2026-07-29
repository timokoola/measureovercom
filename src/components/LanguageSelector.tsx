import { useState, useEffect } from 'preact/hooks';
import { setLanguage, getLanguage, type Language, t } from '../utils/i18n';

export function LanguageSelector() {
  const [currentLang, setCurrentLang] = useState<Language>(getLanguage());

  useEffect(() => {
    setCurrentLang(getLanguage());
  }, []);

  const handleChange = (lang: Language) => {
    setLanguage(lang);
    setCurrentLang(lang);
    try {
      localStorage.setItem('measureover-language', lang);
    } catch {
      // Storage full or blocked. The language still switches for this session;
      // an unguarded throw here would abort before the event below and leave
      // the rest of the UI on the old language.
    }
    // Trigger a re-render by dispatching a custom event
    window.dispatchEvent(new Event('languagechange'));
  };

  return (
    <div class="flex items-center gap-2">
      <label for="language-select" class="sr-only">
        {t('selectLanguage')}
      </label>
      <select
        id="language-select"
        value={currentLang}
        onChange={(e) => handleChange(e.currentTarget.value as Language)}
        class="px-2 py-1 text-xs bg-white dark:bg-dark-surface border border-gray-300 dark:border-gray-700 rounded-sm text-gray-700 dark:text-gray-300 focus:outline-hidden focus:ring-2 focus:ring-burnt-orange focus:ring-offset-2"
        aria-label={t('selectLanguage')}
      >
        <option value="en">🇬🇧 English</option>
        <option value="fi">🇫🇮 Suomi</option>
        <option value="sv">🇸🇪 Svenska</option>
        <option value="fr">🇫🇷 Français</option>
        <option value="es">🇪🇸 Español</option>
        <option value="de">🇩🇪 Deutsch</option>
      </select>
    </div>
  );
}
