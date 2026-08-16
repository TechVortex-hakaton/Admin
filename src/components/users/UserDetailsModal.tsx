import type { ReactNode } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Badge } from '@/components/ui/Badge';
import { formatDateTime } from '@/utils/format';
import { ROLE_LABELS } from '@/utils/constants';
import type { User } from '@/types';

interface UserDetailsModalProps {
  user: User | null;
  onClose: () => void;
}

function Row({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="flex items-center justify-between border-b border-slate-100 py-2.5 last:border-0">
      <span className="text-sm text-slate-500">{label}</span>
      <span className="text-sm font-medium text-slate-900">{value}</span>
    </div>
  );
}

export function UserDetailsModal({ user, onClose }: UserDetailsModalProps) {
  return (
    <Modal isOpen={!!user} onClose={onClose} title="User details" size="sm">
      {user && (
        <div>
          <Row label="Full name" value={user.fullName} />
          <Row label="Email" value={user.email} />
          <Row label="Role" value={ROLE_LABELS[user.role]} />
          <Row
            label="Status"
            value={
              <Badge className={user.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}>
                {user.isActive ? 'Active' : 'Blocked'}
              </Badge>
            }
          />
          <Row label="Created" value={formatDateTime(user.createdAt)} />
          <Row label="Updated" value={formatDateTime(user.updatedAt)} />
        </div>
      )}
    </Modal>
  );
}
