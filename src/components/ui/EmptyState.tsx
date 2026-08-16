import type { ComponentType } from 'react';
import { Inbox } from 'lucide-react';

interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: ComponentType<{ className?: string }>;
}

export function EmptyState({
  title = 'No data found',
  description = 'There is nothing to show here yet.',
  icon: Icon = Inbox,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 px-6 py-16 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400">
        <Icon className="h-6 w-6" />
      </div>
      <p className="text-sm font-medium text-slate-700">{title}</p>
      <p className="text-sm text-slate-500">{description}</p>
    </div>
  );
}
