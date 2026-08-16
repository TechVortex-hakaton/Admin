import { useMemo, useState } from 'react';
import { DataTable, type Column } from '@/components/ui/DataTable';
import { SearchInput } from '@/components/ui/SearchInput';
import { Badge } from '@/components/ui/Badge';
import { useDebounce } from '@/hooks/useDebounce';
import { usePatients } from '@/hooks/usePatients';
import { useAppointments } from '@/hooks/useAppointments';
import { calculateAge, formatDate } from '@/utils/format';
import type { Patient } from '@/types';

export function PatientsPage() {
  const { data: patients, isLoading, isError, refetch } = usePatients();
  const { data: appointments } = useAppointments();

  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search);

  const doctorByPatient = useMemo(() => {
    const map = new Map<string, string>();
    (appointments ?? [])
      .slice()
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .forEach((a) => {
        if (!map.has(a.patientId) && a.doctor?.fullName) {
          map.set(a.patientId, a.doctor.fullName);
        }
      });
    return map;
  }, [appointments]);

  const filtered = useMemo(() => {
    const q = debouncedSearch.toLowerCase();
    return (patients ?? []).filter(
      (p) =>
        !q ||
        p.fullName.toLowerCase().includes(q) ||
        (p.phone ?? '').toLowerCase().includes(q),
    );
  }, [patients, debouncedSearch]);

  const columns: Column<Patient>[] = [
    {
      key: 'name',
      header: 'Name',
      sortValue: (row) => row.fullName,
      render: (row) => <span className="font-medium text-slate-900">{row.fullName}</span>,
    },
    {
      key: 'age',
      header: 'Age',
      sortValue: (row) => calculateAge(row.birthDate) ?? -1,
      render: (row) => calculateAge(row.birthDate) ?? '—',
    },
    { key: 'phone', header: 'Phone', sortValue: (row) => row.phone ?? '', render: (row) => row.phone ?? '—' },
    {
      key: 'doctor',
      header: 'Doctor',
      render: (row) => doctorByPatient.get(row.id) ?? <span className="text-slate-400">No visits yet</span>,
    },
    {
      key: 'status',
      header: 'Status',
      render: (row) =>
        row.user ? (
          <Badge className={row.user.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}>
            {row.user.isActive ? 'Active' : 'Blocked'}
          </Badge>
        ) : (
          '—'
        ),
    },
    {
      key: 'createdAt',
      header: 'Created At',
      sortValue: (row) => row.createdAt,
      render: (row) => formatDate(row.createdAt),
    },
  ];

  return (
    <div className="flex flex-col gap-4">
      <SearchInput
        placeholder="Search by name or phone…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="sm:max-w-xs"
      />

      <DataTable
        columns={columns}
        data={filtered}
        rowKey={(row) => row.id}
        isLoading={isLoading}
        isError={isError}
        onRetry={refetch}
        emptyTitle="No patients found"
        emptyDescription="Try adjusting your search."
      />
    </div>
  );
}
