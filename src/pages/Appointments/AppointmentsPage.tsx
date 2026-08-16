import { useMemo, useState } from 'react';
import { DataTable, type Column } from '@/components/ui/DataTable';
import { FilterDropdown } from '@/components/ui/FilterDropdown';
import { Badge } from '@/components/ui/Badge';
import { useAppointments } from '@/hooks/useAppointments';
import { useDoctors } from '@/hooks/useDoctors';
import { formatDate } from '@/utils/format';
import { APPOINTMENT_STATUS_COLORS, APPOINTMENT_STATUS_LABELS } from '@/utils/constants';
import type { Appointment, AppointmentStatus } from '@/types';

export function AppointmentsPage() {
  const { data: appointments, isLoading, isError, refetch } = useAppointments();
  const { data: doctors } = useDoctors();

  const [doctorFilter, setDoctorFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');

  const filtered = useMemo(() => {
    return (appointments ?? []).filter((a) => {
      const matchesDoctor = !doctorFilter || a.doctorId === doctorFilter;
      const matchesStatus = !statusFilter || a.status === statusFilter;
      const matchesDate = !dateFilter || a.date.slice(0, 10) === dateFilter;
      return matchesDoctor && matchesStatus && matchesDate;
    });
  }, [appointments, doctorFilter, statusFilter, dateFilter]);

  const columns: Column<Appointment>[] = [
    {
      key: 'patient',
      header: 'Patient',
      sortValue: (row) => row.patient?.fullName ?? '',
      render: (row) => <span className="font-medium text-slate-900">{row.patient?.fullName ?? '—'}</span>,
    },
    {
      key: 'doctor',
      header: 'Doctor',
      sortValue: (row) => row.doctor?.fullName ?? '',
      render: (row) => row.doctor?.fullName ?? '—',
    },
    { key: 'date', header: 'Date', sortValue: (row) => row.date, render: (row) => formatDate(row.date) },
    { key: 'time', header: 'Time', sortValue: (row) => row.time, render: (row) => row.time },
    {
      key: 'reason',
      header: 'Reason',
      render: (row) => <span className="max-w-[220px] truncate">{row.reason ?? '—'}</span>,
    },
    {
      key: 'status',
      header: 'Status',
      sortValue: (row) => row.status,
      render: (row) => (
        <Badge className={APPOINTMENT_STATUS_COLORS[row.status]}>
          {APPOINTMENT_STATUS_LABELS[row.status]}
        </Badge>
      ),
    },
  ];

  const statusOptions: AppointmentStatus[] = ['PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED'];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
        <FilterDropdown
          label="Doctor"
          value={doctorFilter}
          onChange={setDoctorFilter}
          options={(doctors ?? []).map((d) => ({ label: d.fullName, value: d.id }))}
        />
        <FilterDropdown
          label="Status"
          value={statusFilter}
          onChange={setStatusFilter}
          options={statusOptions.map((s) => ({ label: APPOINTMENT_STATUS_LABELS[s], value: s }))}
        />
        <input
          type="date"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
        />
      </div>

      <DataTable
        columns={columns}
        data={filtered}
        rowKey={(row) => row.id}
        isLoading={isLoading}
        isError={isError}
        onRetry={refetch}
        emptyTitle="No appointments found"
        emptyDescription="Try adjusting your filters."
      />
    </div>
  );
}
