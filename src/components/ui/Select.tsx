import { forwardRef } from 'react';
import type { SelectHTMLAttributes } from 'react';
import { cn } from '@/utils/cn';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, className, id, children, ...props }, ref) => {
    const inputId = id ?? props.name;
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className="text-sm font-medium text-slate-700">
            {label}
          </label>
        )}
        <select
          id={inputId}
          ref={ref}
          className={cn(
            'w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-900 bg-white shadow-soft transition-shadow',
            'focus:outline-none focus:ring-2 focus:ring-primary-500/40 focus:border-primary-500',
            error && 'border-rose-300 focus:ring-rose-500/30 focus:border-rose-400',
            className,
          )}
          {...props}
        >
          {children}
        </select>
        {error && <p className="text-xs text-rose-600">{error}</p>}
      </div>
    );
  },
);
Select.displayName = 'Select';
