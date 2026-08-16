import { LogOut } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/context/AuthContext';
import { formatDateTime } from '@/utils/format';
import { ROLE_LABELS } from '@/utils/constants';

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between border-b border-slate-100 py-3 last:border-0">
      <span className="text-sm text-slate-500">{label}</span>
      <span className="text-sm font-medium text-slate-900">{value}</span>
    </div>
  );
}

export function SettingsPage() {
  const { user, logout } = useAuth();

  return (
    <div className="flex max-w-lg flex-col gap-6">
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="mb-2 text-sm font-semibold text-slate-900">Account</h2>
        {user && (
          <div>
            <Row label="Full name" value={user.fullName} />
            <Row label="Email" value={user.email} />
            <Row label="Role" value={ROLE_LABELS[user.role]} />
            <Row label="Member since" value={formatDateTime(user.createdAt)} />
          </div>
        )}
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="mb-3 text-sm font-semibold text-slate-900">Session</h2>
        <Button variant="danger" icon={<LogOut className="h-4 w-4" />} onClick={logout}>
          Logout
        </Button>
      </div>
    </div>
  );
}
