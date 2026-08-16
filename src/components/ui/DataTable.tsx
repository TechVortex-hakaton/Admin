import type { ReactNode } from 'react';
import { useMemo, useState } from 'react';
import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react';
import { cn } from '@/utils/cn';
import { usePagination } from '@/hooks/usePagination';
import { Pagination } from './Pagination';
import { TableSkeleton } from './LoadingSkeleton';
import { EmptyState } from './EmptyState';
import { ErrorState } from './ErrorState';

export interface Column<T> {
  key: string;
  header: string;
  render: (row: T) => ReactNode;
  sortValue?: (row: T) => string | number | null | undefined;
  className?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  rowKey: (row: T) => string;
  isLoading?: boolean;
  isError?: boolean;
  onRetry?: () => void;
  emptyTitle?: string;
  emptyDescription?: string;
  pageSize?: number;
}

type SortDirection = 'asc' | 'desc' | null;

export function DataTable<T>({
  columns,
  data,
  rowKey,
  isLoading,
  isError,
  onRetry,
  emptyTitle,
  emptyDescription,
  pageSize = 10,
}: DataTableProps<T>) {
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<SortDirection>(null);

  const sorted = useMemo(() => {
    if (!sortKey || !sortDir) return data;
    const column = columns.find((c) => c.key === sortKey);
    if (!column?.sortValue) return data;
    const copy = [...data];
    copy.sort((a, b) => {
      const av = column.sortValue!(a);
      const bv = column.sortValue!(b);
      if (av == null && bv == null) return 0;
      if (av == null) return 1;
      if (bv == null) return -1;
      if (av < bv) return sortDir === 'asc' ? -1 : 1;
      if (av > bv) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });
    return copy;
  }, [data, sortKey, sortDir, columns]);

  const { page, totalPages, pageItems, goToPage } = usePagination(sorted, pageSize);

  function toggleSort(column: Column<T>) {
    if (!column.sortValue) return;
    if (sortKey !== column.key) {
      setSortKey(column.key);
      setSortDir('asc');
      return;
    }
    if (sortDir === 'asc') {
      setSortDir('desc');
      return;
    }
    setSortKey(null);
    setSortDir(null);
  }

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-slate-200 bg-slate-50">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={cn(
                    'whitespace-nowrap px-4 py-3 font-medium text-slate-500',
                    column.sortValue && 'cursor-pointer select-none hover:text-slate-700',
                    column.className,
                  )}
                  onClick={() => toggleSort(column)}
                >
                  <span className="inline-flex items-center gap-1">
                    {column.header}
                    {column.sortValue &&
                      (sortKey === column.key ? (
                        sortDir === 'asc' ? (
                          <ArrowUp className="h-3.5 w-3.5" />
                        ) : (
                          <ArrowDown className="h-3.5 w-3.5" />
                        )
                      ) : (
                        <ArrowUpDown className="h-3.5 w-3.5 opacity-40" />
                      ))}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          {!isLoading && !isError && data.length > 0 && (
            <tbody className="divide-y divide-slate-100">
              {pageItems.map((row) => (
                <tr key={rowKey(row)} className="hover:bg-slate-50/70">
                  {columns.map((column) => (
                    <td key={column.key} className={cn('whitespace-nowrap px-4 py-3.5 text-slate-700', column.className)}>
                      {column.render(row)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          )}
        </table>
        {isLoading && <TableSkeleton cols={columns.length} />}
        {!isLoading && isError && <ErrorState onRetry={onRetry} />}
        {!isLoading && !isError && data.length === 0 && (
          <EmptyState title={emptyTitle} description={emptyDescription} />
        )}
      </div>
      {!isLoading && !isError && data.length > 0 && (
        <Pagination page={page} totalPages={totalPages} onPageChange={goToPage} />
      )}
    </div>
  );
}
