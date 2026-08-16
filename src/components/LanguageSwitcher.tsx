import { useEffect, useRef, useState } from 'react';
import { Check, Languages } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { LOCALE_LABELS, LOCALES } from '@/i18n/translations';
import type { LanguageSetting } from '@/context/LanguageContext';
import { cn } from '@/utils/cn';

interface LanguageSwitcherProps {
  className?: string;
  dark?: boolean;
}

export function LanguageSwitcher({ className, dark = false }: LanguageSwitcherProps) {
  const { setting, setLanguage, t } = useLanguage();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  const options: { value: LanguageSetting; label: string }[] = [
    { value: 'auto', label: t('lang.auto') },
    ...LOCALES.map((locale) => ({ value: locale, label: LOCALE_LABELS[locale] })),
  ];

  return (
    <div className={cn('relative', className)} ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={t('settings.language')}
        className={cn(
          'flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-xs font-medium transition-colors',
          dark
            ? 'text-slate-200 hover:bg-white/10'
            : 'text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 green:text-primary-700 green:hover:bg-primary-100',
        )}
      >
        <Languages className="h-4 w-4" />
        <span className="hidden sm:inline">{options.find((o) => o.value === setting)?.label}</span>
      </button>

      {open && (
        <div className="absolute right-0 top-full z-30 mt-2 w-40 animate-fade-in rounded-xl border border-slate-200 bg-white p-1.5 shadow-card dark:border-slate-700 dark:bg-slate-800">
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => {
                setLanguage(option.value);
                setOpen(false);
              }}
              className="flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-left text-sm text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-700"
            >
              {option.label}
              {setting === option.value && <Check className="h-3.5 w-3.5 text-primary-600" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
