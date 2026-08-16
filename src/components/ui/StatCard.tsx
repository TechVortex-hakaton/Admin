import type { ComponentType } from 'react';
import { cn } from '@/utils/cn';

interface StatCardProps {
  label: string;
  value: string | number;
  icon: ComponentType<{ className?: string }>;
  accent?: 'blue' | 'emerald' | 'amber' | 'violet' | 'rose' | 'cyan';
  isLoading?: boolean;
}

const accentClasses: Record<NonNullable<StatCardProps['accent']>, string> = {
  blue: 'from-blue-500 to-blue-600',
  emerald: 'from-emerald-500 to-emerald-600',
  amber: 'from-amber-500 to-amber-600',
  violet: 'from-violet-500 to-violet-600',
  rose: 'from-rose-500 to-rose-600',
  cyan: 'from-cyan-500 to-cyan-600',
};

export function StatCard({ label, value, icon: Icon, accent = 'blue', isLoading }: StatCardProps) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-card">
      <div
        className={cn(
          'pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-gradient-to-br opacity-[0.08] transition-transform group-hover:scale-125',
          accentClasses[accent],
        )}
      />
      <div className="relative flex items-center gap-4">
        <div
          className={cn(
            'flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br text-white shadow-soft',
            accentClasses[accent],
          )}
        >
          <Icon className="h-5 w-5" />
        </div>
        <div className="min-w-0">
          <p className="text-sm text-slate-500">{label}</p>
          {isLoading ? (
            <div className="mt-1.5 h-6 w-16 animate-pulse rounded bg-slate-200" />
          ) : (
            <p className="text-2xl font-bold tracking-tight text-slate-900">{value}</p>
          )}
        </div>
      </div>
    </div>
  );
}
