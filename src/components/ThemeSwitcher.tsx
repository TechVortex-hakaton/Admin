import { Leaf, Moon, Sun } from 'lucide-react';
import { useTheme, type Theme } from '@/context/ThemeContext';
import { cn } from '@/utils/cn';

const options: { value: Theme; icon: typeof Sun }[] = [
  { value: 'light', icon: Sun },
  { value: 'dark', icon: Moon },
  { value: 'green', icon: Leaf },
];

interface ThemeSwitcherProps {
  className?: string;
}

export function ThemeSwitcher({ className }: ThemeSwitcherProps) {
  const { theme, setTheme } = useTheme();

  return (
    <div
      className={cn(
        'flex items-center gap-0.5 rounded-full bg-slate-100 p-1 dark:bg-slate-800 green:bg-primary-100',
        className,
      )}
    >
      {options.map(({ value, icon: Icon }) => (
        <button
          key={value}
          type="button"
          onClick={() => setTheme(value)}
          aria-label={value}
          className={cn(
            'flex h-7 w-7 items-center justify-center rounded-full transition-colors',
            theme === value
              ? 'bg-white text-primary-600 shadow-soft dark:bg-slate-700 dark:text-primary-400 green:bg-white green:text-primary-700'
              : 'text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 green:text-primary-500/70 green:hover:text-primary-700',
          )}
        >
          <Icon className="h-3.5 w-3.5" />
        </button>
      ))}
    </div>
  );
}
