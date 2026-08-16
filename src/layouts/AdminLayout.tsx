import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from '@/components/Sidebar';
import { Navbar } from '@/components/Navbar';

const PAGE_TITLES: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/users': 'Users',
  '/doctors': 'Doctors',
  '/patients': 'Patients',
  '/appointments': 'Appointments',
  '/articles': 'Articles',
  '/sports': 'Sports',
  '/categories': 'Categories',
  '/settings': 'Settings',
};

export function AdminLayout() {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const title = PAGE_TITLES[location.pathname] ?? 'Admin Panel';

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex min-w-0 flex-1 flex-col">
        <Navbar onMenuClick={() => setSidebarOpen(true)} title={title} />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
