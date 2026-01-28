import { useState, useEffect } from 'preact/hooks';
import { t, getLanguage, type Language } from '../utils/i18n';

export function useI18n() {
  const [lang, setLang] = useState<Language>(getLanguage());

  useEffect(() => {
    const handleLangChange = () => {
      setLang(getLanguage());
    };
    window.addEventListener('languagechange', handleLangChange);
    return () => window.removeEventListener('languagechange', handleLangChange);
  }, []);

  return { t, lang };
}
