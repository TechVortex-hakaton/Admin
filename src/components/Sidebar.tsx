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

const managementLinks = [
  { to: '/users', label: 'Users', icon: Users },
  { to: '/doctors', label: 'Doctors', icon: Stethoscope },
  { to: '/patients', label: 'Patients', icon: HeartPulse },
  { to: '/appointments', label: 'Appointments', icon: CalendarClock },
];

const contentLinks = [
  { to: '/articles', label: 'Articles', icon: Newspaper },
  { to: '/sports', label: 'Sports', icon: Dumbbell },
  { to: '/categories', label: 'Categories', icon: Tag },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

function NavItem({ to, label, icon: Icon, onNavigate }: { to: string; label: string; icon: typeof Users; onNavigate: () => void }) {
  return (
    <NavLink
      to={to}
      onClick={onNavigate}
      className={({ isActive }) =>
        cn(
          'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
          isActive
            ? 'bg-primary-50 text-primary-700'
            : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900',
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
    <p className="px-3 pb-1.5 pt-4 text-xs font-semibold uppercase tracking-wider text-slate-400">
      {children}
    </p>
  );
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const { logout } = useAuth();

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-slate-900/40 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-slate-200 bg-white transition-transform lg:static lg:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <div className="flex items-center justify-between px-4 py-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-600 text-sm font-bold text-white">
              A
            </div>
            <span className="text-sm font-semibold text-slate-900">Admin Panel</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-1 text-slate-400 hover:bg-slate-100 lg:hidden"
            aria-label="Close sidebar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 pb-4">
          <NavItem to="/dashboard" label="Dashboard" icon={LayoutDashboard} onNavigate={onClose} />

          <SectionLabel>Management</SectionLabel>
          <div className="flex flex-col gap-0.5">
            {managementLinks.map((link) => (
              <NavItem key={link.to} {...link} onNavigate={onClose} />
            ))}
          </div>

          <SectionLabel>Content</SectionLabel>
          <div className="flex flex-col gap-0.5">
            {contentLinks.map((link) => (
              <NavItem key={link.to} {...link} onNavigate={onClose} />
            ))}
          </div>

          <SectionLabel>System</SectionLabel>
          <div className="flex flex-col gap-0.5">
            <NavItem to="/settings" label="Settings" icon={Settings} onNavigate={onClose} />
            <button
              type="button"
              onClick={logout}
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900"
            >
              <LogOut className="h-[18px] w-[18px] shrink-0" />
              Logout
            </button>
          </div>
        </nav>
      </aside>
    </>
  );
}
