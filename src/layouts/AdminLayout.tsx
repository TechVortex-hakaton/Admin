import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from '@/components/Sidebar';
import { Navbar } from '@/components/Navbar';
import { useLanguage } from '@/context/LanguageContext';

const PAGE_TITLE_KEYS: Record<string, string> = {
  '/dashboard': 'nav.dashboard',
  '/users': 'nav.users',
  '/doctors': 'nav.doctors',
  '/patients': 'nav.patients',
  '/appointments': 'nav.appointments',
  '/articles': 'nav.articles',
  '/sports': 'nav.sports',
  '/categories': 'nav.categories',
  '/settings': 'nav.settings',
};

export function AdminLayout() {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const { t } = useLanguage();
  const titleKey = PAGE_TITLE_KEYS[location.pathname];
  const title = titleKey ? t(titleKey) : 'Medix Admin';

  return (
    <div className="flex h-screen overflow-hidden bg-white dark:bg-slate-950 green:bg-primary-50/40">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex min-w-0 flex-1 flex-col">
        <Navbar onMenuClick={() => setSidebarOpen(true)} title={title} />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          <div className="mx-auto max-w-7xl animate-fade-in">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
