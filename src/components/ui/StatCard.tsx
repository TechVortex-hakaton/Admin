import type { ComponentType } from 'react';
import { cn } from '@/utils/cn';

interface StatCardProps {
  label: string;
  value: string | number;
  icon: ComponentType<{ className?: string }>;
  accent?: 'blue' | 'emerald' | 'amber' | 'violet' | 'rose';
  isLoading?: boolean;
}

const accentClasses = {
  blue: 'bg-blue-50 text-blue-600',
  emerald: 'bg-emerald-50 text-emerald-600',
  amber: 'bg-amber-50 text-amber-600',
  violet: 'bg-violet-50 text-violet-600',
  rose: 'bg-rose-50 text-rose-600',
};

export function StatCard({ label, value, icon: Icon, accent = 'blue', isLoading }: StatCardProps) {
  return (
    <div className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className={cn('flex h-11 w-11 shrink-0 items-center justify-center rounded-lg', accentClasses[accent])}>
        <Icon className="h-5 w-5" />
      </div>
      <div className="min-w-0">
        <p className="text-sm text-slate-500">{label}</p>
        {isLoading ? (
          <div className="mt-1 h-6 w-16 animate-pulse rounded bg-slate-200" />
        ) : (
          <p className="text-xl font-semibold text-slate-900">{value}</p>
        )}
      </div>
    </div>
  );
}
