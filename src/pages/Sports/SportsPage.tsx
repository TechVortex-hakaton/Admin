import { useMemo, useState } from 'react';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import { DataTable, type Column } from '@/components/ui/DataTable';
import { SearchInput } from '@/components/ui/SearchInput';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { SportFormModal } from '@/components/sports/SportFormModal';
import { useDebounce } from '@/hooks/useDebounce';
import { useDeleteSport, useSports, useUpdateSport } from '@/hooks/useSports';
import type { Sport } from '@/types';

export function SportsPage() {
  const { data: sports, isLoading, isError, refetch } = useSports();
  const updateSport = useUpdateSport();
  const deleteSport = useDeleteSport();

  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search);
  const [formState, setFormState] = useState<{ open: boolean; sport: Sport | null }>({
    open: false,
    sport: null,
  });
  const [deleteTarget, setDeleteTarget] = useState<Sport | null>(null);

  const filtered = useMemo(() => {
    const q = debouncedSearch.toLowerCase();
    return (sports ?? []).filter(
      (s) => !q || s.title.toLowerCase().includes(q) || (s.category ?? '').toLowerCase().includes(q),
    );
  }, [sports, debouncedSearch]);

  const columns: Column<Sport>[] = [
    {
      key: 'title',
      header: 'Title',
      sortValue: (row) => row.title,
      render: (row) => <span className="font-medium text-slate-900">{row.title}</span>,
    },
    { key: 'category', header: 'Category', sortValue: (row) => row.category ?? '', render: (row) => row.category ?? '—' },
    {
      key: 'duration',
      header: 'Duration',
      sortValue: (row) => row.duration ?? -1,
      render: (row) => (row.duration != null ? `${row.duration} min` : '—'),
    },
    { key: 'difficulty', header: 'Difficulty', sortValue: (row) => row.difficulty ?? '', render: (row) => row.difficulty ?? '—' },
    {
      key: 'calories',
      header: 'Calories',
      sortValue: (row) => row.calories ?? -1,
      render: (row) => row.calories ?? '—',
    },
    {
      key: 'status',
      header: 'Active',
      sortValue: (row) => Number(row.isActive),
      render: (row) => (
        <button
          type="button"
          onClick={() => updateSport.mutate({ id: row.id, payload: { isActive: !row.isActive } })}
        >
          <Badge className={row.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-600'}>
            {row.isActive ? 'Active' : 'Inactive'}
          </Badge>
        </button>
      ),
    },
    {
      key: 'actions',
      header: '',
      className: 'text-right',
      render: (row) => (
        <div className="flex justify-end gap-1">
          <button
            type="button"
            onClick={() => setFormState({ open: true, sport: row })}
            className="rounded-md p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-700"
            title="Edit"
          >
            <Pencil className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => setDeleteTarget(row)}
            className="rounded-md p-1.5 text-slate-500 hover:bg-rose-50 hover:text-rose-600"
            title="Delete"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <SearchInput
          placeholder="Search sports…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="sm:max-w-xs"
        />
        <Button icon={<Plus className="h-4 w-4" />} onClick={() => setFormState({ open: true, sport: null })}>
          Add sport
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={filtered}
        rowKey={(row) => row.id}
        isLoading={isLoading}
        isError={isError}
        onRetry={refetch}
        emptyTitle="No sports found"
        emptyDescription="Add a sport to get started."
      />

      <SportFormModal
        isOpen={formState.open}
        sport={formState.sport}
        onClose={() => setFormState({ open: false, sport: null })}
      />

      <ConfirmDialog
        isOpen={!!deleteTarget}
        title="Delete sport"
        description={`This will permanently delete "${deleteTarget?.title}". This action cannot be undone.`}
        confirmLabel="Delete"
        isLoading={deleteSport.isPending}
        onConfirm={() => {
          if (!deleteTarget) return;
          deleteSport.mutate(deleteTarget.id, { onSuccess: () => setDeleteTarget(null) });
        }}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
