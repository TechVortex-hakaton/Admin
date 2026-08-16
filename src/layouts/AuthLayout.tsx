import { Outlet } from 'react-router-dom';
import { CalendarCheck2, ShieldCheck, Stethoscope } from 'lucide-react';
import logoMark from '@/assets/logo-mark.jpg';

const highlights = [
  { icon: Stethoscope, text: 'Manage doctors, patients and appointments in one place' },
  { icon: CalendarCheck2, text: 'Track today’s schedule at a glance' },
  { icon: ShieldCheck, text: 'Role-based access, built for admins only' },
];

export function AuthLayout() {
  return (
    <div className="flex min-h-screen bg-gradient-to-b from-[#eaf7f8] to-[#f4fbfb]">
      {/* Brand panel */}
      <div className="relative hidden w-1/2 overflow-hidden bg-[#04171c] lg:flex lg:flex-col lg:justify-between lg:p-12">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[#0f4a52] via-[#0a2e34] to-[#04171c]" />
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
          <img
            src={logoMark}
            alt="Medix"
            className="h-11 w-11 rounded-xl object-cover shadow-glow ring-1 ring-white/20"
          />
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
          <img src={logoMark} alt="Medix" className="h-10 w-10 rounded-xl object-cover shadow-glow" />
          <span className="text-lg font-semibold text-slate-900">Medix</span>
        </div>

        <div className="w-full max-w-sm animate-fade-in">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
