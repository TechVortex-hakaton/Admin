import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Stethoscope,
  HeartPulse,
  CalendarClock,
  Newspaper,
  Dumbbell,
  Tag,
  Settings,
  LogOut,
  X,
} from 'lucide-react';
import { cn } from '@/utils/cn';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { ROLE_LABELS } from '@/utils/constants';
import { getLocalAvatar } from '@/utils/avatar';
import logoMark from '@/assets/logo-mark.jpg';

const managementLinks = [
  { to: '/users', labelKey: 'nav.users', icon: Users },
  { to: '/doctors', labelKey: 'nav.doctors', icon: Stethoscope },
  { to: '/patients', labelKey: 'nav.patients', icon: HeartPulse },
  { to: '/appointments', labelKey: 'nav.appointments', icon: CalendarClock },
];

const contentLinks = [
  { to: '/articles', labelKey: 'nav.articles', icon: Newspaper },
  { to: '/sports', labelKey: 'nav.sports', icon: Dumbbell },
  { to: '/categories', labelKey: 'nav.categories', icon: Tag },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

function NavItem({
  to,
  label,
  icon: Icon,
  onNavigate,
}: {
  to: string;
  label: string;
  icon: typeof Users;
  onNavigate: () => void;
}) {
  return (
    <NavLink
      to={to}
      onClick={onNavigate}
      className={({ isActive }) =>
        cn(
          'group relative flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-all',
          isActive
            ? 'bg-primary-600 text-white shadow-glow'
            : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white',
        )
      }
    >
      <Icon className="h-[18px] w-[18px] shrink-0" />
      {label}
    </NavLink>
  );
}

function SectionLabel({ children }: { children: string }) {
  return (
    <p className="px-3 pb-1.5 pt-5 text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
      {children}
    </p>
  );
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const { user, logout } = useAuth();
  const { t } = useLanguage();
  const avatar = user ? getLocalAvatar(user.id) : null;
  const initials = (user?.fullName ?? 'A')
    .split(' ')
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-slate-900/40 backdrop-blur-sm lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-slate-200 bg-white transition-transform lg:static lg:translate-x-0 dark:border-slate-800 dark:bg-slate-900',
          isOpen ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <div className="flex items-center justify-between px-4 py-5">
          <div className="flex items-center gap-2.5">
            <img
              src={logoMark}
              alt="Medix"
              className="h-9 w-9 shrink-0 rounded-xl object-cover shadow-soft ring-1 ring-slate-900/5 dark:ring-white/10"
            />
            <div className="leading-tight">
              <span className="block text-sm font-semibold text-slate-900 dark:text-white">Medix</span>
              <span className="block text-[11px] font-medium text-slate-400 dark:text-slate-500">
                Admin Panel
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-1 text-slate-400 hover:bg-slate-100 lg:hidden dark:hover:bg-slate-800"
            aria-label="Close sidebar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 pb-4">
          <NavItem to="/dashboard" label={t('nav.dashboard')} icon={LayoutDashboard} onNavigate={onClose} />

          <SectionLabel>{t('nav.management')}</SectionLabel>
          <div className="flex flex-col gap-0.5">
            {managementLinks.map((link) => (
              <NavItem key={link.to} to={link.to} icon={link.icon} label={t(link.labelKey)} onNavigate={onClose} />
            ))}
          </div>

          <SectionLabel>{t('nav.content')}</SectionLabel>
          <div className="flex flex-col gap-0.5">
            {contentLinks.map((link) => (
              <NavItem key={link.to} to={link.to} icon={link.icon} label={t(link.labelKey)} onNavigate={onClose} />
            ))}
          </div>

          <SectionLabel>{t('nav.system')}</SectionLabel>
          <div className="flex flex-col gap-0.5">
            <NavItem to="/settings" label={t('nav.settings')} icon={Settings} onNavigate={onClose} />
          </div>
        </nav>

        <div className="border-t border-slate-100 p-3 dark:border-slate-800">
          <div className="flex items-center gap-2.5 rounded-xl px-2 py-2">
            {avatar ? (
              <img src={avatar} alt="" className="h-9 w-9 shrink-0 rounded-full object-cover" />
            ) : (
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary-500 to-accent-500 text-xs font-semibold text-white">
                {initials}
              </div>
            )}
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium leading-tight text-slate-900 dark:text-slate-100">
                {user?.fullName}
              </p>
              <p className="truncate text-xs leading-tight text-slate-400 dark:text-slate-500">
                {user ? ROLE_LABELS[user.role] : ''}
              </p>
            </div>
            <button
              type="button"
              onClick={logout}
              className="shrink-0 rounded-lg p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/40"
              title={t('nav.logout')}
              aria-label={t('nav.logout')}
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
