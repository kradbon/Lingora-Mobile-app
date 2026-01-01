import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { translate } from './strings';
import { getCurrentLanguage, loadStoredLanguage, storeLanguage } from './store';
import { LANGUAGE_OPTIONS, type Language } from './types';

type I18nContextValue = {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: string, vars?: Record<string, string | number | undefined | null>) => string;
};

const I18nContext = createContext<I18nContextValue | null>(null);

export const I18nProvider = ({ children }: { children: React.ReactNode }) => {
  const [lang, setLangState] = useState<Language>(getCurrentLanguage());

  useEffect(() => {
    loadStoredLanguage().then(setLangState);
  }, []);

  const setLang = useCallback((next: Language) => {
    setLangState(next);
    void storeLanguage(next);
  }, []);

  const t = useCallback(
    (key: string, vars?: Record<string, string | number | undefined | null>) =>
      translate(lang, key, vars),
    [lang],
  );

  const value = useMemo(() => ({ lang, setLang, t }), [lang, setLang, t]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
};

export const useI18n = (): I18nContextValue => {
  const ctx = useContext(I18nContext);
  if (!ctx) {
    throw new Error('useI18n must be used within I18nProvider');
  }
  return ctx;
};

export { LANGUAGE_OPTIONS, type Language };
export { getCurrentLanguage } from './store';
