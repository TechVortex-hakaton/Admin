import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, ChevronDown, LogOut, Menu, Settings } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { getLocalAvatar } from '@/utils/avatar';
import { ThemeSwitcher } from './ThemeSwitcher';
import { LanguageSwitcher } from './LanguageSwitcher';

interface NavbarProps {
  onMenuClick: () => void;
  title: string;
}

export function Navbar({ onMenuClick, title }: NavbarProps) {
  const { user, logout } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const avatar = user ? getLocalAvatar(user.id) : null;
  const initials = (user?.fullName ?? 'A')
    .split(' ')
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-20 flex items-center justify-between border-b border-slate-200/80 bg-white/80 px-4 py-3.5 backdrop-blur-md dark:border-slate-800/80 dark:bg-slate-900/80 green:border-primary-100 green:bg-primary-50/70 sm:px-6">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onMenuClick}
          className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 lg:hidden dark:text-slate-400 dark:hover:bg-slate-800"
          aria-label="Open sidebar"
        >
          <Menu className="h-5 w-5" />
        </button>
        <h1 className="text-lg font-semibold tracking-tight text-slate-900 dark:text-white">{title}</h1>
      </div>

      <div className="flex items-center gap-2">
        <LanguageSwitcher />
        <ThemeSwitcher />

        <button
          type="button"
          className="relative rounded-full p-2 text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
          aria-label="Notifications"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-accent-500 ring-2 ring-white dark:ring-slate-900" />
        </button>

        <div className="relative" ref={menuRef}>
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            className="flex items-center gap-2 rounded-full py-1 pl-1 pr-2 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            {avatar ? (
              <img src={avatar} alt="" className="h-8 w-8 rounded-full object-cover" />
            ) : (
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-primary-500 to-accent-500 text-xs font-semibold text-white">
                {initials}
              </div>
            )}
            <div className="hidden text-left sm:block">
              <p className="text-sm font-medium leading-tight text-slate-900 dark:text-slate-100">
                {user?.fullName}
              </p>
              <p className="text-xs leading-tight text-slate-500 dark:text-slate-400">{user?.email}</p>
            </div>
            <ChevronDown className="hidden h-4 w-4 text-slate-400 sm:block" />
          </button>

          {menuOpen && (
            <div className="absolute right-0 top-full mt-2 w-52 animate-fade-in rounded-xl border border-slate-200 bg-white p-1.5 shadow-card dark:border-slate-700 dark:bg-slate-800">
              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  navigate('/settings');
                }}
                className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-sm text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-700"
              >
                <Settings className="h-4 w-4 text-slate-400" />
                {t('nav.settings')}
              </button>
              <button
                type="button"
                onClick={logout}
                className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-sm text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40"
              >
                <LogOut className="h-4 w-4" />
                {t('nav.logout')}
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
