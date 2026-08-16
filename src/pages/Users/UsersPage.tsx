import { useMemo, useState } from 'react';
import { Eye, Lock, Trash2, Unlock } from 'lucide-react';
import { DataTable, type Column } from '@/components/ui/DataTable';
import { SearchInput } from '@/components/ui/SearchInput';
import { FilterDropdown } from '@/components/ui/FilterDropdown';
import { Badge } from '@/components/ui/Badge';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { UserDetailsModal } from '@/components/users/UserDetailsModal';
import { useDebounce } from '@/hooks/useDebounce';
import { useDeleteUser, useSetUserStatus, useUsers } from '@/hooks/useUsers';
import { formatDate } from '@/utils/format';
import { ROLE_LABELS } from '@/utils/constants';
import type { Role, User } from '@/types';

export function UsersPage() {
  const { data: users, isLoading, isError, refetch } = useUsers();
  const setStatus = useSetUserStatus();
  const deleteUser = useDeleteUser();

  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search);
  const [roleFilter, setRoleFilter] = useState('');
  const [viewUser, setViewUser] = useState<User | null>(null);
  const [statusTarget, setStatusTarget] = useState<User | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<User | null>(null);

  const filtered = useMemo(() => {
    return (users ?? []).filter((u) => {
      const matchesSearch =
        !debouncedSearch ||
        u.fullName.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        u.email.toLowerCase().includes(debouncedSearch.toLowerCase());
      const matchesRole = !roleFilter || u.role === roleFilter;
      return matchesSearch && matchesRole;
    });
  }, [users, debouncedSearch, roleFilter]);

  const columns: Column<User>[] = [
    {
      key: 'name',
      header: 'Name',
      sortValue: (row) => row.fullName,
      render: (row) => <span className="font-medium text-slate-900">{row.fullName}</span>,
    },
    { key: 'email', header: 'Email', sortValue: (row) => row.email, render: (row) => row.email },
    {
      key: 'role',
      header: 'Role',
      sortValue: (row) => row.role,
      render: (row) => <Badge>{ROLE_LABELS[row.role]}</Badge>,
    },
    {
      key: 'status',
      header: 'Status',
      sortValue: (row) => Number(row.isActive),
      render: (row) => (
        <Badge className={row.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}>
          {row.isActive ? 'Active' : 'Blocked'}
        </Badge>
      ),
    },
    {
      key: 'createdAt',
      header: 'Created At',
      sortValue: (row) => row.createdAt,
      render: (row) => formatDate(row.createdAt),
    },
    {
      key: 'actions',
      header: '',
      className: 'text-right',
      render: (row) => (
        <div className="flex justify-end gap-1">
          <button
            type="button"
            onClick={() => setViewUser(row)}
            className="rounded-md p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-700"
            title="View"
          >
            <Eye className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => setStatusTarget(row)}
            className="rounded-md p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-700"
            title={row.isActive ? 'Block' : 'Unblock'}
          >
            {row.isActive ? <Lock className="h-4 w-4" /> : <Unlock className="h-4 w-4" />}
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

  const roleOptions: Role[] = ['ADMIN', 'DOCTOR', 'PATIENT'];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <SearchInput
          placeholder="Search by name or email…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="sm:max-w-xs"
        />
        <FilterDropdown
          label="Role"
          value={roleFilter}
          onChange={setRoleFilter}
          options={roleOptions.map((r) => ({ label: ROLE_LABELS[r], value: r }))}
        />
      </div>

      <DataTable
        columns={columns}
        data={filtered}
        rowKey={(row) => row.id}
        isLoading={isLoading}
        isError={isError}
        onRetry={refetch}
        emptyTitle="No users found"
        emptyDescription="Try adjusting your search or filters."
      />

      <UserDetailsModal user={viewUser} onClose={() => setViewUser(null)} />

      <ConfirmDialog
        isOpen={!!statusTarget}
        title={statusTarget?.isActive ? 'Block user' : 'Unblock user'}
        description={
          statusTarget?.isActive
            ? `Block ${statusTarget?.fullName}? They will no longer be able to sign in.`
            : `Unblock ${statusTarget?.fullName}? They will regain access.`
        }
        confirmLabel={statusTarget?.isActive ? 'Block' : 'Unblock'}
        isDanger={!!statusTarget?.isActive}
        isLoading={setStatus.isPending}
        onConfirm={() => {
          if (!statusTarget) return;
          setStatus.mutate(
            { id: statusTarget.id, isActive: !statusTarget.isActive },
            { onSuccess: () => setStatusTarget(null) },
          );
        }}
        onCancel={() => setStatusTarget(null)}
      />

      <ConfirmDialog
        isOpen={!!deleteTarget}
        title="Delete user"
        description={`This will permanently delete ${deleteTarget?.fullName}. This action cannot be undone.`}
        confirmLabel="Delete"
        isLoading={deleteUser.isPending}
        onConfirm={() => {
          if (!deleteTarget) return;
          deleteUser.mutate(deleteTarget.id, { onSuccess: () => setDeleteTarget(null) });
        }}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
