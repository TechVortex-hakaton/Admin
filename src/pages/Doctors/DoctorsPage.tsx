import { useMemo, useState } from 'react';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import { DataTable, type Column } from '@/components/ui/DataTable';
import { SearchInput } from '@/components/ui/SearchInput';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { DoctorFormModal } from '@/components/doctors/DoctorFormModal';
import { useDebounce } from '@/hooks/useDebounce';
import { useDeleteDoctor, useDoctors, useUpdateDoctor } from '@/hooks/useDoctors';
import type { Doctor } from '@/types';

export function DoctorsPage() {
  const { data: doctors, isLoading, isError, refetch } = useDoctors();
  const updateDoctor = useUpdateDoctor();
  const deleteDoctor = useDeleteDoctor();

  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search);
  const [formState, setFormState] = useState<{ open: boolean; doctor: Doctor | null }>({
    open: false,
    doctor: null,
  });
  const [deleteTarget, setDeleteTarget] = useState<Doctor | null>(null);

  const filtered = useMemo(() => {
    const q = debouncedSearch.toLowerCase();
    return (doctors ?? []).filter(
      (d) =>
        !q ||
        d.fullName.toLowerCase().includes(q) ||
        d.specialization.toLowerCase().includes(q) ||
        (d.email ?? '').toLowerCase().includes(q),
    );
  }, [doctors, debouncedSearch]);

  const columns: Column<Doctor>[] = [
    {
      key: 'name',
      header: 'Name',
      sortValue: (row) => row.fullName,
      render: (row) => <span className="font-medium text-slate-900">{row.fullName}</span>,
    },
    {
      key: 'specialization',
      header: 'Specialization',
      sortValue: (row) => row.specialization,
      render: (row) => row.specialization,
    },
    {
      key: 'experience',
      header: 'Experience',
      sortValue: (row) => row.experience ?? -1,
      render: (row) => (row.experience != null ? `${row.experience} yrs` : '—'),
    },
    { key: 'email', header: 'Email', sortValue: (row) => row.email ?? '', render: (row) => row.email ?? '—' },
    {
      key: 'status',
      header: 'Status',
      sortValue: (row) => Number(row.isActive),
      render: (row) => (
        <button
          type="button"
          onClick={() => updateDoctor.mutate({ id: row.id, payload: { isActive: !row.isActive } })}
        >
          <Badge className={row.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}>
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
            onClick={() => setFormState({ open: true, doctor: row })}
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
          placeholder="Search by name, specialization, email…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="sm:max-w-xs"
        />
        <Button icon={<Plus className="h-4 w-4" />} onClick={() => setFormState({ open: true, doctor: null })}>
          Add doctor
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={filtered}
        rowKey={(row) => row.id}
        isLoading={isLoading}
        isError={isError}
        onRetry={refetch}
        emptyTitle="No doctors found"
        emptyDescription="Add a doctor to get started."
      />

      <DoctorFormModal
        isOpen={formState.open}
        doctor={formState.doctor}
        onClose={() => setFormState({ open: false, doctor: null })}
      />

      <ConfirmDialog
        isOpen={!!deleteTarget}
        title="Delete doctor"
        description={`This will permanently delete ${deleteTarget?.fullName} and their account. This action cannot be undone.`}
        confirmLabel="Delete"
        isLoading={deleteDoctor.isPending}
        onConfirm={() => {
          if (!deleteTarget) return;
          deleteDoctor.mutate(deleteTarget.id, { onSuccess: () => setDeleteTarget(null) });
        }}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
