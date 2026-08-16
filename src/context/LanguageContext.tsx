import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { dictionaries, type Locale } from '@/i18n/translations';

export type LanguageSetting = 'auto' | Locale;

const STORAGE_KEY = 'medix_lang';

function detectLocale(): Locale {
  const lang = navigator.language?.toLowerCase() ?? '';
  if (lang.startsWith('ru')) return 'ru';
  if (lang.startsWith('uz')) return 'uz';
  return 'en';
}

function getInitialSetting(): LanguageSetting {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === 'auto' || stored === 'en' || stored === 'ru' || stored === 'uz') return stored;
  return 'auto';
}

interface LanguageContextValue {
  setting: LanguageSetting;
  locale: Locale;
  setLanguage: (setting: LanguageSetting) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [setting, setSetting] = useState<LanguageSetting>(getInitialSetting);

  const locale = setting === 'auto' ? detectLocale() : setting;

  const setLanguage = useCallback((next: LanguageSetting) => {
    setSetting(next);
    localStorage.setItem(STORAGE_KEY, next);
  }, []);

  const t = useCallback(
    (key: string) => dictionaries[locale][key] ?? dictionaries.en[key] ?? key,
    [locale],
  );

  const value = useMemo(() => ({ setting, locale, setLanguage, t }), [setting, locale, setLanguage, t]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage(): LanguageContextValue {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
}
