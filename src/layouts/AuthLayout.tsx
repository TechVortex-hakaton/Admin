import { Outlet } from 'react-router-dom';
import { Activity, CalendarCheck2, ShieldCheck, Stethoscope } from 'lucide-react';

const highlights = [
  { icon: Stethoscope, text: 'Manage doctors, patients and appointments in one place' },
  { icon: CalendarCheck2, text: 'Track today’s schedule at a glance' },
  { icon: ShieldCheck, text: 'Role-based access, built for admins only' },
];

export function AuthLayout() {
  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Brand panel */}
      <div className="relative hidden w-1/2 overflow-hidden bg-slate-950 lg:flex lg:flex-col lg:justify-between lg:p-12">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary-700 via-primary-900 to-slate-950" />
        <div className="pointer-events-none absolute -left-24 top-1/4 h-72 w-72 animate-blob rounded-full bg-accent-500/30 blur-3xl" />
        <div
          className="pointer-events-none absolute -right-16 bottom-1/4 h-80 w-80 animate-blob rounded-full bg-primary-400/30 blur-3xl"
          style={{ animationDelay: '4s' }}
        />
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              'linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)',
            backgroundSize: '32px 32px',
          }}
        />

        <div className="relative flex items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 backdrop-blur-sm ring-1 ring-white/20">
            <Activity className="h-5 w-5 text-white" />
          </div>
          <span className="text-lg font-semibold text-white">Medix</span>
        </div>

        <div className="relative flex flex-col gap-8">
          <h1 className="max-w-md text-4xl font-bold leading-tight text-white">
            Run the whole platform from a single dashboard.
          </h1>
          <div className="flex flex-col gap-4">
            {highlights.map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-3 text-slate-200">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/10 ring-1 ring-white/10">
                  <Icon className="h-[18px] w-[18px]" />
                </div>
                <p className="text-sm">{text}</p>
              </div>
            ))}
          </div>
        </div>

        <p className="relative text-xs text-slate-400">
          &copy; {new Date().getFullYear()} Medix &mdash; Admin Panel
        </p>
      </div>

      {/* Form panel */}
      <div className="flex w-full flex-col items-center justify-center px-6 py-12 lg:w-1/2">
        <div className="mb-8 flex items-center gap-2.5 lg:hidden">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary-600 to-accent-500 text-white shadow-glow">
            <Activity className="h-5 w-5" />
          </div>
          <span className="text-lg font-semibold text-slate-900">Medix</span>
        </div>

        <div className="w-full max-w-sm animate-fade-in">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
