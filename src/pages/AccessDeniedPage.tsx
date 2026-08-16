import { ShieldAlert } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';

export function AccessDeniedPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-slate-50 px-4 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-rose-100 text-rose-600">
        <ShieldAlert className="h-7 w-7" />
      </div>
      <div>
        <h1 className="text-lg font-semibold text-slate-900">Access denied</h1>
        <p className="mt-1 text-sm text-slate-500">
          Your account does not have permission to view the admin panel.
        </p>
      </div>
      <Link to="/login">
        <Button variant="secondary">Back to login</Button>
      </Link>
    </div>
  );
}
